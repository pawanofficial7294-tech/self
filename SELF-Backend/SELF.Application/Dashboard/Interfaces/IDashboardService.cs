using SELF.Application.Dashboard.DTOs;

namespace SELF.Application.Dashboard.Interfaces;

public interface IDashboardService
{
    Task<DashboardStatsResponse> GetDashboardStatsAsync(string? year = null, string? state = null);
}
