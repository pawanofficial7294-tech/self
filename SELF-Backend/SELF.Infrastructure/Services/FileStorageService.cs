using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;

namespace SELF.Infrastructure.Services;

public interface IFileStorageService
{
    Task<(string filePath, string fileName, long fileSize)> SaveFileAsync(IFormFile file, string subFolder);
    bool DeleteFile(string relativeFilePath);
    string GetFullPath(string relativeFilePath);
}

public class FileStorageService : IFileStorageService
{
    private readonly string _rootPath;

    public FileStorageService(IHostEnvironment hostEnvironment)
    {
        _rootPath = Path.Combine(hostEnvironment.ContentRootPath, "uploads");
        if (!Directory.Exists(_rootPath))
        {
            Directory.CreateDirectory(_rootPath);
        }
    }

    public async Task<(string filePath, string fileName, long fileSize)> SaveFileAsync(IFormFile file, string subFolder)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("Cannot upload an empty file.", nameof(file));
        }

        var folderPath = Path.Combine(_rootPath, subFolder);
        if (!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath);
        }

        var originalFileName = Path.GetFileName(file.FileName);
        var fileExtension = Path.GetExtension(originalFileName);
        var uniqueFileName = $"{Guid.NewGuid():N}_{originalFileName}";
        var fullPath = Path.Combine(folderPath, uniqueFileName);

        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var relativePath = Path.Combine("uploads", subFolder, uniqueFileName).Replace('\\', '/');
        return (relativePath, originalFileName, file.Length);
    }

    public bool DeleteFile(string relativeFilePath)
    {
        try
        {
            var fullPath = GetFullPath(relativeFilePath);
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    public string GetFullPath(string relativeFilePath)
    {
        return Path.GetFullPath(relativeFilePath);
    }
}
