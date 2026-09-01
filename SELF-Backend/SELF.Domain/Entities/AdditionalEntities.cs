using SELF.Domain.Common;

namespace SELF.Domain.Entities;

public class Job : AuditableEntity
{
    public string Code { get; set; } = string.Empty; // e.g. JOB-2026-001
    public string Title { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Type { get; set; } = "Full-time";
    public string Experience { get; set; } = string.Empty;
    public string Salary { get; set; } = string.Empty;
    public int Openings { get; set; } = 1;
    public string Deadline { get; set; } = string.Empty;
    public bool IsUrgent { get; set; } = false;
    public bool IsCustom { get; set; } = false;
    public string ShortDesc { get; set; } = string.Empty;
    public string ResponsibilitiesJson { get; set; } = "[]";
    public string QualificationsJson { get; set; } = "[]";
    public string DesirableSkillsJson { get; set; } = "[]";
    public bool IsActive { get; set; } = true;

    public virtual ICollection<Candidate> Candidates { get; set; } = [];
}

public class Candidate : AuditableEntity
{
    public string RefNumber { get; set; } = string.Empty; // e.g. APP-SELF-2026-9812
    public Guid? JobId { get; set; }
    public virtual Job? Job { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Qualification { get; set; } = string.Empty;
    public string Experience { get; set; } = string.Empty;
    public string SalaryExpected { get; set; } = string.Empty;
    public string ResumeFileName { get; set; } = string.Empty;
    public string ResumeFilePath { get; set; } = string.Empty;
    public string Status { get; set; } = "Under Screening"; // Under Screening, Shortlisted, Interview Scheduled, Rejected, Selected
}

public class ContactMessage : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "General Inquiry"; // General Inquiry, Grievance, Partnership
    public bool IsResolved { get; set; } = false;
    public string? ResolutionNotes { get; set; }
}

public class Resource : AuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = "Annual Report"; // Annual Report, Audit & 80G, Case Study, Manual
    public string Year { get; set; } = "2026";
    public string FileSize { get; set; } = "2.4 MB";
    public string FilePath { get; set; } = string.Empty;
    public int DownloadCount { get; set; } = 0;
    public bool IsPublic { get; set; } = true;
}

public class FAQ : AuditableEntity
{
    public string Category { get; set; } = "General";
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public int SortOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}

public class Grant : AuditableEntity
{
    public Guid ApplicationId { get; set; }
    public virtual Application? Application { get; set; }
    public string FinancialYear { get; set; } = "2026-2027";
    public decimal SanctionedAmount { get; set; }
    public decimal DisbursedAmount { get; set; }
    public string SanctionOrderNumber { get; set; } = string.Empty;
    public DateTime SanctionDate { get; set; } = DateTime.UtcNow;

    public virtual ICollection<GrantDisbursement> Disbursements { get; set; } = [];
}

public class GrantDisbursement : AuditableEntity
{
    public Guid GrantId { get; set; }
    public virtual Grant? Grant { get; set; }
    public int InstallmentNumber { get; set; } = 1;
    public decimal Amount { get; set; }
    public string PfmsTransactionId { get; set; } = string.Empty;
    public DateTime DisbursementDate { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Credited";
}
