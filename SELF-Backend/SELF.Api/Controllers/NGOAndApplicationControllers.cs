using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SELF.Api.Filters;
using SELF.Application.Applications.DTOs;
using SELF.Application.Applications.Interfaces;
using SELF.Application.NGOs.DTOs;
using SELF.Application.NGOs.Interfaces;
using SELF.Domain.Enums;
using SELF.Shared.Constants;
using SELF.Shared.DTOs;

using SELF.Application.Tracking.Interfaces;
using SELF.Application.Schemes.Interfaces;

namespace SELF.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NGOController(INGOService ngoService) : ControllerBase
{
    private readonly INGOService _ngoService = ngoService;

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<NGOResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllNGOs()
    {
        var list = await _ngoService.GetAllNGOsAsync();
        return Ok(ApiResponse<List<NGOResponse>>.SuccessResult(list));
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<NGOResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetNGOById(Guid id)
    {
        var ngo = await _ngoService.GetNGOByIdAsync(id);
        return Ok(ApiResponse<NGOResponse>.SuccessResult(ngo));
    }

    [HttpGet("darpan/{darpanId}")]
    [ProducesResponseType(typeof(ApiResponse<NGOResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetNGOByDarpanId(string darpanId)
    {
        var ngo = await _ngoService.GetNGOByDarpanIdAsync(darpanId);
        if (ngo == null) return NotFound(ApiResponse<object>.FailureResult("NGO with specified Darpan ID not found."));
        return Ok(ApiResponse<NGOResponse>.SuccessResult(ngo));
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<NGOResponse>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateNGO([FromBody] CreateNGORequest request)
    {
        var created = await _ngoService.CreateNGOAsync(request);
        return CreatedAtAction(nameof(GetNGOById), new { id = created.Id }, ApiResponse<NGOResponse>.SuccessResult(created, "NGO registered successfully."));
    }

    [HttpPost("{id:guid}/documents")]
    [Authorize]
    [RequirePermission(Permissions.ImageUpload)]
    [ProducesResponseType(typeof(ApiResponse<NGODocumentResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadDocument(Guid id, [FromForm] string title, [FromForm] DocumentType type, IFormFile file)
    {
        var doc = await _ngoService.UploadDocumentAsync(id, title, type, file);
        return Ok(ApiResponse<NGODocumentResponse>.SuccessResult(doc, "Document uploaded successfully."));
    }
}

[ApiController]
[Route("api/[controller]")]
public class ApplicationController(IApplicationService applicationService, INGOService ngoService) : ControllerBase
{
    private readonly IApplicationService _applicationService = applicationService;
    private readonly INGOService _ngoService = ngoService;

    [HttpPost("submit")]
    [Authorize]
    [RequirePermission(Permissions.ProjectUpload)]
    [ProducesResponseType(typeof(ApiResponse<ApplicationResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> SubmitProjectDirect([FromBody] ProjectProposalRequest request, [FromQuery] Guid? ngoId)
    {
        var targetNgoId = ngoId;
        if (!targetNgoId.HasValue)
        {
            var ngoIdClaim = User.FindFirst("NgoId")?.Value;
            if (Guid.TryParse(ngoIdClaim, out var parsed)) targetNgoId = parsed;
        }

        if (!targetNgoId.HasValue)
        {
            var allNgos = await _ngoService.GetAllNGOsAsync();
            if (allNgos.Count > 0) targetNgoId = allNgos[0].Id;
        }

        if (!targetNgoId.HasValue)
        {
            return BadRequest(ApiResponse<object>.FailureResult("No target NGO specified for this project."));
        }

        var app = await _applicationService.SubmitProposalAsync(targetNgoId.Value, request);
        return Ok(ApiResponse<ApplicationResponse>.SuccessResult(app, "Project posted successfully."));
    }

    [HttpPost("ngo/{ngoId:guid}/submit")]
    [Authorize]
    [RequirePermission(Permissions.ProjectUpload)]
    [ProducesResponseType(typeof(ApiResponse<ApplicationResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> SubmitProposal(Guid ngoId, [FromBody] ProjectProposalRequest request)
    {
        var app = await _applicationService.SubmitProposalAsync(ngoId, request);
        return Ok(ApiResponse<ApplicationResponse>.SuccessResult(app, "Project proposal submitted successfully."));
    }

    [HttpGet("ngo/{ngoId:guid}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<List<ApplicationResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetNGOApplications(Guid ngoId)
    {
        var list = await _applicationService.GetNGOApplicationsAsync(ngoId);
        return Ok(ApiResponse<List<ApplicationResponse>>.SuccessResult(list));
    }

    [HttpGet]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Officer}")]
    [ProducesResponseType(typeof(ApiResponse<List<ApplicationResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllApplications()
    {
        var list = await _applicationService.GetAllApplicationsAsync();
        return Ok(ApiResponse<List<ApplicationResponse>>.SuccessResult(list));
    }

    [HttpGet("track/{applicationId}")]
    [ProducesResponseType(typeof(ApiResponse<ApplicationTrackingResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> TrackApplication(string applicationId)
    {
        var tracking = await _applicationService.TrackApplicationAsync(applicationId);
        return Ok(ApiResponse<ApplicationTrackingResponse>.SuccessResult(tracking));
    }

    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.Officer}")]
    [ProducesResponseType(typeof(ApiResponse<ApplicationResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromQuery] ApplicationStatusType status, [FromQuery] string? remarks)
    {
        var updated = await _applicationService.UpdateApplicationStatusAsync(id, status, remarks);
        return Ok(ApiResponse<ApplicationResponse>.SuccessResult(updated, "Application status updated successfully."));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteApplication(Guid id)
    {
        var result = await _applicationService.DeleteApplicationAsync(id);
        return Ok(ApiResponse<bool>.SuccessResult(result, "Application removed successfully."));
    }
}

[ApiController]
[Route("api/[controller]")]
public class TrackingController(ITrackingService trackingService) : ControllerBase
{
    private readonly ITrackingService _trackingService = trackingService;

    [HttpGet("{applicationId}")]
    [ProducesResponseType(typeof(ApiResponse<ApplicationTrackingResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Track(string applicationId)
    {
        var result = await _trackingService.TrackApplicationAsync(applicationId);
        return Ok(ApiResponse<ApplicationTrackingResponse>.SuccessResult(result));
    }
}

[ApiController]
[Route("api/[controller]")]
public class SchemeController(ISchemeService schemeService) : ControllerBase
{
    private readonly ISchemeService _schemeService = schemeService;

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<SELF.Application.Schemes.DTOs.SchemeResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllSchemes([FromQuery] string? category)
    {
        var schemes = await _schemeService.GetAllSchemesAsync(category);
        return Ok(ApiResponse<List<SELF.Application.Schemes.DTOs.SchemeResponse>>.SuccessResult(schemes));
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<SELF.Application.Schemes.DTOs.SchemeResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSchemeById(Guid id)
    {
        var scheme = await _schemeService.GetSchemeByIdAsync(id);
        return Ok(ApiResponse<SELF.Application.Schemes.DTOs.SchemeResponse>.SuccessResult(scheme));
    }

    [HttpPost]
    [Authorize]
    [RequirePermission(Permissions.SchemeManage)]
    [ProducesResponseType(typeof(ApiResponse<SELF.Application.Schemes.DTOs.SchemeResponse>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateScheme([FromBody] SELF.Application.Schemes.DTOs.CreateSchemeRequest request)
    {
        var scheme = await _schemeService.CreateSchemeAsync(request);
        return CreatedAtAction(nameof(GetSchemeById), new { id = scheme.Id }, ApiResponse<SELF.Application.Schemes.DTOs.SchemeResponse>.SuccessResult(scheme, "Scheme created successfully."));
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    [RequirePermission(Permissions.SchemeManage)]
    [ProducesResponseType(typeof(ApiResponse<SELF.Application.Schemes.DTOs.SchemeResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateScheme(Guid id, [FromBody] SELF.Application.Schemes.DTOs.UpdateSchemeRequest request)
    {
        var scheme = await _schemeService.UpdateSchemeAsync(id, request);
        return Ok(ApiResponse<SELF.Application.Schemes.DTOs.SchemeResponse>.SuccessResult(scheme, "Scheme updated successfully."));
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    [RequirePermission(Permissions.SchemeManage)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteScheme(Guid id)
    {
        var result = await _schemeService.DeleteSchemeAsync(id);
        return Ok(ApiResponse<bool>.SuccessResult(result, "Scheme removed successfully."));
    }
}
