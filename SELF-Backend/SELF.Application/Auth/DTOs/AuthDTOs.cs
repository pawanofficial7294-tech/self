using System.ComponentModel.DataAnnotations;
using SELF.Domain.Enums;

namespace SELF.Application.Auth.DTOs;

public class LoginRequest
{
    [Required]
    public string LoginId { get; set; } = string.Empty;

    [Required]
    public string SecurityCode { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.NGO;
}

public class UserPermissionsDto
{
    public bool CanUploadImages { get; set; }
    public bool CanPostJobs { get; set; }
    public bool CanSubmitProjects { get; set; }
    public bool CanManageSchemes { get; set; }
    public bool CanManageUsers { get; set; }
}

public class LoginResponse
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? DarpanId { get; set; }
    public string? OfficerId { get; set; }
    public string Token { get; set; } = string.Empty;
    public UserPermissionsDto Permissions { get; set; } = new();
}

public class RegisterRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string FullName { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.NGO;
    public string? DarpanId { get; set; }
    public string? RegistrationNumber { get; set; }
    public string? PanNumber { get; set; }
    public string? State { get; set; }
    public string? District { get; set; }
    public string? Phone { get; set; }
}

public class ForgotPasswordRequest
{
    [Required]
    public string LoginId { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
}

public class ResetPasswordRequest
{
    [Required]
    public string Token { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string NewPassword { get; set; } = string.Empty;
}

public class NgoProfileDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string RegistrationNumber { get; set; } = string.Empty;
    public string PanNumber { get; set; } = string.Empty;
    public string DarpanId { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string ContactPerson { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string ComplianceStatus { get; set; } = string.Empty;
    public bool IsVerified { get; set; }
}

public class UserProfileResponse
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? DarpanId { get; set; }
    public string? OfficerId { get; set; }
    public Guid? NgoId { get; set; }
    public NgoProfileDto? Ngo { get; set; }
    public UserPermissionsDto Permissions { get; set; } = new();
    public bool IsActive { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class UpdateProfileRequest
{
    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? ContactPerson { get; set; }
}

