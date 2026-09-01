using Microsoft.Extensions.FileProviders;
using SELF.Api.Extensions;
using SELF.Api.Filters;
using SELF.Api.Middleware;
using SELF.Infrastructure.Data;
using SELF.Infrastructure.Data.Seed;
using SELF.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Controllers & Global Validation Filter
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationFilter>();
});

// 2. Application, Infrastructure, DB, CORS
builder.Services.AddApplicationServices(builder.Configuration);

// 3. JWT Authentication & Authorization
builder.Services.AddJwtAuthentication(builder.Configuration);

// 4. Swagger with JWT Support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerDocumentation();

var app = builder.Build();

// Seed Database automatically on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        var passwordService = services.GetRequiredService<IPasswordService>();
        await DbSeeder.SeedAsync(context, passwordService);
        logger.LogInformation("Database seeded successfully with roles, admin, demo NGO, schemes, and FAQs.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

// Global Exception Handling
app.UseMiddleware<ExceptionMiddleware>();

// Request Timing and Diagnostic Logging
app.UseMiddleware<RequestLoggingMiddleware>();

// Swagger UI (available in both development and production)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SELF API v1");
    c.RoutePrefix = "swagger";
    c.DocumentTitle = "SELF Portal API Documentation";
});

// Static Files for Uploads folder
var uploadsDir = Path.Combine(app.Environment.ContentRootPath, "uploads");
if (!Directory.Exists(uploadsDir))
{
    Directory.CreateDirectory(uploadsDir);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsDir),
    RequestPath = "/uploads"
});

app.UseRouting();

// CORS for Frontend (must be after UseRouting and before UseAuthentication/UseAuthorization)
app.UseCors("AllowReactApp");

// Authentication & Custom JWT Claims Enrichment
app.UseAuthentication();
app.UseMiddleware<JwtMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();
