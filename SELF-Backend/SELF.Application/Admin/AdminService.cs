using Microsoft.EntityFrameworkCore;
using SELF.Application.Admin.DTOs;
using SELF.Application.Admin.Interfaces;
using SELF.Application.Auth.DTOs;
using SELF.Domain.Entities;
using SELF.Infrastructure.Data;
using SELF.Infrastructure.Services;
using SELF.Shared.Exceptions;

namespace SELF.Application.Admin;

public class AdminService(
    ApplicationDbContext context,
    IPasswordService passwordService) : IAdminService
{
    private readonly ApplicationDbContext _context = context;
    private readonly IPasswordService _passwordService = passwordService;

    public async Task<List<UserSummaryDto>> GetAllUsersAsync()
    {
        var users = await _context.Users
            .Where(u => !u.IsDeleted)
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync();

        return users.Select(MapToDto).ToList();
    }

    public async Task<UserSummaryDto> GetUserByIdAsync(Guid id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted)
            ?? throw new NotFoundException($"User with ID '{id}' was not found.");

        return MapToDto(user);
    }

    public async Task<UserSummaryDto> CreateUserAsync(CreateUserRequest request)
    {
        var exists = await _context.Users.AnyAsync(u =>
            u.Username.ToLower() == request.Username.Trim().ToLower() ||
            u.Email.ToLower() == request.Email.Trim().ToLower());

        if (exists)
        {
            throw new BadRequestException("Username or Email is already registered in the system.");
        }

        var user = new User
        {
            Username = request.Username.Trim(),
            Email = request.Email.Trim(),
            PasswordHash = _passwordService.HashPassword(request.Password),
            FullName = request.FullName.Trim(),
            Role = request.Role,
            DarpanId = request.DarpanId,
            OfficerId = request.OfficerId,
            CanUploadImages = request.CanUploadImages,
            CanPostJobs = request.CanPostJobs,
            CanSubmitProjects = request.CanSubmitProjects,
            CanManageSchemes = request.CanManageSchemes,
            CanManageUsers = request.CanManageUsers,
            IsActive = true
        };

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task<UserSummaryDto> UpdateUserPermissionsAsync(Guid id, UpdateUserPermissionsRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted)
            ?? throw new NotFoundException($"User with ID '{id}' was not found.");

        if (request.CanUploadImages.HasValue) user.CanUploadImages = request.CanUploadImages.Value;
        if (request.CanPostJobs.HasValue) user.CanPostJobs = request.CanPostJobs.Value;
        if (request.CanSubmitProjects.HasValue) user.CanSubmitProjects = request.CanSubmitProjects.Value;
        if (request.CanManageSchemes.HasValue) user.CanManageSchemes = request.CanManageSchemes.Value;
        if (request.CanManageUsers.HasValue) user.CanManageUsers = request.CanManageUsers.Value;
        if (request.IsActive.HasValue) user.IsActive = request.IsActive.Value;

        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task<bool> DeleteUserAsync(Guid id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted)
            ?? throw new NotFoundException($"User with ID '{id}' was not found.");

        user.IsDeleted = true;
        user.IsActive = false;
        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }

    private static UserSummaryDto MapToDto(User user)
    {
        return new UserSummaryDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role.ToString(),
            DarpanId = user.DarpanId,
            OfficerId = user.OfficerId,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            LastLoginAt = user.LastLoginAt,
            Permissions = new UserPermissionsDto
            {
                CanUploadImages = user.CanUploadImages,
                CanPostJobs = user.CanPostJobs,
                CanSubmitProjects = user.CanSubmitProjects,
                CanManageSchemes = user.CanManageSchemes,
                CanManageUsers = user.CanManageUsers
            }
        };
    }
}
