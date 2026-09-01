namespace SELF.Domain.Enums;

public enum UserRole
{
    NGO = 1,
    OFFICER = 2,
    ADMIN = 3
}

public enum ApplicationStatusType
{
    Draft = 0,
    ProposalSubmitted = 1,
    DistrictReview = 2,
    StateReview = 3,
    Approved = 4,
    Sanctioned = 5,
    Rejected = 6
}

public enum DocumentType
{
    RegistrationCertificate = 1,
    TaxPanCard = 2,
    DarpanCertificate = 3,
    AuditReport12A = 4,
    Exemption80G = 5,
    ProjectProposal = 6,
    CandidateResume = 7,
    AnnualReport = 8,
    Other = 9
}

public enum ReviewStatus
{
    Pending = 0,
    Current = 1,
    Completed = 2,
    Rejected = 3
}
