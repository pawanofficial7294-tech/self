using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using SELF.Application.Admin;
using SELF.Application.Admin.Interfaces;
using SELF.Application.Applications;
using SELF.Application.Applications.Interfaces;
using SELF.Application.Auth;
using SELF.Application.Auth.Interfaces;
using SELF.Application.Candidates;
using SELF.Application.Candidates.Interfaces;
using SELF.Application.Careers;
using SELF.Application.Careers.Interfaces;
using SELF.Application.Contact;
using SELF.Application.Contact.Interfaces;
using SELF.Application.Dashboard;
using SELF.Application.Dashboard.Interfaces;
using SELF.Application.FAQ;
using SELF.Application.FAQ.Interfaces;
using SELF.Application.Grants;
using SELF.Application.Grants.Interfaces;
using SELF.Application.NGOs;
using SELF.Application.NGOs.Interfaces;
using SELF.Application.Resources;
using SELF.Application.Resources.Interfaces;
using SELF.Application.Schemes;
using SELF.Application.Schemes.Interfaces;
using SELF.Application.Tracking;
using SELF.Application.Tracking.Interfaces;
using SELF.Infrastructure.Data;
using SELF.Infrastructure.Repositories;
using SELF.Infrastructure.Services;

namespace SELF.Api.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        // 1. Entity Framework Core (PostgreSQL)
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));

        // 2. Generic Repositories
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

        // 3. Infrastructure Services
        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IFileStorageService, FileStorageService>();

        // 4. Application Business Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAdminService, AdminService>();
        services.AddScoped<INGOService, NGOService>();
        services.AddScoped<IApplicationService, ApplicationService>();
        services.AddScoped<ITrackingService, TrackingService>();
        services.AddScoped<ISchemeService, SchemeService>();
        services.AddScoped<ICareerService, CareerService>();
        services.AddScoped<ICandidateService, CandidateService>();
        services.AddScoped<IContactService, ContactService>();
        services.AddScoped<IResourceService, ResourceService>();
        services.AddScoped<IFAQService, FAQService>();
        services.AddScoped<IGrantService, GrantService>();
        services.AddScoped<IDashboardService, DashboardService>();

        // 5. CORS for React Frontend (allows localhost on any port: 5173, 5174, etc.)
        services.AddCors(options =>
        {
            options.AddPolicy("AllowReactApp", policy =>
            {
                policy.SetIsOriginAllowed(origin =>
                    {
                        if (string.IsNullOrWhiteSpace(origin)) return false;
                        try
                        {
                            var uri = new Uri(origin);
                            return uri.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase) ||
                                   uri.Host.Equals("127.0.0.1", StringComparison.OrdinalIgnoreCase) ||
                                   uri.Host.EndsWith("vercel.app", StringComparison.OrdinalIgnoreCase) ||
                                   uri.Host.EndsWith("netlify.app", StringComparison.OrdinalIgnoreCase) ||
                                   uri.Host.EndsWith("onrender.com", StringComparison.OrdinalIgnoreCase);
                        }
                        catch
                        {
                            return false;
                        }
                    })
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        return services;
    }
}

public static class AuthenticationExtensions
{
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var secret = configuration["Jwt:Secret"] ?? "SELF_DefaultSuperSecretKeyForDevelopmentAndTesting2026_Minimum32Chars!";
        var issuer = configuration["Jwt:Issuer"] ?? "SELF.Api";
        var audience = configuration["Jwt:Audience"] ?? "SELF.Client";

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
                ValidateIssuer = true,
                ValidIssuer = issuer,
                ValidateAudience = true,
                ValidAudience = audience,
                ClockSkew = TimeSpan.Zero
            };
        });

        services.AddAuthorization();
        return services;
    }
}

public static class SwaggerExtensions
{
    public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
    {
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "SELF Portal Web API",
                Version = "v1",
                Description = "Backend RESTful API for Socio Economic Lacuna Foundation (SELF) - NGO Grant Management, Applications, Tracking, Careers, and Granular Permission Management.",
                Contact = new OpenApiContact
                {
                    Name = "SELF Support Team",
                    Email = "support@self.org.in"
                }
            });

            // Add JWT Bearer Security Definition
            var securityScheme = new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Description = "Enter JWT Bearer token only. Format: 'Bearer {your_token}'",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT"
            };

            c.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, securityScheme);

            var securityRequirement = new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecuritySchemeReference(JwtBearerDefaults.AuthenticationScheme),
                    new List<string>()
                }
            };

            c.AddSecurityRequirement((doc) => securityRequirement);
        });

        return services;
    }
}
