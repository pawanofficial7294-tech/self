using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SELF.Api.Filters;
using SELF.Application.Admin.DTOs;
using SELF.Application.Admin.Interfaces;
using SELF.Application.Auth.DTOs;
using SELF.Application.Auth.Interfaces;
using SELF.Shared.Constants;
using SELF.Shared.DTOs;

namespace SELF.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    private readonly IAuthService _authService = authService;

    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<LoginResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var response = await _authService.LoginAsync(request);
        return Ok(ApiResponse<LoginResponse>.SuccessResult(response, "Login successful."));
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResponse<LoginResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var response = await _authService.RegisterAsync(request);
        return Ok(ApiResponse<LoginResponse>.SuccessResult(response, "Registration completed successfully."));
    }

    [HttpPost("forgot-password")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var response = await _authService.ForgotPasswordAsync(request);
        return Ok(ApiResponse<bool>.SuccessResult(response, "Password reset instructions sent if email exists."));
    }

    [HttpPost("reset-password")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var response = await _authService.ResetPasswordAsync(request);
        return Ok(ApiResponse<bool>.SuccessResult(response, "Password updated successfully."));
    }

    [HttpGet("profile")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<UserProfileResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProfile()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(ApiResponse<object>.FailureResult("Invalid authentication token."));
        }

        var profile = await _authService.GetCurrentUserProfileAsync(userId);
        return Ok(ApiResponse<UserProfileResponse>.SuccessResult(profile));
    }

    [HttpPut("profile")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<UserProfileResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(ApiResponse<object>.FailureResult("Invalid authentication token."));
        }

        var profile = await _authService.UpdateUserProfileAsync(userId, request);
        return Ok(ApiResponse<UserProfileResponse>.SuccessResult(profile, "Profile updated successfully."));
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
[RequirePermission(Permissions.UserManage)]
public class AdminController(IAdminService adminService) : ControllerBase
{
    private readonly IAdminService _adminService = adminService;

    [HttpGet("users")]
    [ProducesResponseType(typeof(ApiResponse<List<UserSummaryDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _adminService.GetAllUsersAsync();
        return Ok(ApiResponse<List<UserSummaryDto>>.SuccessResult(users));
    }

    [HttpGet("users/{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<UserSummaryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUserById(Guid id)
    {
        var user = await _adminService.GetUserByIdAsync(id);
        return Ok(ApiResponse<UserSummaryDto>.SuccessResult(user));
    }

    [HttpPost("users")]
    [ProducesResponseType(typeof(ApiResponse<UserSummaryDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        var user = await _adminService.CreateUserAsync(request);
        return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, ApiResponse<UserSummaryDto>.SuccessResult(user, "User created successfully with assigned permissions."));
    }

    [HttpPatch("users/{id:guid}/permissions")]
    [ProducesResponseType(typeof(ApiResponse<UserSummaryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateUserPermissions(Guid id, [FromBody] UpdateUserPermissionsRequest request)
    {
        var updated = await _adminService.UpdateUserPermissionsAsync(id, request);
        return Ok(ApiResponse<UserSummaryDto>.SuccessResult(updated, "User permissions updated successfully."));
    }

    [HttpDelete("users/{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var result = await _adminService.DeleteUserAsync(id);
        return Ok(ApiResponse<bool>.SuccessResult(result, "User deleted successfully."));
    }
}
