using Microsoft.EntityFrameworkCore;
using SELF.Application.Applications.DTOs;
using SELF.Application.Applications.Interfaces;
using SELF.Domain.Entities;
using SELF.Domain.Enums;
using SELF.Infrastructure.Data;
using SELF.Shared.Exceptions;

namespace SELF.Application.Applications;

public class ApplicationService(ApplicationDbContext context) : IApplicationService
{
    private readonly ApplicationDbContext _context = context;

    public async Task<ApplicationResponse> SubmitProposalAsync(Guid ngoId, ProjectProposalRequest request)
    {
        var ngo = await _context.NGOs.FirstOrDefaultAsync(n => n.Id == ngoId && !n.IsDeleted)
            ?? throw new NotFoundException("NGO organization not found.");

        var scheme = await _context.Schemes.FirstOrDefaultAsync(s => s.Id == request.SchemeId && !s.IsDeleted)
            ?? throw new NotFoundException("Selected scheme not found.");

        if (string.IsNullOrWhiteSpace(request.Title) || request.Budget.Count == 0)
        {
            throw new BadRequestException("Please provide a project title and at least one budget item.");
        }

        var randomNum = new Random().Next(100, 999);
        var appNumber = $"NGO-{DateTime.UtcNow.Year}-00{randomNum}";

        var totalBudgetAmount = request.Budget.Sum(b => b.Total > 0 ? b.Total : b.Quantity * b.UnitCost);
        var grantDisplay = $"₹{(totalBudgetAmount / 100000m):F2} Lakhs";

        var application = new Domain.Entities.Application
        {
            ApplicationNumber = appNumber,
            Title = request.Title.Trim(),
            SchemeId = scheme.Id,
            NgoId = ngo.Id,
            Status = ApplicationStatusType.ProposalSubmitted,
            GrantRequested = totalBudgetAmount,
            GrantRequestedDisplay = grantDisplay,
            SubmittedAt = DateTime.UtcNow
        };

        application.Project = new Project
        {
            Abstract = request.Abstract,
            State = request.State,
            District = request.District,
            Block = request.Block,
            Villages = request.Villages,
            MaleBeneficiaries = request.Beneficiaries.MaleCount,
            FemaleBeneficiaries = request.Beneficiaries.FemaleCount,
            TotalBeneficiaries = request.Beneficiaries.TotalCount,
            StBeneficiaries = request.Beneficiaries.StCount,
            Activities = request.Activities,
            ExpectedOutcomes = request.ExpectedOutcomes
        };

        application.Budget = new Budget
        {
            TotalAmount = totalBudgetAmount,
            Items = request.Budget.Select(b => new BudgetItem
            {
                Category = b.Category,
                Description = b.Description,
                Quantity = b.Quantity,
                UnitCost = b.UnitCost,
                Total = b.Total > 0 ? b.Total : b.Quantity * b.UnitCost
            }).ToList()
        };

        var todayStr = DateTime.UtcNow.ToString("yyyy-MM-dd");
        application.Reviews = new List<ApplicationReview>
        {
            new() { StageName = "Registered", Status = ReviewStatus.Completed, Remarks = "NGO registration verified.", ActionDate = DateTime.UtcNow.AddDays(-1), Sequence = 1 },
            new() { StageName = "Proposal Submitted", Status = ReviewStatus.Completed, Remarks = "Project Proposal submitted via online portal.", ActionDate = DateTime.UtcNow, Sequence = 2 },
            new() { StageName = "District Review", Status = ReviewStatus.Current, Remarks = "Awaiting inspection scheduler allocation.", Sequence = 3 },
            new() { StageName = "State Review", Status = ReviewStatus.Pending, Sequence = 4 },
            new() { StageName = "Approved", Status = ReviewStatus.Pending, Sequence = 5 },
            new() { StageName = "Sanctioned", Status = ReviewStatus.Pending, Sequence = 6 }
        };

        await _context.Applications.AddAsync(application);
        await _context.SaveChangesAsync();

        return new ApplicationResponse
        {
            Id = application.Id,
            ApplicationId = application.ApplicationNumber,
            Title = application.Title,
            SchemeName = scheme.Title,
            NgoName = ngo.Name,
            Status = "Proposal Submitted",
            SubmittedAt = todayStr,
            GrantRequested = grantDisplay,
            GrantRequestedAmount = totalBudgetAmount
        };
    }

    public async Task<List<ApplicationResponse>> GetNGOApplicationsAsync(Guid ngoId)
    {
        var apps = await _context.Applications
            .Include(a => a.Scheme)
            .Include(a => a.Ngo)
            .Where(a => a.NgoId == ngoId && !a.IsDeleted)
            .OrderByDescending(a => a.SubmittedAt)
            .ToListAsync();

        return apps.Select(a => new ApplicationResponse
        {
            Id = a.Id,
            ApplicationId = a.ApplicationNumber,
            Title = a.Title,
            SchemeName = a.Scheme?.Title ?? "",
            NgoName = a.Ngo?.Name ?? "",
            Status = a.Status.ToString(),
            SubmittedAt = a.SubmittedAt.ToString("yyyy-MM-dd"),
            GrantRequested = a.GrantRequestedDisplay,
            GrantRequestedAmount = a.GrantRequested
        }).ToList();
    }

    public async Task<List<ApplicationResponse>> GetAllApplicationsAsync()
    {
        var apps = await _context.Applications
            .Include(a => a.Scheme)
            .Include(a => a.Ngo)
            .Where(a => !a.IsDeleted)
            .OrderByDescending(a => a.SubmittedAt)
            .ToListAsync();

        return apps.Select(a => new ApplicationResponse
        {
            Id = a.Id,
            ApplicationId = a.ApplicationNumber,
            Title = a.Title,
            SchemeName = a.Scheme?.Title ?? "",
            NgoName = a.Ngo?.Name ?? "",
            Status = a.Status.ToString(),
            SubmittedAt = a.SubmittedAt.ToString("yyyy-MM-dd"),
            GrantRequested = a.GrantRequestedDisplay,
            GrantRequestedAmount = a.GrantRequested
        }).ToList();
    }

    public async Task<ApplicationTrackingResponse> TrackApplicationAsync(string applicationId)
    {
        var app = await _context.Applications
            .Include(a => a.Scheme)
            .Include(a => a.Ngo)
            .Include(a => a.Reviews)
            .FirstOrDefaultAsync(a => a.ApplicationNumber.ToUpper() == applicationId.Trim().ToUpper() && !a.IsDeleted)
            ?? throw new NotFoundException($"Application with ID \"{applicationId}\" was not found. Please verify the ID and try again.");

        var steps = app.Reviews.OrderBy(r => r.Sequence).Select(r => new TrackingStepDto
        {
            Name = r.StageName,
            Status = r.Status.ToString().ToLower(),
            Date = r.ActionDate?.ToString("yyyy-MM-dd"),
            Remarks = r.Remarks
        }).ToList();

        return new ApplicationTrackingResponse
        {
            ApplicationId = app.ApplicationNumber,
            NgoName = app.Ngo?.Name ?? "Registered NGO",
            SchemeName = app.Scheme?.Title ?? "Government Grant Scheme",
            Status = app.Status.ToString(),
            UpdatedAt = (app.UpdatedAt ?? app.SubmittedAt).ToString("yyyy-MM-dd"),
            Steps = steps
        };
    }

    public async Task<ApplicationResponse> UpdateApplicationStatusAsync(Guid id, ApplicationStatusType status, string? remarks)
    {
        var app = await _context.Applications
            .Include(a => a.Scheme)
            .Include(a => a.Ngo)
            .FirstOrDefaultAsync(a => a.Id == id && !a.IsDeleted)
            ?? throw new NotFoundException($"Application with ID '{id}' was not found.");

        app.Status = status;
        app.UpdatedAt = DateTime.UtcNow;

        if (!string.IsNullOrWhiteSpace(remarks))
        {
            var review = new ApplicationReview
            {
                ApplicationId = app.Id,
                StageName = status.ToString(),
                Status = ReviewStatus.Completed,
                ActionDate = DateTime.UtcNow,
                Remarks = remarks
            };
            _context.ApplicationReviews.Add(review);
        }

        await _context.SaveChangesAsync();

        return new ApplicationResponse
        {
            Id = app.Id,
            ApplicationId = app.ApplicationNumber,
            Title = app.Title,
            SchemeName = app.Scheme?.Title ?? "",
            NgoName = app.Ngo?.Name ?? "",
            Status = app.Status.ToString(),
            SubmittedAt = app.SubmittedAt.ToString("yyyy-MM-dd"),
            GrantRequested = app.GrantRequestedDisplay,
            GrantRequestedAmount = app.GrantRequested
        };
    }

    public async Task<bool> DeleteApplicationAsync(Guid id)
    {
        var app = await _context.Applications.FirstOrDefaultAsync(a => a.Id == id && !a.IsDeleted)
            ?? throw new NotFoundException($"Application with ID '{id}' was not found.");

        app.IsDeleted = true;
        app.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }
}
