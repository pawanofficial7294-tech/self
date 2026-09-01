using SELF.Application.Applications.DTOs;

namespace SELF.Application.Tracking.Interfaces;

public interface ITrackingService
{
    Task<ApplicationTrackingResponse> TrackApplicationAsync(string applicationId);
}
