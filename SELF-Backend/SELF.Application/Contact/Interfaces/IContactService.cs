using SELF.Application.Contact.DTOs;

namespace SELF.Application.Contact.Interfaces;

public interface IContactService
{
    Task<ContactMessageResponse> SubmitMessageAsync(ContactRequest request);
    Task<List<ContactMessageResponse>> GetAllMessagesAsync();
    Task<bool> ResolveMessageAsync(Guid id, string? notes);
}
