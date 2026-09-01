using System.ComponentModel.DataAnnotations;

namespace SELF.Application.FAQ.DTOs;

public class FAQResponse
{
    public Guid Id { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}

public class CreateFAQRequest
{
    [Required]
    public string Category { get; set; } = "General";

    [Required]
    public string Question { get; set; } = string.Empty;

    [Required]
    public string Answer { get; set; } = string.Empty;
    public int SortOrder { get; set; } = 0;
}
