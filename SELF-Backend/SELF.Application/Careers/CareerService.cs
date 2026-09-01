using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using SELF.Application.Careers.DTOs;
using SELF.Application.Careers.Interfaces;
using SELF.Domain.Entities;
using SELF.Infrastructure.Data;
using SELF.Shared.Exceptions;

namespace SELF.Application.Careers;

public class CareerService(ApplicationDbContext context) : ICareerService
{
    private readonly ApplicationDbContext _context = context;

    public async Task<List<JobResponse>> GetAllJobsAsync(string? department = null, string? query = null)
    {
        var jobsQuery = _context.Jobs.Where(j => !j.IsDeleted && j.IsActive);
        if (!string.IsNullOrWhiteSpace(department) && department != "All")
        {
            jobsQuery = jobsQuery.Where(j => j.Department.ToLower() == department.Trim().ToLower());
        }

        if (!string.IsNullOrWhiteSpace(query))
        {
            var q = query.Trim().ToLower();
            jobsQuery = jobsQuery.Where(j => j.Title.ToLower().Contains(q) || j.Location.ToLower().Contains(q));
        }

        var jobs = await jobsQuery.OrderByDescending(j => j.CreatedAt).ToListAsync();
        return jobs.Select(MapToResponse).ToList();
    }

    public async Task<JobResponse> GetJobByIdAsync(Guid id)
    {
        var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == id && !j.IsDeleted)
            ?? throw new NotFoundException($"Job with ID '{id}' was not found.");

        return MapToResponse(job);
    }

    public async Task<JobResponse> CreateJobAsync(CreateJobRequest request)
    {
        var randomNum = new Random().Next(100, 999);
        var job = new Job
        {
            Code = $"JOB-{DateTime.UtcNow.Year}-{randomNum}",
            Title = request.Title.Trim(),
            Department = request.Department.Trim(),
            Location = request.Location.Trim(),
            Type = request.Type.Trim(),
            Experience = request.Experience.Trim(),
            Salary = request.Salary.Trim(),
            Openings = request.Openings,
            Deadline = request.Deadline.Trim(),
            IsUrgent = request.IsUrgent,
            IsCustom = true,
            ShortDesc = request.ShortDesc.Trim(),
            ResponsibilitiesJson = JsonSerializer.Serialize(request.Responsibilities),
            QualificationsJson = JsonSerializer.Serialize(request.Qualifications),
            DesirableSkillsJson = JsonSerializer.Serialize(request.DesirableSkills),
            IsActive = true
        };

        await _context.Jobs.AddAsync(job);
        await _context.SaveChangesAsync();

        return MapToResponse(job);
    }

    public async Task<JobResponse> UpdateJobAsync(Guid id, CreateJobRequest request)
    {
        var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == id && !j.IsDeleted)
            ?? throw new NotFoundException($"Job with ID '{id}' was not found.");

        job.Title = request.Title.Trim();
        job.Department = request.Department.Trim();
        job.Location = request.Location.Trim();
        job.Type = request.Type.Trim();
        job.Experience = request.Experience.Trim();
        job.Salary = request.Salary.Trim();
        job.Openings = request.Openings;
        job.Deadline = request.Deadline.Trim();
        job.IsUrgent = request.IsUrgent;
        job.ShortDesc = request.ShortDesc.Trim();
        job.ResponsibilitiesJson = JsonSerializer.Serialize(request.Responsibilities);
        job.QualificationsJson = JsonSerializer.Serialize(request.Qualifications);
        job.DesirableSkillsJson = JsonSerializer.Serialize(request.DesirableSkills);
        job.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return MapToResponse(job);
    }

    public async Task<bool> DeleteJobAsync(Guid id)
    {
        var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == id && !j.IsDeleted)
            ?? throw new NotFoundException($"Job with ID '{id}' was not found.");

        job.IsDeleted = true;
        job.IsActive = false;
        job.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }

    private static JobResponse MapToResponse(Job j)
    {
        List<string> resp = [];
        List<string> qual = [];
        List<string> skills = [];
        try { resp = JsonSerializer.Deserialize<List<string>>(j.ResponsibilitiesJson) ?? []; } catch { }
        try { qual = JsonSerializer.Deserialize<List<string>>(j.QualificationsJson) ?? []; } catch { }
        try { skills = JsonSerializer.Deserialize<List<string>>(j.DesirableSkillsJson) ?? []; } catch { }

        return new JobResponse
        {
            Id = j.Id,
            Code = j.Code,
            Title = j.Title,
            Department = j.Department,
            Location = j.Location,
            Type = j.Type,
            Experience = j.Experience,
            Salary = j.Salary,
            Openings = j.Openings,
            Deadline = j.Deadline,
            IsUrgent = j.IsUrgent,
            IsCustom = j.IsCustom,
            ShortDesc = j.ShortDesc,
            Responsibilities = resp,
            Qualifications = qual,
            DesirableSkills = skills,
            IsActive = j.IsActive
        };
    }
}
