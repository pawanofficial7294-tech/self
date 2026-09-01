using Microsoft.EntityFrameworkCore;
using SELF.Application.Auth.DTOs;
using SELF.Application.Auth.Interfaces;
using SELF.Domain.Entities;
using SELF.Domain.Enums;
using SELF.Infrastructure.Data;
using SELF.Infrastructure.Services;
using SELF.Shared.Exceptions;

namespace SELF.Application.Auth;

public class AuthService(
    ApplicationDbContext context,
    IPasswordService passwordService,
    IJwtService jwtService) : IAuthService
{
    private readonly ApplicationDbContext _context = context;
    private readonly IPasswordService _passwordService = passwordService;
    private readonly IJwtService _jwtService = jwtService;

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var normalizedLogin = request.LoginId.Trim().ToLower();
        var user = await _context.Users
            .Include(u => u.Ngo)
            .FirstOrDefaultAsync(u => (u.Username.ToLower() == normalizedLogin || u.Email.ToLower() == normalizedLogin) && !u.IsDeleted);

        if (user == null || !_passwordService.VerifyPassword(request.SecurityCode, user.PasswordHash))
        {
            throw new UnauthorizedException("Invalid credentials. Please check your username/email and password.");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedException("Your account is currently disabled. Please contact the administrator.");
        }

        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var token = _jwtService.GenerateToken(user);

        return new LoginResponse
        {
            Id = user.Id.ToString(),
            Username = user.Username,
            Name = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString(),
            DarpanId = user.DarpanId,
            OfficerId = user.OfficerId,
            Token = token,
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

    public async Task<LoginResponse> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _context.Users.AnyAsync(u =>
            u.Username.ToLower() == request.Username.Trim().ToLower() ||
            u.Email.ToLower() == request.Email.Trim().ToLower());

        if (existingUser)
        {
            throw new BadRequestException("A user with this username or email already exists.");
        }

        NGO? newNgo = null;
        if (request.Role == UserRole.NGO)
        {
            newNgo = new NGO
            {
                Name = request.FullName,
                DarpanId = request.DarpanId ?? $"JH/{DateTime.UtcNow.Year}/{new Random().Next(10000, 99999)}",
                RegistrationNumber = request.RegistrationNumber ?? "REG-" + new Random().Next(1000, 9999),
                PanNumber = request.PanNumber ?? "AAATV" + new Random().Next(1000, 9999) + "C",
                State = request.State ?? "Jharkhand",
                District = request.District ?? "Ranchi",
                Phone = request.Phone ?? "",
                Email = request.Email,
                ComplianceStatus = "Pending Verification",
                IsVerified = false
            };
            await _context.NGOs.AddAsync(newNgo);
            await _context.SaveChangesAsync();
        }

        var user = new User
        {
            Username = request.Username.Trim(),
            Email = request.Email.Trim(),
            PasswordHash = _passwordService.HashPassword(request.Password),
            FullName = request.FullName.Trim(),
            Role = request.Role,
            NgoId = newNgo?.Id,
            DarpanId = newNgo?.DarpanId,
            CanUploadImages = true,
            CanPostJobs = request.Role == UserRole.ADMIN,
            CanSubmitProjects = request.Role == UserRole.NGO,
            CanManageSchemes = request.Role == UserRole.ADMIN,
            CanManageUsers = request.Role == UserRole.ADMIN,
            IsActive = true
        };

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        var token = _jwtService.GenerateToken(user);

        return new LoginResponse
        {
            Id = user.Id.ToString(),
            Username = user.Username,
            Name = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString(),
            DarpanId = user.DarpanId,
            OfficerId = user.OfficerId,
            Token = token,
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

    public async Task<bool> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u =>
            (u.Username.ToLower() == request.LoginId.Trim().ToLower() || u.Email.ToLower() == request.LoginId.Trim().ToLower()) &&
            u.Email.ToLower() == request.Email.Trim().ToLower() && !u.IsDeleted);

        return true;
    }

    public async Task<bool> ResetPasswordAsync(ResetPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 6)
        {
            throw new BadRequestException("Password must be at least 6 characters long.");
        }
        return true;
    }

    public async Task<UserProfileResponse> GetCurrentUserProfileAsync(Guid userId)
    {
        var user = await _context.Users
            .Include(u => u.Ngo)
            .FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted)
            ?? throw new NotFoundException($"User with ID '{userId}' was not found.");

        NgoProfileDto? ngoDto = null;
        if (user.Ngo != null)
        {
            ngoDto = new NgoProfileDto
            {
                Id = user.Ngo.Id,
                Name = user.Ngo.Name,
                RegistrationNumber = user.Ngo.RegistrationNumber,
                PanNumber = user.Ngo.PanNumber,
                DarpanId = user.Ngo.DarpanId,
                State = user.Ngo.State,
                District = user.Ngo.District,
                ContactPerson = user.Ngo.ContactPerson,
                Phone = user.Ngo.Phone,
                Email = user.Ngo.Email,
                Address = user.Ngo.Address,
                ComplianceStatus = user.Ngo.ComplianceStatus,
                IsVerified = user.Ngo.IsVerified
            };
        }

        return new UserProfileResponse
        {
            Id = user.Id.ToString(),
            Username = user.Username,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString(),
            DarpanId = user.DarpanId,
            OfficerId = user.OfficerId,
            NgoId = user.NgoId,
            Ngo = ngoDto,
            Permissions = new UserPermissionsDto
            {
                CanUploadImages = user.CanUploadImages,
                CanPostJobs = user.CanPostJobs,
                CanSubmitProjects = user.CanSubmitProjects,
                CanManageSchemes = user.CanManageSchemes,
                CanManageUsers = user.CanManageUsers
            },
            IsActive = user.IsActive,
            LastLoginAt = user.LastLoginAt,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task<UserProfileResponse> UpdateUserProfileAsync(Guid userId, UpdateProfileRequest request)
    {
        var user = await _context.Users
            .Include(u => u.Ngo)
            .FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted)
            ?? throw new NotFoundException($"User with ID '{userId}' was not found.");

        if (!string.IsNullOrWhiteSpace(request.FullName))
        {
            user.FullName = request.FullName.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.Email) && !user.Email.Equals(request.Email.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            var emailExists = await _context.Users.AnyAsync(u => u.Id != userId && u.Email.ToLower() == request.Email.Trim().ToLower() && !u.IsDeleted);
            if (emailExists)
            {
                throw new BadRequestException("The specified email address is already in use by another account.");
            }
            user.Email = request.Email.Trim();
        }

        if (user.Ngo != null)
        {
            if (!string.IsNullOrWhiteSpace(request.ContactPerson)) user.Ngo.ContactPerson = request.ContactPerson.Trim();
            if (!string.IsNullOrWhiteSpace(request.Phone)) user.Ngo.Phone = request.Phone.Trim();
            if (!string.IsNullOrWhiteSpace(request.Address)) user.Ngo.Address = request.Address.Trim();
        }

        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return await GetCurrentUserProfileAsync(userId);
    }
}
