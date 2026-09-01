namespace SELF.Application.Dashboard.DTOs;

public class DashboardStatsResponse
{
    public int TotalNGOs { get; set; }
    public int ActiveProjects { get; set; }
    public decimal TotalGrantsSanctionedCr { get; set; }
    public decimal TotalGrantsDisbursedCr { get; set; }
    public int TotalBeneficiaries { get; set; }
    public int TotalJobs { get; set; }
    public int TotalApplications { get; set; }

    public List<MonthlyGrantTrendDto> MonthlyTrends { get; set; } = [];
    public List<SectorDistributionDto> SectorDistribution { get; set; } = [];
    public List<StateWiseProjectDto> StateWiseDistribution { get; set; } = [];
}

public class MonthlyGrantTrendDto
{
    public string Month { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int Projects { get; set; }
}

public class SectorDistributionDto
{
    public string Sector { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal Percentage { get; set; }
}

public class StateWiseProjectDto
{
    public string State { get; set; } = string.Empty;
    public int Projects { get; set; }
    public decimal GrantsCr { get; set; }
}
