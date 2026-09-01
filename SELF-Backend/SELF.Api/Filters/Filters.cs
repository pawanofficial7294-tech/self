using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using SELF.Domain.Enums;
using SELF.Infrastructure.Data;
using SELF.Shared.DTOs;

namespace SELF.Api.Filters;

public class ValidationFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ModelState.IsValid)
        {
            var errors = context.ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

            var response = ApiResponse<object>.FailureResult("Validation failed.", errors);
            context.Result = new BadRequestObjectResult(response);
        }
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
    }
}

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false)]
public class RequirePermissionAttribute : TypeFilterAttribute
{
    public string PermissionKey { get; }

    public RequirePermissionAttribute(string permissionKey) : base(typeof(PermissionAuthorizationFilter))
    {
        PermissionKey = permissionKey;
        Arguments = [permissionKey];
    }
}

public class PermissionAuthorizationFilter(string permissionKey, ApplicationDbContext dbContext) : IAsyncAuthorizationFilter
{
    private readonly string _permissionKey = permissionKey;
    private readonly ApplicationDbContext _dbContext = dbContext;

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;
        if (!user.Identity?.IsAuthenticated ?? true)
        {
            context.Result = new UnauthorizedObjectResult(ApiResponse<object>.FailureResult("Authentication is required."));
            return;
        }

        // Admin role bypasses granular restrictions
        if (user.IsInRole(UserRole.ADMIN.ToString()) || user.IsInRole("Admin"))
        {
            return;
        }

        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            context.Result = new UnauthorizedObjectResult(ApiResponse<object>.FailureResult("Invalid token user identifier."));
            return;
        }

        var dbUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted);
        if (dbUser == null || !dbUser.IsActive)
        {
            context.Result = new ObjectResult(ApiResponse<object>.FailureResult("User account not found or deactivated."))
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
            return;
        }

        bool hasPermission = _permissionKey switch
        {
            Shared.Constants.Permissions.ImageUpload => dbUser.CanUploadImages,
            Shared.Constants.Permissions.JobPost => dbUser.CanPostJobs,
            Shared.Constants.Permissions.ProjectUpload => dbUser.CanSubmitProjects,
            Shared.Constants.Permissions.SchemeManage => dbUser.CanManageSchemes,
            Shared.Constants.Permissions.UserManage => dbUser.CanManageUsers,
            _ => false
        };

        if (!hasPermission)
        {
            context.Result = new ObjectResult(ApiResponse<object>.FailureResult($"Access denied: You do not have permission '{_permissionKey}'. Please contact an administrator to grant access."))
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
        }
    }
}
