using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using SELF.Domain.Entities;
using SELF.Domain.Enums;
using SELF.Infrastructure.Services;

namespace SELF.Infrastructure.Data.Seed;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, IPasswordService passwordService)
    {
        await context.Database.EnsureCreatedAsync();

        // 1. Seed Roles
        if (!await context.Roles.AnyAsync())
        {
            await context.Roles.AddRangeAsync(
                new Role { Name = "ADMIN", Description = "Full system administration and user permission management" },
                new Role { Name = "OFFICER", Description = "District / State welfare officer and grant review authority" },
                new Role { Name = "NGO", Description = "Registered non-governmental organization applicant" }
            );
            await context.SaveChangesAsync();
        }

        // 2. Seed Demo NGO Organization
        NGO demoNgo;
        if (!await context.NGOs.AnyAsync())
        {
            demoNgo = new NGO
            {
                Name = "Gramin Vikas Parishad",
                DarpanId = "JH/2026/08849",
                RegistrationNumber = "12627/1739",
                RegistrationAuthority = "Inspector General of Societies Ranchi",
                PanNumber = "AAATV1298C",
                State = "Jharkhand",
                District = "Ranchi",
                Address = "Plot 42, Harmu Housing Colony, Ranchi, Jharkhand 834002",
                ContactPerson = "Pawan Kumar Verma",
                Phone = "+91 94311 02847",
                Email = "gvp.ngo@example.org",
                ComplianceStatus = "Active Verified",
                IsVerified = true
            };
            await context.NGOs.AddAsync(demoNgo);
            await context.SaveChangesAsync();
        }
        else
        {
            demoNgo = await context.NGOs.FirstAsync();
        }

        // 3. Seed Users
        if (!await context.Users.AnyAsync(u => u.Email == "admin@self.org.in"))
        {
            var adminUser = new User
            {
                Username = "admin",
                Email = "admin@self.org.in",
                PasswordHash = passwordService.HashPassword("Admin@12345"),
                FullName = "Ministry Administrator",
                Role = UserRole.ADMIN,
                CanUploadImages = true,
                CanPostJobs = true,
                CanSubmitProjects = true,
                CanManageSchemes = true,
                CanManageUsers = true,
                IsActive = true
            };
            await context.Users.AddAsync(adminUser);
        }

        if (!await context.Users.AnyAsync(u => u.Email == "gvp.ngo@example.org"))
        {
            var ngoUser = new User
            {
                Username = "gvp_ngo",
                Email = "gvp.ngo@example.org",
                PasswordHash = passwordService.HashPassword("Ngo@12345"),
                FullName = "Gramin Vikas Parishad",
                Role = UserRole.NGO,
                NgoId = demoNgo.Id,
                DarpanId = demoNgo.DarpanId,
                CanUploadImages = true,
                CanPostJobs = false,
                CanSubmitProjects = true,
                CanManageSchemes = false,
                CanManageUsers = false,
                IsActive = true
            };
            await context.Users.AddAsync(ngoUser);
        }

        if (!await context.Users.AnyAsync(u => u.Email == "state.officer@nic.in"))
        {
            var officerUser = new User
            {
                Username = "officer_ranchi",
                Email = "state.officer@nic.in",
                PasswordHash = passwordService.HashPassword("Officer@12345"),
                FullName = "State Welfare Officer Ranchi",
                OfficerId = "OFF-992",
                Role = UserRole.OFFICER,
                CanUploadImages = true,
                CanPostJobs = true,
                CanSubmitProjects = false,
                CanManageSchemes = true,
                CanManageUsers = false,
                IsActive = true
            };
            await context.Users.AddAsync(officerUser);
        }
        await context.SaveChangesAsync();

        // 4. Seed Schemes
        if (!await context.Schemes.AnyAsync())
        {
            var schemes = new List<Scheme>
            {
                new Scheme
                {
                    Code = "SCH-001",
                    Title = "Mobile Medical Units (MMU) in Scheduled Areas",
                    Category = "Health & Nutrition",
                    Description = "Deploying solar-equipped mobile medical vans with diagnostic labs and paramedical teams.",
                    LongDescription = "Provides primary healthcare, ANC/PNC screenings, and essential medicines to remote forest and hill villages lacking primary health centres within a 15km radius.",
                    FundingLimit = "Up to ₹45 Lakhs per MMU / Year",
                    MaxFundingAmount = 4500000,
                    EligibilityJson = JsonSerializer.Serialize(new[] { "Minimum 3 years working in Schedule-V tribal districts", "Registered under Darpan with active 12A/80G", "Prior health delivery experience of at least 15,000 patients" }),
                    DocumentsRequiredJson = JsonSerializer.Serialize(new[] { "3-year audited balance sheet", "Doctor & nurse MoUs", "Vehicle fitness & route map blueprint", "Darpan certificate" }),
                    IsActive = true
                },
                new Scheme
                {
                    Code = "SCH-002",
                    Title = "Eklavya Model Residential Schools Support (EMRS)",
                    Category = "Education & Skill Development",
                    Description = "Supplementary STEM coaching, smart classroom infrastructure, and residential student mentoring.",
                    LongDescription = "Enhancing pass percentages and national competitive exam outcomes for Scheduled Tribe students in standard IX to XII through digital pedagogy.",
                    FundingLimit = "Up to ₹50 Lakhs / Institution / 3 Years",
                    MaxFundingAmount = 5000000,
                    EligibilityJson = JsonSerializer.Serialize(new[] { "NGOs running educational institutes or digital literacy programs", "NITI Aayog Darpan registered", "Clear track record without blacklisting" }),
                    DocumentsRequiredJson = JsonSerializer.Serialize(new[] { "Detailed curriculum design", "Hardware procurement quotations", "Trainer certifications", "District Education Officer endorsement" }),
                    IsActive = true
                },
                new Scheme
                {
                    Code = "SCH-003",
                    Title = "Solar Micro-Grids & Clean Energy for PVTG Settlements",
                    Category = "Environment & Renewable Energy",
                    Description = "Decentralized solar micro-grids and solar street lighting for remote tribal hamlets.",
                    LongDescription = "Supplying dependable, community-managed DC solar microgrids to remote Particulary Vulnerable Tribal Groups (PVTG) villages for night lighting and micro-enterprise power.",
                    FundingLimit = "Up to ₹35 Lakhs / Hamlet Cluster",
                    MaxFundingAmount = 3500000,
                    EligibilityJson = JsonSerializer.Serialize(new[] { "Certified renewable energy technical staff", "MoU with village Gram Sabha", "Prior experience executing 25kW+ rural solar" }),
                    DocumentsRequiredJson = JsonSerializer.Serialize(new[] { "Gram Sabha resolution", "Technical feasibility DPR", "Vendor equipment warranties" }),
                    IsActive = true
                },
                new Scheme
                {
                    Code = "SCH-004",
                    Title = "Adivasi Mahila SHG Micro-Enterprise Development",
                    Category = "Livelihoods & Women Empowerment",
                    Description = "Seed funding, equipment grants, and marketing linkage for women-led forest produce collectives.",
                    LongDescription = "Establishes food processing and craft manufacturing clusters managed entirely by tribal women Self Help Groups (SHGs).",
                    FundingLimit = "Up to ₹25 Lakhs per Cluster",
                    MaxFundingAmount = 2500000,
                    EligibilityJson = JsonSerializer.Serialize(new[] { "At least 10 active women SHGs formed", "Affiliated with NRLM/SRLM", "Dedicated marketing mentor on board" }),
                    DocumentsRequiredJson = JsonSerializer.Serialize(new[] { "SHG passbooks", "Cluster charter", "Machinery procurement breakdown" }),
                    IsActive = true
                }
            };
            await context.Schemes.AddRangeAsync(schemes);
            await context.SaveChangesAsync();
        }

        // 5. Seed Applications & Tracking Milestones
        if (!await context.Applications.AnyAsync())
        {
            var firstScheme = await context.Schemes.FirstAsync();
            var app1 = new Application
            {
                ApplicationNumber = "NGO-2026-00124",
                Title = "Mobile Healthcare Clinic Jharkhand Phase 2",
                SchemeId = firstScheme.Id,
                NgoId = demoNgo.Id,
                Status = ApplicationStatusType.ProposalSubmitted,
                GrantRequested = 4000000,
                GrantRequestedDisplay = "₹40.00 Lakhs",
                SubmittedAt = DateTime.UtcNow.AddDays(-11)
            };

            app1.Project = new Project
            {
                Abstract = "Deploying comprehensive mobile healthcare clinic across 35 tribal hamlets in Khunti district.",
                State = "Jharkhand",
                District = "Khunti",
                Block = "Torpa",
                Villages = "Dorma, Tapkara, Karra, Marcha",
                MaleBeneficiaries = 4500,
                FemaleBeneficiaries = 5200,
                TotalBeneficiaries = 9700,
                StBeneficiaries = 8900,
                Activities = "Weekly mobile OPD, hemoglobin testing, child vaccination, nutritional counseling",
                ExpectedOutcomes = "90% drop in unattended high-risk pregnancies and early screening of chronic diseases"
            };

            app1.Budget = new Budget
            {
                TotalAmount = 4000000,
                Items = new List<BudgetItem>
                {
                    new BudgetItem { Category = "Equipment", Description = "Mobile Clinic Vehicle & Customization", Quantity = 1, UnitCost = 2200000, Total = 2200000 },
                    new BudgetItem { Category = "Medical Supplies", Description = "Diagnostic kits & medicines stock", Quantity = 12, UnitCost = 80000, Total = 960000 },
                    new BudgetItem { Category = "Personnel", Description = "Doctor & Paramedic salaries (1 year)", Quantity = 1, UnitCost = 840000, Total = 840000 }
                }
            };

            app1.Reviews = new List<ApplicationReview>
            {
                new ApplicationReview { StageName = "Registered", Status = ReviewStatus.Completed, Remarks = "NGO Darpan verified and onboarding completed.", ActionDate = DateTime.UtcNow.AddDays(-15), Sequence = 1 },
                new ApplicationReview { StageName = "Proposal Submitted", Status = ReviewStatus.Completed, Remarks = "Project Proposal submitted via online portal.", ActionDate = DateTime.UtcNow.AddDays(-11), Sequence = 2 },
                new ApplicationReview { StageName = "District Review", Status = ReviewStatus.Current, Remarks = "Under review by District Welfare Committee Ranchi. Field inspection scheduled.", ActionDate = DateTime.UtcNow.AddDays(-3), Sequence = 3 },
                new ApplicationReview { StageName = "State Review", Status = ReviewStatus.Pending, Remarks = "Awaiting district report submission.", Sequence = 4 },
                new ApplicationReview { StageName = "Approved", Status = ReviewStatus.Pending, Remarks = "Pending state committee sanction.", Sequence = 5 },
                new ApplicationReview { StageName = "Sanctioned", Status = ReviewStatus.Pending, Remarks = "PFMS payment token generation pending.", Sequence = 6 }
            };

            await context.Applications.AddAsync(app1);
            await context.SaveChangesAsync();
        }

        // 6. Seed Jobs
        if (!await context.Jobs.AnyAsync())
        {
            var jobs = new List<Job>
            {
                new Job
                {
                    Code = "JOB-2026-001",
                    Title = "District Project Coordinator (M&E)",
                    Department = "Programs & Field Operations",
                    Location = "Ranchi, Jharkhand (with travel to Khunti & Gumla)",
                    Type = "Full-time",
                    Experience = "3 - 5 Years",
                    Salary = "₹35,000 - ₹45,000 / month",
                    Openings = 2,
                    Deadline = "2026-09-30",
                    IsUrgent = true,
                    ShortDesc = "Lead district-level program implementation, stakeholder coordination with District Administration, and monitoring field project metrics.",
                    ResponsibilitiesJson = JsonSerializer.Serialize(new[]
                    {
                        "Oversee baseline, midline, and endline survey field operations.",
                        "Liaise with District Welfare Officer (DWO) and Block Development Officers (BDO).",
                        "Coordinate team of 15+ community mobilizers and field animators.",
                        "Prepare monthly progress reports (MPR) for funding partners."
                    }),
                    QualificationsJson = JsonSerializer.Serialize(new[]
                    {
                        "Master's degree in Social Work (MSW), Rural Development, or Public Policy.",
                        "Minimum 3 years demonstrated experience in livelihood or health projects.",
                        "Fluency in Hindi and working knowledge of local languages (Mundari, Ho, or Kurukh)."
                    }),
                    DesirableSkillsJson = JsonSerializer.Serialize(new[]
                    {
                        "Experience using KoboToolbox or ODK for digital field surveys.",
                        "Valid two-wheeler driving license."
                    }),
                    IsActive = true
                },
                new Job
                {
                    Code = "JOB-2026-002",
                    Title = "Senior Accounts & Compliance Officer",
                    Department = "Finance & Administration",
                    Location = "Ranchi Head Office",
                    Type = "Full-time",
                    Experience = "4 - 7 Years",
                    Salary = "₹40,000 - ₹55,000 / month",
                    Openings = 1,
                    Deadline = "2026-09-25",
                    IsUrgent = false,
                    ShortDesc = "Manage grant ledger accounts, PFMS portal compliance, TDS/GST returns, and external statutory audits (12A, 80G, CSR-1).",
                    ResponsibilitiesJson = JsonSerializer.Serialize(new[]
                    {
                        "Prepare grant utilization certificates (UCs) in GFR-12A format.",
                        "Manage PFMS (Public Financial Management System) agency expenditure filing.",
                        "Maintain project-wise ledgers in Tally Prime."
                    }),
                    QualificationsJson = JsonSerializer.Serialize(new[]
                    {
                        "M.Com / Inter CA / MBA Finance with thorough knowledge of Indian NGO tax compliance.",
                        "Minimum 4 years hands-on experience in NGO or grant accounting."
                    }),
                    DesirableSkillsJson = JsonSerializer.Serialize(new[] { "PFMS portal expertise", "Advanced Excel" }),
                    IsActive = true
                }
            };
            await context.Jobs.AddRangeAsync(jobs);
            await context.SaveChangesAsync();
        }

        // 7. Seed FAQs
        if (!await context.FAQs.AnyAsync())
        {
            var faqs = new List<FAQ>
            {
                new FAQ { Category = "Grants & Eligibility", Question = "What are the core eligibility criteria for NGOs to apply for grants?", Answer = "The NGO must be registered under Indian Trust Act / Societies Registration Act for at least 3 years, possess a valid NITI Aayog Darpan ID, 12A registration, 80G tax exemption, and have clean audited financial statements without adverse remarks.", SortOrder = 1 },
                new FAQ { Category = "Grants & Eligibility", Question = "How can an NGO track the status of its submitted proposal?", Answer = "Navigate to the 'Tracking' tab on the portal, enter your unique Application Number (e.g., NGO-2026-00124), and view the real-time stage milestones from District Review to PFMS Fund Release.", SortOrder = 2 },
                new FAQ { Category = "Recruitment & Careers", Question = "How are candidates informed about their interview schedule?", Answer = "Shortlisted candidates receive an SMS and email notification with an interview link and schedule details. Candidates can also check their application status using their Application Reference Number.", SortOrder = 3 },
                new FAQ { Category = "Compliance", Question = "Is FCRA mandatory to receive foundation grants?", Answer = "No, domestic CSR funds, Central Ministry grants, and State Welfare allocations do not require FCRA. Only foreign philanthropic contributions require FCRA clearance.", SortOrder = 4 }
            };
            await context.FAQs.AddRangeAsync(faqs);
            await context.SaveChangesAsync();
        }
    }
}
