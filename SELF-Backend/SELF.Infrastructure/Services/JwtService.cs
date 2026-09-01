using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SELF.Domain.Entities;

namespace SELF.Infrastructure.Services;

public interface IJwtService
{
    string GenerateToken(User user);
    ClaimsPrincipal? ValidateToken(string token);
}

public class JwtService(IConfiguration configuration) : IJwtService
{
    private readonly IConfiguration _configuration = configuration;

    public string GenerateToken(User user)
    {
        var secret = _configuration["Jwt:Secret"] ?? "SELF_DefaultSuperSecretKeyForDevelopmentAndTesting2026_Minimum32Chars!";
        var issuer = _configuration["Jwt:Issuer"] ?? "SELF.Api";
        var audience = _configuration["Jwt:Audience"] ?? "SELF.Client";
        var expiryMinutes = int.TryParse(_configuration["Jwt:ExpiryMinutes"], out var mins) ? mins : 1440; // 24 hours

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Username),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role.ToString()),
            new("FullName", user.FullName),
            new("CanUploadImages", user.CanUploadImages.ToString().ToLower()),
            new("CanPostJobs", user.CanPostJobs.ToString().ToLower()),
            new("CanSubmitProjects", user.CanSubmitProjects.ToString().ToLower()),
            new("CanManageSchemes", user.CanManageSchemes.ToString().ToLower()),
            new("CanManageUsers", user.CanManageUsers.ToString().ToLower())
        };

        if (!string.IsNullOrEmpty(user.DarpanId))
        {
            claims.Add(new Claim("DarpanId", user.DarpanId));
        }

        if (!string.IsNullOrEmpty(user.OfficerId))
        {
            claims.Add(new Claim("OfficerId", user.OfficerId));
        }

        if (user.NgoId.HasValue)
        {
            claims.Add(new Claim("NgoId", user.NgoId.Value.ToString()));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(expiryMinutes),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = credentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public ClaimsPrincipal? ValidateToken(string token)
    {
        var secret = _configuration["Jwt:Secret"] ?? "SELF_DefaultSuperSecretKeyForDevelopmentAndTesting2026_Minimum32Chars!";
        var issuer = _configuration["Jwt:Issuer"] ?? "SELF.Api";
        var audience = _configuration["Jwt:Audience"] ?? "SELF.Client";

        var tokenHandler = new JwtSecurityTokenHandler();
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
            ValidateIssuer = true,
            ValidIssuer = issuer,
            ValidateAudience = true,
            ValidAudience = audience,
            ClockSkew = TimeSpan.Zero
        };

        try
        {
            var principal = tokenHandler.ValidateToken(token, validationParameters, out _);
            return principal;
        }
        catch
        {
            return null;
        }
    }
}
