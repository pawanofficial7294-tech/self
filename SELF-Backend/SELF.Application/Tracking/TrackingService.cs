using SELF.Application.Applications.DTOs;
using SELF.Application.Applications.Interfaces;
using SELF.Application.Tracking.Interfaces;

namespace SELF.Application.Tracking;

public class TrackingService(IApplicationService applicationService) : ITrackingService
{
    private readonly IApplicationService _applicationService = applicationService;

    public Task<ApplicationTrackingResponse> TrackApplicationAsync(string applicationId)
    {
        return _applicationService.TrackApplicationAsync(applicationId);
    }
}
