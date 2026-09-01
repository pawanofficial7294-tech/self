using Microsoft.EntityFrameworkCore;
using SELF.Application.Contact.DTOs;
using SELF.Application.Contact.Interfaces;
using SELF.Domain.Entities;
using SELF.Infrastructure.Data;
using SELF.Shared.Exceptions;

namespace SELF.Application.Contact;

public class ContactService(ApplicationDbContext context) : IContactService
{
    private readonly ApplicationDbContext _context = context;

    public async Task<ContactMessageResponse> SubmitMessageAsync(ContactRequest request)
    {
        var msg = new ContactMessage
        {
            Name = request.Name.Trim(),
            Email = request.Email.Trim(),
            Phone = request.Phone.Trim(),
            Subject = request.Subject.Trim(),
            Message = request.Message.Trim(),
            Type = request.Type.Trim(),
            IsResolved = false
        };

        await _context.ContactMessages.AddAsync(msg);
        await _context.SaveChangesAsync();

        return new ContactMessageResponse
        {
            Id = msg.Id,
            Name = msg.Name,
            Email = msg.Email,
            Phone = msg.Phone,
            Subject = msg.Subject,
            Message = msg.Message,
            Type = msg.Type,
            IsResolved = msg.IsResolved,
            CreatedAt = msg.CreatedAt
        };
    }

    public async Task<List<ContactMessageResponse>> GetAllMessagesAsync()
    {
        var list = await _context.ContactMessages
            .Where(m => !m.IsDeleted)
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();

        return list.Select(m => new ContactMessageResponse
        {
            Id = m.Id,
            Name = m.Name,
            Email = m.Email,
            Phone = m.Phone,
            Subject = m.Subject,
            Message = m.Message,
            Type = m.Type,
            IsResolved = m.IsResolved,
            CreatedAt = m.CreatedAt
        }).ToList();
    }

    public async Task<bool> ResolveMessageAsync(Guid id, string? notes)
    {
        var msg = await _context.ContactMessages.FirstOrDefaultAsync(m => m.Id == id && !m.IsDeleted)
            ?? throw new NotFoundException($"Contact message with ID '{id}' was not found.");

        msg.IsResolved = true;
        msg.ResolutionNotes = notes;
        msg.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }
}
