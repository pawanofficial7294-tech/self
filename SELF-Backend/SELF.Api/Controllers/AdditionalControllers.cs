using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SELF.Api.Filters;
using SELF.Application.Candidates.DTOs;
using SELF.Application.Candidates.Interfaces;
using SELF.Application.Careers.DTOs;
using SELF.Application.Careers.Interfaces;
using SELF.Application.Contact.DTOs;
using SELF.Application.Contact.Interfaces;
using SELF.Application.Dashboard.DTOs;
using SELF.Application.Dashboard.Interfaces;
using SELF.Application.FAQ.DTOs;
using SELF.Application.FAQ.Interfaces;
using SELF.Application.Grants.DTOs;
using SELF.Application.Grants.Interfaces;
using SELF.Application.Resources.DTOs;
using SELF.Application.Resources.Interfaces;
using SELF.Shared.Constants;
using SELF.Shared.DTOs;

namespace SELF.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CareerController(ICareerService careerService) : ControllerBase
{
    private readonly ICareerService _careerService = careerService;

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<JobResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllJobs([FromQuery] string? department, [FromQuery] string? query)
    {
        var jobs = await _careerService.GetAllJobsAsync(department, query);
        return Ok(ApiResponse<List<JobResponse>>.SuccessResult(jobs));
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<JobResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetJobById(Guid id)
    {
        var job = await _careerService.GetJobByIdAsync(id);
        return Ok(ApiResponse<JobResponse>.SuccessResult(job));
    }

    [HttpPost]
    [Authorize]
    [RequirePermission(Permissions.JobPost)]
    [ProducesResponseType(typeof(ApiResponse<JobResponse>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateJob([FromBody] CreateJobRequest request)
    {
        var job = await _careerService.CreateJobAsync(request);
        return CreatedAtAction(nameof(GetJobById), new { id = job.Id }, ApiResponse<JobResponse>.SuccessResult(job, "Job posting created successfully."));
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    [RequirePermission(Permissions.JobPost)]
    [ProducesResponseType(typeof(ApiResponse<JobResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateJob(Guid id, [FromBody] CreateJobRequest request)
    {
        var job = await _careerService.UpdateJobAsync(id, request);
        return Ok(ApiResponse<JobResponse>.SuccessResult(job, "Job posting updated successfully."));
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    [RequirePermission(Permissions.JobPost)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteJob(Guid id)
    {
        var result = await _careerService.DeleteJobAsync(id);
        return Ok(ApiResponse<bool>.SuccessResult(result, "Job posting removed."));
    }
}

[ApiController]
[Route("api/[controller]")]
public class CandidateController(ICandidateService candidateService) : ControllerBase
{
    private readonly ICandidateService _candidateService = candidateService;

    [HttpPost("apply")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(ApiResponse<CandidateResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Apply([FromForm] CandidateApplicationRequest request, IFormFile resume)
    {
        var candidate = await _candidateService.ApplyAsync(request, resume);
        return Ok(ApiResponse<CandidateResponse>.SuccessResult(candidate, $"Application submitted successfully! Your application reference number is: {candidate.RefNumber}"));
    }

    [HttpGet("track/{refNumber}")]
    [ProducesResponseType(typeof(ApiResponse<CandidateResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> TrackCandidate(string refNumber)
    {
        var candidate = await _candidateService.GetByRefNumberAsync(refNumber);
        return Ok(ApiResponse<CandidateResponse>.SuccessResult(candidate));
    }

    [HttpGet]
    [Authorize]
    [RequirePermission(Permissions.JobPost)]
    [ProducesResponseType(typeof(ApiResponse<List<CandidateResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllCandidates()
    {
        var list = await _candidateService.GetAllCandidatesAsync();
        return Ok(ApiResponse<List<CandidateResponse>>.SuccessResult(list));
    }

    [HttpPatch("{id:guid}/status")]
    [Authorize]
    [RequirePermission(Permissions.JobPost)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateCandidateStatus(Guid id, [FromQuery] string status)
    {
        var updated = await _candidateService.UpdateCandidateStatusAsync(id, status);
        return Ok(ApiResponse<bool>.SuccessResult(updated, "Candidate status updated."));
    }
}

[ApiController]
[Route("api/[controller]")]
public class DashboardController(IDashboardService dashboardService) : ControllerBase
{
    private readonly IDashboardService _dashboardService = dashboardService;

    [HttpGet("stats")]
    [ProducesResponseType(typeof(ApiResponse<DashboardStatsResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDashboardStats([FromQuery] string? year, [FromQuery] string? state)
    {
        var stats = await _dashboardService.GetDashboardStatsAsync(year, state);
        return Ok(ApiResponse<DashboardStatsResponse>.SuccessResult(stats));
    }
}

[ApiController]
[Route("api/[controller]")]
public class ContactController(IContactService contactService) : ControllerBase
{
    private readonly IContactService _contactService = contactService;

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ContactMessageResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> SubmitMessage([FromBody] ContactRequest request)
    {
        var msg = await _contactService.SubmitMessageAsync(request);
        return Ok(ApiResponse<ContactMessageResponse>.SuccessResult(msg, "Message received. Our team will contact you shortly."));
    }

    [HttpGet]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(ApiResponse<List<ContactMessageResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllMessages()
    {
        var list = await _contactService.GetAllMessagesAsync();
        return Ok(ApiResponse<List<ContactMessageResponse>>.SuccessResult(list));
    }

    [HttpPatch("{id:guid}/resolve")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ResolveMessage(Guid id, [FromQuery] string? notes)
    {
        var result = await _contactService.ResolveMessageAsync(id, notes);
        return Ok(ApiResponse<bool>.SuccessResult(result, "Inquiry marked as resolved."));
    }
}

[ApiController]
[Route("api/[controller]")]
public class ResourceController(IResourceService resourceService) : ControllerBase
{
    private readonly IResourceService _resourceService = resourceService;

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<ResourceResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllResources([FromQuery] string? type)
    {
        var list = await _resourceService.GetAllResourcesAsync(type);
        return Ok(ApiResponse<List<ResourceResponse>>.SuccessResult(list));
    }

    [HttpPost]
    [Authorize]
    [RequirePermission(Permissions.ImageUpload)]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(ApiResponse<ResourceResponse>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateResource([FromForm] CreateResourceRequest request, IFormFile file)
    {
        var res = await _resourceService.CreateResourceAsync(request, file);
        return Ok(ApiResponse<ResourceResponse>.SuccessResult(res, "Resource uploaded successfully."));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteResource(Guid id)
    {
        var result = await _resourceService.DeleteResourceAsync(id);
        return Ok(ApiResponse<bool>.SuccessResult(result, "Resource deleted."));
    }
}

[ApiController]
[Route("api/[controller]")]
public class FAQController(IFAQService faqService) : ControllerBase
{
    private readonly IFAQService _faqService = faqService;

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<FAQResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllFAQs([FromQuery] string? category)
    {
        var list = await _faqService.GetAllFAQsAsync(category);
        return Ok(ApiResponse<List<FAQResponse>>.SuccessResult(list));
    }

    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(ApiResponse<FAQResponse>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateFAQ([FromBody] CreateFAQRequest request)
    {
        var faq = await _faqService.CreateFAQAsync(request);
        return Ok(ApiResponse<FAQResponse>.SuccessResult(faq, "FAQ created successfully."));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteFAQ(Guid id)
    {
        var result = await _faqService.DeleteFAQAsync(id);
        return Ok(ApiResponse<bool>.SuccessResult(result, "FAQ deleted."));
    }
}

[ApiController]
[Route("api/[controller]")]
public class GrantController(IGrantService grantService) : ControllerBase
{
    private readonly IGrantService _grantService = grantService;

    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<List<GrantResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllGrants()
    {
        var list = await _grantService.GetAllGrantsAsync();
        return Ok(ApiResponse<List<GrantResponse>>.SuccessResult(list));
    }
}
