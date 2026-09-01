using SELF.Application.Grants.DTOs;

namespace SELF.Application.Grants.Interfaces;

public interface IGrantService
{
    Task<List<GrantResponse>> GetAllGrantsAsync();
}
