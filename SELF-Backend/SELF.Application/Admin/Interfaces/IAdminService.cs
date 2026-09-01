using SELF.Application.Admin.DTOs;

namespace SELF.Application.Admin.Interfaces;

public interface IAdminService
{
    Task<List<UserSummaryDto>> GetAllUsersAsync();
    Task<UserSummaryDto> GetUserByIdAsync(Guid id);
    Task<UserSummaryDto> CreateUserAsync(CreateUserRequest request);
    Task<UserSummaryDto> UpdateUserPermissionsAsync(Guid id, UpdateUserPermissionsRequest request);
    Task<bool> DeleteUserAsync(Guid id);
}
