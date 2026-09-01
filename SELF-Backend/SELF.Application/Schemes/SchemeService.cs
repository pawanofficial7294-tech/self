using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using SELF.Application.Schemes.DTOs;
using SELF.Application.Schemes.Interfaces;
using SELF.Domain.Entities;
using SELF.Infrastructure.Data;
using SELF.Shared.Exceptions;

namespace SELF.Application.Schemes;

public class SchemeService(ApplicationDbContext context) : ISchemeService
{
    private readonly ApplicationDbContext _context = context;

    public async Task<List<SchemeResponse>> GetAllSchemesAsync(string? category = null)
    {
        var query = _context.Schemes.Where(s => !s.IsDeleted && s.IsActive);
        if (!string.IsNullOrWhiteSpace(category) && category != "All")
        {
            query = query.Where(s => s.Category.ToLower() == category.Trim().ToLower());
        }

        var schemes = await query.ToListAsync();
        return schemes.Select(MapToResponse).ToList();
    }

    public async Task<SchemeResponse> GetSchemeByIdAsync(Guid id)
    {
        var scheme = await _context.Schemes.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted)
            ?? throw new NotFoundException($"Scheme with ID '{id}' was not found.");

        return MapToResponse(scheme);
    }

    public async Task<SchemeResponse> CreateSchemeAsync(CreateSchemeRequest request)
    {
        var randomCode = $"SCH-{new Random().Next(100, 999)}";
        var scheme = new Scheme
        {
            Code = randomCode,
            Title = request.Title.Trim(),
            Category = request.Category.Trim(),
            Description = request.Description.Trim(),
            LongDescription = request.LongDescription.Trim(),
            FundingLimit = request.FundingLimit.Trim(),
            MaxFundingAmount = request.MaxFundingAmount,
            EligibilityJson = JsonSerializer.Serialize(request.Eligibility),
            DocumentsRequiredJson = JsonSerializer.Serialize(request.DocumentsRequired),
            IsActive = true
        };

        await _context.Schemes.AddAsync(scheme);
        await _context.SaveChangesAsync();

        return MapToResponse(scheme);
    }

    public async Task<SchemeResponse> UpdateSchemeAsync(Guid id, UpdateSchemeRequest request)
    {
        var scheme = await _context.Schemes.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted)
            ?? throw new NotFoundException($"Scheme with ID '{id}' was not found.");

        if (!string.IsNullOrWhiteSpace(request.Title)) scheme.Title = request.Title.Trim();
        if (!string.IsNullOrWhiteSpace(request.Category)) scheme.Category = request.Category.Trim();
        if (!string.IsNullOrWhiteSpace(request.Description)) scheme.Description = request.Description.Trim();
        if (!string.IsNullOrWhiteSpace(request.LongDescription)) scheme.LongDescription = request.LongDescription.Trim();
        if (!string.IsNullOrWhiteSpace(request.FundingLimit)) scheme.FundingLimit = request.FundingLimit.Trim();
        if (request.MaxFundingAmount.HasValue) scheme.MaxFundingAmount = request.MaxFundingAmount.Value;
        if (request.Eligibility != null) scheme.EligibilityJson = JsonSerializer.Serialize(request.Eligibility);
        if (request.DocumentsRequired != null) scheme.DocumentsRequiredJson = JsonSerializer.Serialize(request.DocumentsRequired);
        if (request.IsActive.HasValue) scheme.IsActive = request.IsActive.Value;

        scheme.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return MapToResponse(scheme);
    }

    public async Task<bool> DeleteSchemeAsync(Guid id)
    {
        var scheme = await _context.Schemes.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted)
            ?? throw new NotFoundException($"Scheme with ID '{id}' was not found.");

        scheme.IsDeleted = true;
        scheme.IsActive = false;
        scheme.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }

    private static SchemeResponse MapToResponse(Scheme s)
    {
        List<string> eligibility = [];
        List<string> documents = [];
        try { eligibility = JsonSerializer.Deserialize<List<string>>(s.EligibilityJson) ?? []; } catch { }
        try { documents = JsonSerializer.Deserialize<List<string>>(s.DocumentsRequiredJson) ?? []; } catch { }

        return new SchemeResponse
        {
            Id = s.Id,
            Code = s.Code,
            Title = s.Title,
            Category = s.Category,
            Description = s.Description,
            LongDescription = s.LongDescription,
            FundingLimit = s.FundingLimit,
            MaxFundingAmount = s.MaxFundingAmount,
            Eligibility = eligibility,
            DocumentsRequired = documents,
            IsActive = s.IsActive
        };
    }
}
