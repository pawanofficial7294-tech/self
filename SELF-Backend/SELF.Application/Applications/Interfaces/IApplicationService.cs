using SELF.Application.Applications.DTOs;

namespace SELF.Application.Applications.Interfaces;

public interface IApplicationService
{
    Task<ApplicationResponse> SubmitProposalAsync(Guid ngoId, ProjectProposalRequest request);
    Task<List<ApplicationResponse>> GetNGOApplicationsAsync(Guid ngoId);
    Task<List<ApplicationResponse>> GetAllApplicationsAsync();
    Task<ApplicationTrackingResponse> TrackApplicationAsync(string applicationId);
    Task<ApplicationResponse> UpdateApplicationStatusAsync(Guid id, Domain.Enums.ApplicationStatusType status, string? remarks);
    Task<bool> DeleteApplicationAsync(Guid id);
}
