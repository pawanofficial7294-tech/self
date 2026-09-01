using System.ComponentModel.DataAnnotations;

namespace SELF.Application.Schemes.DTOs;

public class SchemeResponse
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string LongDescription { get; set; } = string.Empty;
    public string FundingLimit { get; set; } = string.Empty;
    public decimal MaxFundingAmount { get; set; }
    public List<string> Eligibility { get; set; } = [];
    public List<string> DocumentsRequired { get; set; } = [];
    public bool IsActive { get; set; }
}

public class CreateSchemeRequest
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Category { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;
    public string LongDescription { get; set; } = string.Empty;
    public string FundingLimit { get; set; } = string.Empty;
    public decimal MaxFundingAmount { get; set; }
    public List<string> Eligibility { get; set; } = [];
    public List<string> DocumentsRequired { get; set; } = [];
}

public class UpdateSchemeRequest
{
    public string? Title { get; set; }
    public string? Category { get; set; }
    public string? Description { get; set; }
    public string? LongDescription { get; set; }
    public string? FundingLimit { get; set; }
    public decimal? MaxFundingAmount { get; set; }
    public List<string>? Eligibility { get; set; }
    public List<string>? DocumentsRequired { get; set; }
    public bool? IsActive { get; set; }
}
