using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SELF.Application.NGOs.DTOs;
using SELF.Application.NGOs.Interfaces;
using SELF.Domain.Entities;
using SELF.Domain.Enums;
using SELF.Infrastructure.Data;
using SELF.Infrastructure.Services;
using SELF.Shared.Exceptions;

namespace SELF.Application.NGOs;

public class NGOService(
    ApplicationDbContext context,
    IFileStorageService fileStorageService) : INGOService
{
    private readonly ApplicationDbContext _context = context;
    private readonly IFileStorageService _fileStorageService = fileStorageService;

    public async Task<List<NGOResponse>> GetAllNGOsAsync()
    {
        var ngos = await _context.NGOs
            .Include(n => n.Documents)
            .Where(n => !n.IsDeleted)
            .ToListAsync();

        return ngos.Select(MapToResponse).ToList();
    }

    public async Task<NGOResponse> GetNGOByIdAsync(Guid id)
    {
        var ngo = await _context.NGOs
            .Include(n => n.Documents)
            .FirstOrDefaultAsync(n => n.Id == id && !n.IsDeleted)
            ?? throw new NotFoundException($"NGO with ID '{id}' was not found.");

        return MapToResponse(ngo);
    }

    public async Task<NGOResponse?> GetNGOByDarpanIdAsync(string darpanId)
    {
        var ngo = await _context.NGOs
            .Include(n => n.Documents)
            .FirstOrDefaultAsync(n => n.DarpanId.ToLower() == darpanId.Trim().ToLower() && !n.IsDeleted);

        return ngo != null ? MapToResponse(ngo) : null;
    }

    public async Task<NGOResponse> CreateNGOAsync(CreateNGORequest request)
    {
        var exists = await _context.NGOs.AnyAsync(n => n.DarpanId.ToLower() == request.DarpanId.Trim().ToLower());
        if (exists)
        {
            throw new BadRequestException("An organization with this Darpan ID is already registered.");
        }

        var ngo = new NGO
        {
            Name = request.Name.Trim(),
            DarpanId = request.DarpanId.Trim(),
            RegistrationNumber = request.RegistrationNumber.Trim(),
            RegistrationAuthority = request.RegistrationAuthority.Trim(),
            PanNumber = request.PanNumber.Trim(),
            State = request.State.Trim(),
            District = request.District.Trim(),
            Address = request.Address.Trim(),
            ContactPerson = request.ContactPerson.Trim(),
            Phone = request.Phone.Trim(),
            Email = request.Email.Trim(),
            ComplianceStatus = "Active Verified",
            IsVerified = true
        };

        await _context.NGOs.AddAsync(ngo);
        await _context.SaveChangesAsync();

        return MapToResponse(ngo);
    }

    public async Task<NGODocumentResponse> UploadDocumentAsync(Guid ngoId, string title, DocumentType type, IFormFile file)
    {
        var ngo = await _context.NGOs.FirstOrDefaultAsync(n => n.Id == ngoId && !n.IsDeleted)
            ?? throw new NotFoundException($"NGO with ID '{ngoId}' was not found.");

        var (filePath, fileName, fileSize) = await _fileStorageService.SaveFileAsync(file, "ngo-documents");

        var doc = new NGODocument
        {
            NgoId = ngo.Id,
            Title = title,
            FileName = fileName,
            FilePath = filePath,
            ContentType = file.ContentType,
            FileSizeBytes = fileSize,
            DocumentType = type
        };

        await _context.NGODocuments.AddAsync(doc);
        await _context.SaveChangesAsync();

        return new NGODocumentResponse
        {
            Id = doc.Id,
            Title = doc.Title,
            FileName = doc.FileName,
            FilePath = doc.FilePath,
            DocumentType = doc.DocumentType.ToString(),
            FileSizeBytes = doc.FileSizeBytes,
            CreatedAt = doc.CreatedAt
        };
    }

    private static NGOResponse MapToResponse(NGO ngo)
    {
        return new NGOResponse
        {
            Id = ngo.Id,
            Name = ngo.Name,
            DarpanId = ngo.DarpanId,
            RegistrationNumber = ngo.RegistrationNumber,
            RegistrationAuthority = ngo.RegistrationAuthority,
            PanNumber = ngo.PanNumber,
            State = ngo.State,
            District = ngo.District,
            Address = ngo.Address,
            ContactPerson = ngo.ContactPerson,
            Phone = ngo.Phone,
            Email = ngo.Email,
            ComplianceStatus = ngo.ComplianceStatus,
            IsVerified = ngo.IsVerified,
            Documents = ngo.Documents.Select(d => new NGODocumentResponse
            {
                Id = d.Id,
                Title = d.Title,
                FileName = d.FileName,
                FilePath = d.FilePath,
                DocumentType = d.DocumentType.ToString(),
                FileSizeBytes = d.FileSizeBytes,
                CreatedAt = d.CreatedAt
            }).ToList()
        };
    }
}
