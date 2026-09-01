using System.ComponentModel.DataAnnotations;
using SELF.Application.Auth.DTOs;
using SELF.Domain.Enums;

namespace SELF.Application.Admin.DTOs;

public class CreateUserRequest
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
    public string? OfficerId { get; set; }

    public bool CanUploadImages { get; set; } = true;
    public bool CanPostJobs { get; set; } = false;
    public bool CanSubmitProjects { get; set; } = true;
    public bool CanManageSchemes { get; set; } = false;
    public bool CanManageUsers { get; set; } = false;
}

public class UpdateUserPermissionsRequest
{
    public bool? CanUploadImages { get; set; }
    public bool? CanPostJobs { get; set; }
    public bool? CanSubmitProjects { get; set; }
    public bool? CanManageSchemes { get; set; }
    public bool? CanManageUsers { get; set; }
    public bool? IsActive { get; set; }
}

public class UserSummaryDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? DarpanId { get; set; }
    public string? OfficerId { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }

    public UserPermissionsDto Permissions { get; set; } = new();
}
