using Microsoft.AspNetCore.Http;
using SELF.Application.Resources.DTOs;

namespace SELF.Application.Resources.Interfaces;

public interface IResourceService
{
    Task<List<ResourceResponse>> GetAllResourcesAsync(string? type = null);
    Task<ResourceResponse> CreateResourceAsync(CreateResourceRequest request, IFormFile file);
    Task<bool> DeleteResourceAsync(Guid id);
}
