using SELF.Domain.Common;
using SELF.Domain.Enums;

namespace SELF.Domain.Entities;

public class User : AuditableEntity
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.NGO;
    
    // Identifiers matching React session model
    public string? DarpanId { get; set; }
    public string? OfficerId { get; set; }
    public Guid? NgoId { get; set; }
    public virtual NGO? Ngo { get; set; }

    // Granular feature permissions controlled by Admin
    public bool CanUploadImages { get; set; } = true;
    public bool CanPostJobs { get; set; } = false;
    public bool CanSubmitProjects { get; set; } = true;
    public bool CanManageSchemes { get; set; } = false;
    public bool CanManageUsers { get; set; } = false;

    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }
}

public class Role : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class UserPermission : BaseEntity
{
    public Guid UserId { get; set; }
    public virtual User? User { get; set; }
    public string PermissionKey { get; set; } = string.Empty;
    public bool IsGranted { get; set; }
}
