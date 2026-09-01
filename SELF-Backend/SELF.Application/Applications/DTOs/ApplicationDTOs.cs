using System.ComponentModel.DataAnnotations;

namespace SELF.Application.Applications.DTOs;

public class ProjectProposalRequest
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public Guid SchemeId { get; set; }
    public string SchemeName { get; set; } = string.Empty;
    public string Abstract { get; set; } = string.Empty;
    public string State { get; set; } = "Jharkhand";
    public string District { get; set; } = string.Empty;
    public string Block { get; set; } = string.Empty;
    public string Villages { get; set; } = string.Empty;

    public BeneficiariesDto Beneficiaries { get; set; } = new();
    public List<BudgetItemDto> Budget { get; set; } = [];

    public string Activities { get; set; } = string.Empty;
    public string ExpectedOutcomes { get; set; } = string.Empty;
    public bool DeclarationChecked { get; set; }
}

public class BeneficiariesDto
{
    public int MaleCount { get; set; }
    public int FemaleCount { get; set; }
    public int TotalCount { get; set; }
    public int StCount { get; set; }
}

public class BudgetItemDto
{
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Quantity { get; set; } = 1;
    public decimal UnitCost { get; set; }
    public decimal Total { get; set; }
}

public class ApplicationResponse
{
    public Guid Id { get; set; }
    public string ApplicationId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string SchemeName { get; set; } = string.Empty;
    public string NgoName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string SubmittedAt { get; set; } = string.Empty;
    public string GrantRequested { get; set; } = string.Empty;
    public decimal GrantRequestedAmount { get; set; }
}

public class TrackingStepDto
{
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = "pending";
    public string? Date { get; set; }
    public string? Remarks { get; set; }
}

public class ApplicationTrackingResponse
{
    public string ApplicationId { get; set; } = string.Empty;
    public string NgoName { get; set; } = string.Empty;
    public string SchemeName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string UpdatedAt { get; set; } = string.Empty;
    public List<TrackingStepDto> Steps { get; set; } = [];
}
