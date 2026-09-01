using Microsoft.EntityFrameworkCore;
using SELF.Application.Grants.DTOs;
using SELF.Application.Grants.Interfaces;
using SELF.Infrastructure.Data;

namespace SELF.Application.Grants;

public class GrantService(ApplicationDbContext context) : IGrantService
{
    private readonly ApplicationDbContext _context = context;

    public async Task<List<GrantResponse>> GetAllGrantsAsync()
    {
        var grants = await _context.Grants
            .Include(g => g.Application)
                .ThenInclude(a => a!.Ngo)
            .Include(g => g.Disbursements)
            .Where(g => !g.IsDeleted)
            .ToListAsync();

        return grants.Select(g => new GrantResponse
        {
            Id = g.Id,
            ApplicationId = g.ApplicationId,
            ApplicationNumber = g.Application?.ApplicationNumber ?? "",
            NgoName = g.Application?.Ngo?.Name ?? "",
            FinancialYear = g.FinancialYear,
            SanctionedAmount = g.SanctionedAmount,
            DisbursedAmount = g.DisbursedAmount,
            SanctionOrderNumber = g.SanctionOrderNumber,
            SanctionDate = g.SanctionDate,
            Disbursements = g.Disbursements.Select(d => new DisbursementResponse
            {
                Id = d.Id,
                InstallmentNumber = d.InstallmentNumber,
                Amount = d.Amount,
                PfmsTransactionId = d.PfmsTransactionId,
                DisbursementDate = d.DisbursementDate,
                Status = d.Status
            }).ToList()
        }).ToList();
    }
}
