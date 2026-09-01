using Microsoft.AspNetCore.Http;
using SELF.Application.Candidates.DTOs;

namespace SELF.Application.Candidates.Interfaces;

public interface ICandidateService
{
    Task<CandidateResponse> ApplyAsync(CandidateApplicationRequest request, IFormFile resumeFile);
    Task<CandidateResponse> GetByRefNumberAsync(string refNumber);
    Task<List<CandidateResponse>> GetAllCandidatesAsync();
    Task<bool> UpdateCandidateStatusAsync(Guid id, string status);
}
