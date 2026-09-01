using SELF.Domain.Common;
using SELF.Domain.Enums;

namespace SELF.Domain.Entities;

public class Scheme : AuditableEntity
{
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string LongDescription { get; set; } = string.Empty;
    public string FundingLimit { get; set; } = string.Empty;
    public decimal MaxFundingAmount { get; set; }
    public string EligibilityJson { get; set; } = "[]";
    public string DocumentsRequiredJson { get; set; } = "[]";
    public bool IsActive { get; set; } = true;

    public virtual ICollection<Application> Applications { get; set; } = [];
}

public class Application : AuditableEntity
{
    public string ApplicationNumber { get; set; } = string.Empty; // e.g. NGO-2026-00124
    public string Title { get; set; } = string.Empty;
    public Guid SchemeId { get; set; }
    public virtual Scheme? Scheme { get; set; }
    public Guid NgoId { get; set; }
    public virtual NGO? Ngo { get; set; }
    public ApplicationStatusType Status { get; set; } = ApplicationStatusType.ProposalSubmitted;
    public decimal GrantRequested { get; set; }
    public string GrantRequestedDisplay { get; set; } = string.Empty; // e.g. "₹40.00 Lakhs"
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    public virtual Project? Project { get; set; }
    public virtual Budget? Budget { get; set; }
    public virtual ICollection<ApplicationReview> Reviews { get; set; } = [];
}

public class Project : AuditableEntity
{
    public Guid ApplicationId { get; set; }
    public virtual Application? Application { get; set; }
    public string Abstract { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Block { get; set; } = string.Empty;
    public string Villages { get; set; } = string.Empty;
    public int MaleBeneficiaries { get; set; }
    public int FemaleBeneficiaries { get; set; }
    public int TotalBeneficiaries { get; set; }
    public int StBeneficiaries { get; set; }
    public string Activities { get; set; } = string.Empty;
    public string ExpectedOutcomes { get; set; } = string.Empty;
}

public class Budget : AuditableEntity
{
    public Guid ApplicationId { get; set; }
    public virtual Application? Application { get; set; }
    public decimal TotalAmount { get; set; }
    public virtual ICollection<BudgetItem> Items { get; set; } = [];
}

public class BudgetItem : BaseEntity
{
    public Guid BudgetId { get; set; }
    public virtual Budget? Budget { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Quantity { get; set; } = 1;
    public decimal UnitCost { get; set; }
    public decimal Total { get; set; }
}

public class ApplicationReview : AuditableEntity
{
    public Guid ApplicationId { get; set; }
    public virtual Application? Application { get; set; }
    public string StageName { get; set; } = string.Empty; // e.g. "Registered", "Proposal Submitted", "District Review", etc.
    public ReviewStatus Status { get; set; } = ReviewStatus.Pending;
    public string? Remarks { get; set; }
    public DateTime? ActionDate { get; set; }
    public int Sequence { get; set; }
}
