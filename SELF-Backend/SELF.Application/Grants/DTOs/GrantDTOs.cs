namespace SELF.Application.Grants.DTOs;

public class GrantResponse
{
    public Guid Id { get; set; }
    public Guid ApplicationId { get; set; }
    public string ApplicationNumber { get; set; } = string.Empty;
    public string NgoName { get; set; } = string.Empty;
    public string FinancialYear { get; set; } = string.Empty;
    public decimal SanctionedAmount { get; set; }
    public decimal DisbursedAmount { get; set; }
    public string SanctionOrderNumber { get; set; } = string.Empty;
    public DateTime SanctionDate { get; set; }
    public List<DisbursementResponse> Disbursements { get; set; } = [];
}

public class DisbursementResponse
{
    public Guid Id { get; set; }
    public int InstallmentNumber { get; set; }
    public decimal Amount { get; set; }
    public string PfmsTransactionId { get; set; } = string.Empty;
    public DateTime DisbursementDate { get; set; }
    public string Status { get; set; } = string.Empty;
}
