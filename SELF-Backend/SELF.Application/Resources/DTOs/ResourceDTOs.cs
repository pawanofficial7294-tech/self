using System.ComponentModel.DataAnnotations;

namespace SELF.Application.Resources.DTOs;

public class ResourceResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Year { get; set; } = string.Empty;
    public string FileSize { get; set; } = string.Empty;
    public string DownloadUrl { get; set; } = string.Empty;
    public int DownloadCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateResourceRequest
{
    [Required]
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = "Annual Report";
    public string Year { get; set; } = "2026";
}
