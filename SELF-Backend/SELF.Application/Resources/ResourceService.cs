using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SELF.Application.Resources.DTOs;
using SELF.Application.Resources.Interfaces;
using SELF.Domain.Entities;
using SELF.Infrastructure.Data;
using SELF.Infrastructure.Services;
using SELF.Shared.Exceptions;

namespace SELF.Application.Resources;

public class ResourceService(
    ApplicationDbContext context,
    IFileStorageService fileStorageService) : IResourceService
{
    private readonly ApplicationDbContext _context = context;
    private readonly IFileStorageService _fileStorageService = fileStorageService;

    public async Task<List<ResourceResponse>> GetAllResourcesAsync(string? type = null)
    {
        var query = _context.Resources.Where(r => !r.IsDeleted && r.IsPublic);
        if (!string.IsNullOrWhiteSpace(type) && type != "All")
        {
            query = query.Where(r => r.Type.ToLower() == type.Trim().ToLower());
        }

        var list = await query.OrderByDescending(r => r.Year).ThenBy(r => r.Title).ToListAsync();
        return list.Select(r => new ResourceResponse
        {
            Id = r.Id,
            Title = r.Title,
            Type = r.Type,
            Year = r.Year,
            FileSize = r.FileSize,
            DownloadUrl = "/" + r.FilePath.TrimStart('/'),
            DownloadCount = r.DownloadCount,
            CreatedAt = r.CreatedAt
        }).ToList();
    }

    public async Task<ResourceResponse> CreateResourceAsync(CreateResourceRequest request, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            throw new BadRequestException("Please select a document file to upload.");
        }

        var (filePath, _, fileSize) = await _fileStorageService.SaveFileAsync(file, "resources");
        var sizeMb = (fileSize / (1024m * 1024m)).ToString("F1") + " MB";

        var res = new Resource
        {
            Title = request.Title.Trim(),
            Type = request.Type.Trim(),
            Year = request.Year.Trim(),
            FileSize = sizeMb,
            FilePath = filePath,
            IsPublic = true
        };

        await _context.Resources.AddAsync(res);
        await _context.SaveChangesAsync();

        return new ResourceResponse
        {
            Id = res.Id,
            Title = res.Title,
            Type = res.Type,
            Year = res.Year,
            FileSize = res.FileSize,
            DownloadUrl = "/" + res.FilePath.TrimStart('/'),
            DownloadCount = res.DownloadCount,
            CreatedAt = res.CreatedAt
        };
    }

    public async Task<bool> DeleteResourceAsync(Guid id)
    {
        var res = await _context.Resources.FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted)
            ?? throw new NotFoundException($"Resource with ID '{id}' was not found.");

        res.IsDeleted = true;
        res.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }
}
