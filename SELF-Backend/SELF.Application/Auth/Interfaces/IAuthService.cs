using SELF.Application.Auth.DTOs;

namespace SELF.Application.Auth.Interfaces;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task<LoginResponse> RegisterAsync(RegisterRequest request);
    Task<bool> ForgotPasswordAsync(ForgotPasswordRequest request);
    Task<bool> ResetPasswordAsync(ResetPasswordRequest request);
    Task<UserProfileResponse> GetCurrentUserProfileAsync(Guid userId);
    Task<UserProfileResponse> UpdateUserProfileAsync(Guid userId, UpdateProfileRequest request);
}
