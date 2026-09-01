using System.ComponentModel.DataAnnotations;

namespace SELF.Application.NGOs.DTOs;

public class CreateNGORequest
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string DarpanId { get; set; } = string.Empty;

    [Required]
    public string RegistrationNumber { get; set; } = string.Empty;
    public string RegistrationAuthority { get; set; } = string.Empty;

    [Required]
    public string PanNumber { get; set; } = string.Empty;
    public string State { get; set; } = "Jharkhand";
    public string District { get; set; } = "Ranchi";
    public string Address { get; set; } = string.Empty;
    public string ContactPerson { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public class NGOResponse
{
    public Guid Id { get; set; }
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
    public string ComplianceStatus { get; set; } = string.Empty;
    public bool IsVerified { get; set; }
    public List<NGODocumentResponse> Documents { get; set; } = [];
}

public class NGODocumentResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public DateTime CreatedAt { get; set; }
}
