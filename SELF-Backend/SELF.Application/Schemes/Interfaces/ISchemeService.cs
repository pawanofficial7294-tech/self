using SELF.Application.Schemes.DTOs;

namespace SELF.Application.Schemes.Interfaces;

public interface ISchemeService
{
    Task<List<SchemeResponse>> GetAllSchemesAsync(string? category = null);
    Task<SchemeResponse> GetSchemeByIdAsync(Guid id);
    Task<SchemeResponse> CreateSchemeAsync(CreateSchemeRequest request);
    Task<SchemeResponse> UpdateSchemeAsync(Guid id, UpdateSchemeRequest request);
    Task<bool> DeleteSchemeAsync(Guid id);
}
