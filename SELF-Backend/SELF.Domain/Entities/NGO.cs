using SELF.Domain.Common;
using SELF.Domain.Enums;

namespace SELF.Domain.Entities;

public class NGO : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string DarpanId { get; set; } = string.Empty;
    public string RegistrationNumber { get; set; } = string.Empty;
    public string RegistrationAuthority { get; set; } = string.Empty;
    public string PanNumber { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string ContactPerson { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string ComplianceStatus { get; set; } = "Active Verified";
    public bool IsVerified { get; set; } = true;

    public virtual ICollection<NGODocument> Documents { get; set; } = [];
    public virtual ICollection<Application> Applications { get; set; } = [];
}

public class NGODocument : AuditableEntity
{
    public Guid NgoId { get; set; }
    public virtual NGO? Ngo { get; set; }
    public string Title { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public DocumentType DocumentType { get; set; } = DocumentType.Other;
}
