using System.ComponentModel.DataAnnotations;

namespace SELF.Application.Candidates.DTOs;

public class CandidateApplicationRequest
{
    public Guid? JobId { get; set; }
    public string JobTitle { get; set; } = string.Empty;

    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Phone { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Qualification { get; set; } = string.Empty;
    public string Experience { get; set; } = string.Empty;
    public string SalaryExpected { get; set; } = string.Empty;
}

public class CandidateResponse
{
    public Guid Id { get; set; }
    public string RefNumber { get; set; } = string.Empty;
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
    public string Status { get; set; } = string.Empty;
    public DateTime AppliedAt { get; set; }
}
