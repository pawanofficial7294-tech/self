using SELF.Application.Careers.DTOs;

namespace SELF.Application.Careers.Interfaces;

public interface ICareerService
{
    Task<List<JobResponse>> GetAllJobsAsync(string? department = null, string? query = null);
    Task<JobResponse> GetJobByIdAsync(Guid id);
    Task<JobResponse> CreateJobAsync(CreateJobRequest request);
    Task<JobResponse> UpdateJobAsync(Guid id, CreateJobRequest request);
    Task<bool> DeleteJobAsync(Guid id);
}
