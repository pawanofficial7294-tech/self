using Microsoft.AspNetCore.Http;
using SELF.Application.NGOs.DTOs;
using SELF.Domain.Enums;

namespace SELF.Application.NGOs.Interfaces;

public interface INGOService
{
    Task<List<NGOResponse>> GetAllNGOsAsync();
    Task<NGOResponse> GetNGOByIdAsync(Guid id);
    Task<NGOResponse?> GetNGOByDarpanIdAsync(string darpanId);
    Task<NGOResponse> CreateNGOAsync(CreateNGORequest request);
    Task<NGODocumentResponse> UploadDocumentAsync(Guid ngoId, string title, DocumentType type, IFormFile file);
}
