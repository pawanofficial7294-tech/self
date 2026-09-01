using Microsoft.EntityFrameworkCore;
using SELF.Domain.Entities;

namespace SELF.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserPermission> UserPermissions => Set<UserPermission>();
    public DbSet<NGO> NGOs => Set<NGO>();
    public DbSet<NGODocument> NGODocuments => Set<NGODocument>();
    public DbSet<Scheme> Schemes => Set<Scheme>();
    public DbSet<Application> Applications => Set<Application>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Budget> Budgets => Set<Budget>();
    public DbSet<BudgetItem> BudgetItems => Set<BudgetItem>();
    public DbSet<ApplicationReview> ApplicationReviews => Set<ApplicationReview>();
    public DbSet<Job> Jobs => Set<Job>();
    public DbSet<Candidate> Candidates => Set<Candidate>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<Resource> Resources => Set<Resource>();
    public DbSet<FAQ> FAQs => Set<FAQ>();
    public DbSet<Grant> Grants => Set<Grant>();
    public DbSet<GrantDisbursement> GrantDisbursements => Set<GrantDisbursement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User indexes and relationships
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Username).IsUnique();
            entity.HasIndex(u => u.Email).IsUnique();
            entity.HasOne(u => u.Ngo)
                  .WithMany()
                  .HasForeignKey(u => u.NgoId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Application relationships
        modelBuilder.Entity<Application>(entity =>
        {
            entity.HasIndex(a => a.ApplicationNumber).IsUnique();
            entity.HasOne(a => a.Scheme)
                  .WithMany(s => s.Applications)
                  .HasForeignKey(a => a.SchemeId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Ngo)
                  .WithMany(n => n.Applications)
                  .HasForeignKey(a => a.NgoId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(a => a.Project)
                  .WithOne(p => p.Application)
                  .HasForeignKey<Project>(p => p.ApplicationId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(a => a.Budget)
                  .WithOne(b => b.Application)
                  .HasForeignKey<Budget>(b => b.ApplicationId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(a => a.Reviews)
                  .WithOne(r => r.Application)
                  .HasForeignKey(r => r.ApplicationId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Budget relationships
        modelBuilder.Entity<Budget>(entity =>
        {
            entity.HasMany(b => b.Items)
                  .WithOne(i => i.Budget)
                  .HasForeignKey(i => i.BudgetId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Job & Candidate
        modelBuilder.Entity<Job>(entity =>
        {
            entity.HasIndex(j => j.Code).IsUnique();
            entity.HasMany(j => j.Candidates)
                  .WithOne(c => c.Job)
                  .HasForeignKey(c => c.JobId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Grant & Disbursement
        modelBuilder.Entity<Grant>(entity =>
        {
            entity.HasMany(g => g.Disbursements)
                  .WithOne(d => d.Grant)
                  .HasForeignKey(d => d.GrantId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Decimal Precision configurations for SQL Server
        modelBuilder.Entity<Application>().Property(a => a.GrantRequested).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Budget>().Property(b => b.TotalAmount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<BudgetItem>().Property(b => b.Total).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<BudgetItem>().Property(b => b.UnitCost).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Grant>().Property(g => g.DisbursedAmount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Grant>().Property(g => g.SanctionedAmount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<GrantDisbursement>().Property(g => g.Amount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Scheme>().Property(s => s.MaxFundingAmount).HasColumnType("decimal(18,2)");
    }
}
