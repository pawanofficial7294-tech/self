using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SELF.Application.Candidates.DTOs;
using SELF.Application.Candidates.Interfaces;
using SELF.Domain.Entities;
using SELF.Infrastructure.Data;
using SELF.Infrastructure.Services;
using SELF.Shared.Exceptions;

namespace SELF.Application.Candidates;

public class CandidateService(
    ApplicationDbContext context,
    IFileStorageService fileStorageService) : ICandidateService
{
    private readonly ApplicationDbContext _context = context;
    private readonly IFileStorageService _fileStorageService = fileStorageService;

    public async Task<CandidateResponse> ApplyAsync(CandidateApplicationRequest request, IFormFile resumeFile)
    {
        if (resumeFile == null || resumeFile.Length == 0)
        {
            throw new BadRequestException("Please upload your updated CV/Resume (PDF or DOCX).");
        }

        var (filePath, fileName, _) = await _fileStorageService.SaveFileAsync(resumeFile, "candidate-documents");

        var randomRef = new Random().Next(1000, 9999);
        var refNumber = $"APP-SELF-{DateTime.UtcNow.Year}-{randomRef}";

        var candidate = new Candidate
        {
            RefNumber = refNumber,
            JobId = request.JobId,
            JobTitle = request.JobTitle,
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim(),
            Phone = request.Phone.Trim(),
            Location = request.Location.Trim(),
            Qualification = request.Qualification.Trim(),
            Experience = request.Experience.Trim(),
            SalaryExpected = request.SalaryExpected.Trim(),
            ResumeFileName = fileName,
            ResumeFilePath = filePath,
            Status = "Under Screening"
        };

        await _context.Candidates.AddAsync(candidate);
        await _context.SaveChangesAsync();

        return MapToResponse(candidate);
    }

    public async Task<CandidateResponse> GetByRefNumberAsync(string refNumber)
    {
        var candidate = await _context.Candidates
            .FirstOrDefaultAsync(c => c.RefNumber.ToUpper() == refNumber.Trim().ToUpper() && !c.IsDeleted)
            ?? throw new NotFoundException($"Candidate application with reference number \"{refNumber}\" was not found.");

        return MapToResponse(candidate);
    }

    public async Task<List<CandidateResponse>> GetAllCandidatesAsync()
    {
        var candidates = await _context.Candidates
            .Where(c => !c.IsDeleted)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return candidates.Select(MapToResponse).ToList();
    }

    public async Task<bool> UpdateCandidateStatusAsync(Guid id, string status)
    {
        var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted)
            ?? throw new NotFoundException($"Candidate with ID '{id}' was not found.");

        candidate.Status = status.Trim();
        candidate.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }

    private static CandidateResponse MapToResponse(Candidate c)
    {
        return new CandidateResponse
        {
            Id = c.Id,
            RefNumber = c.RefNumber,
            JobTitle = c.JobTitle,
            FullName = c.FullName,
            Email = c.Email,
            Phone = c.Phone,
            Location = c.Location,
            Qualification = c.Qualification,
            Experience = c.Experience,
            SalaryExpected = c.SalaryExpected,
            ResumeFileName = c.ResumeFileName,
            ResumeFilePath = c.ResumeFilePath,
            Status = c.Status,
            AppliedAt = c.CreatedAt
        };
    }
}
