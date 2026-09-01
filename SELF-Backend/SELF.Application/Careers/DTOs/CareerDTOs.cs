using System.ComponentModel.DataAnnotations;

namespace SELF.Application.Careers.DTOs;

public class JobResponse
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Experience { get; set; } = string.Empty;
    public string Salary { get; set; } = string.Empty;
    public int Openings { get; set; }
    public string Deadline { get; set; } = string.Empty;
    public bool IsUrgent { get; set; }
    public bool IsCustom { get; set; }
    public string ShortDesc { get; set; } = string.Empty;
    public List<string> Responsibilities { get; set; } = [];
    public List<string> Qualifications { get; set; } = [];
    public List<string> DesirableSkills { get; set; } = [];
    public bool IsActive { get; set; }
}

public class CreateJobRequest
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Department { get; set; } = string.Empty;

    [Required]
    public string Location { get; set; } = string.Empty;

    public string Type { get; set; } = "Full-time";
    public string Experience { get; set; } = string.Empty;
    public string Salary { get; set; } = string.Empty;
    public int Openings { get; set; } = 1;
    public string Deadline { get; set; } = string.Empty;
    public bool IsUrgent { get; set; }
    public string ShortDesc { get; set; } = string.Empty;
    public List<string> Responsibilities { get; set; } = [];
    public List<string> Qualifications { get; set; } = [];
    public List<string> DesirableSkills { get; set; } = [];
}
