using Microsoft.EntityFrameworkCore;
using SELF.Application.FAQ.DTOs;
using SELF.Application.FAQ.Interfaces;
using SELF.Infrastructure.Data;
using SELF.Shared.Exceptions;

namespace SELF.Application.FAQ;

public class FAQService(ApplicationDbContext context) : IFAQService
{
    private readonly ApplicationDbContext _context = context;

    public async Task<List<FAQResponse>> GetAllFAQsAsync(string? category = null)
    {
        var query = _context.FAQs.Where(f => !f.IsDeleted && f.IsActive);
        if (!string.IsNullOrWhiteSpace(category) && category != "All")
        {
            query = query.Where(f => f.Category.ToLower() == category.Trim().ToLower());
        }

        var faqs = await query.OrderBy(f => f.SortOrder).ThenBy(f => f.CreatedAt).ToListAsync();
        return faqs.Select(f => new FAQResponse
        {
            Id = f.Id,
            Category = f.Category,
            Question = f.Question,
            Answer = f.Answer,
            SortOrder = f.SortOrder
        }).ToList();
    }

    public async Task<FAQResponse> CreateFAQAsync(CreateFAQRequest request)
    {
        var faq = new Domain.Entities.FAQ
        {
            Category = request.Category.Trim(),
            Question = request.Question.Trim(),
            Answer = request.Answer.Trim(),
            SortOrder = request.SortOrder,
            IsActive = true
        };

        await _context.FAQs.AddAsync(faq);
        await _context.SaveChangesAsync();

        return new FAQResponse
        {
            Id = faq.Id,
            Category = faq.Category,
            Question = faq.Question,
            Answer = faq.Answer,
            SortOrder = faq.SortOrder
        };
    }

    public async Task<bool> DeleteFAQAsync(Guid id)
    {
        var faq = await _context.FAQs.FirstOrDefaultAsync(f => f.Id == id && !f.IsDeleted)
            ?? throw new NotFoundException($"FAQ with ID '{id}' was not found.");

        faq.IsDeleted = true;
        faq.IsActive = false;
        faq.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }
}
