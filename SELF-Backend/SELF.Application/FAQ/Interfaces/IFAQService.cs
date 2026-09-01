using SELF.Application.FAQ.DTOs;

namespace SELF.Application.FAQ.Interfaces;

public interface IFAQService
{
    Task<List<FAQResponse>> GetAllFAQsAsync(string? category = null);
    Task<FAQResponse> CreateFAQAsync(CreateFAQRequest request);
    Task<bool> DeleteFAQAsync(Guid id);
}
