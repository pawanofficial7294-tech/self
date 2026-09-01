# SELF-Backend: Clean Architecture Web API

Enterprise-grade ASP.NET Core Web API backend for the **Socio Economic Lacuna Foundation (SELF)** portal, built with `.NET 10.0`, Entity Framework Core, JWT Authentication, Swagger OpenAPI, and Granular Permission Access Control.

---

## 1. Solution Architecture

```
SELF-Backend/
├── SELF.Api/              # Presentation layer: Controllers, Middleware, Filters, Swagger, Program.cs
├── SELF.Application/      # Business logic: DTOs, Service Interfaces & Implementations
├── SELF.Domain/           # Enterprise domain: Entities, Enums, BaseEntity, AuditableEntity
├── SELF.Infrastructure/   # Data access: ApplicationDbContext, EF Configurations, Seeders, Repositories, JWT & BCrypt services
├── SELF.Shared/           # Shared models: ApiResponse<T>, PaginatedResponse<T>, Exceptions, Constants
├── uploads/               # Physical storage for uploaded documents and images
│   ├── ngo-documents/
│   ├── application-documents/
│   ├── candidate-documents/
│   └── resources/
├── .gitignore
├── README.md
├── SELF.sln
└── SELF.slnx
```

---

## 2. Quick Start

### Run the Web API:
```bash
cd SELF-Backend/SELF.Api
dotnet run
```

The application will:
1. Automatically create the SQLite database (`self_portal.db`) on first launch.
2. Execute initial database seeders (`DbSeeder.cs`) with default Admin, demo NGO, Officer accounts, schemes, and FAQs.
3. Launch Swagger UI at:
   - **Swagger UI**: `http://localhost:5000/swagger` or `https://localhost:5001/swagger` (or the console output port).

---

## 3. Seeded Accounts & Credentials

| Role | Username | Email | Password | Default Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin@self.org.in` | `Admin@12345` | All permissions (`CanUploadImages`, `CanPostJobs`, `CanSubmitProjects`, `CanManageSchemes`, `CanManageUsers`) |
| **NGO** | `gvp_ngo` | `gvp.ngo@example.org` | `Ngo@12345` | `CanUploadImages`, `CanSubmitProjects` |
| **Officer** | `officer_ranchi` | `state.officer@nic.in` | `Officer@12345` | `CanUploadImages`, `CanPostJobs`, `CanManageSchemes` |

---

## 4. Granular Permissions & Admin Access Management

Admins can dynamically grant or revoke specific feature permissions for any user in real time:

- `CanUploadImages`: Enables/disables image and document uploads across NGO verification, candidate resumes, and resources.
- `CanPostJobs`: Enables/disables creating and modifying job vacancies.
- `CanSubmitProjects`: Enables/disables submitting grant project proposals and budget calculations.
- `CanManageSchemes`: Enables/disables adding or updating government/CSR schemes.
- `CanManageUsers`: Controls user administration.

### Admin Permission Endpoints:
- `GET /api/admin/users`: List all registered users with their current permission flags.
- `POST /api/admin/users`: Admin creates a user with customized role & permissions.
- `PATCH /api/admin/users/{id}/permissions`: Dynamically toggle any permission on/off:
  ```json
  {
    "canUploadImages": false,
    "canPostJobs": true,
    "canSubmitProjects": false
  }
  ```
- `DELETE /api/admin/users/{id}`: Soft delete user and deactivate access.

---

## 5. API Controller Summary

| Controller | Route | Description |
| :--- | :--- | :--- |
| **AuthController** | `/api/auth` | Login, Register, Forgot Password, Reset Password with JWT response |
| **AdminController** | `/api/admin` | User management (create, delete, list) and granular permission updates |
| **NGOController** | `/api/ngo` | NGO profiles, Darpan verification, and statutory document uploads |
| **ApplicationController** | `/api/application` | Grant proposal submission with multi-item budget calculator & tracking |
| **TrackingController** | `/api/tracking` | Real-time stage milestone tracking by Application ID (e.g. `NGO-2026-00124`) |
| **SchemeController** | `/api/scheme` | Browse grant schemes by sector/category, create & update schemes |
| **CareerController** | `/api/career` | Job openings list, search, filter, and vacancy management |
| **CandidateController** | `/api/candidate` | Candidate job application with CV/resume upload and application ref tracking |
| **DashboardController** | `/api/dashboard` | Aggregated analytics, monthly trends, and sector/state distributions for Recharts |
| **ContactController** | `/api/contact` | Contact messages and grievance redressal handling |
| **ResourceController** | `/api/resource` | Downloadable annual reports, audited statements (80G/12A), manuals |
| **FAQController** | `/api/faq` | Frequently asked questions by topic |
| **GrantController** | `/api/grant` | Grant disbursements and PFMS sanction orders |

---

## 6. Testing with Swagger

1. Navigate to `/swagger`.
2. Click `POST /api/auth/login` and authenticate with `admin` / `Admin@12345`.
3. Copy the returned `token` from the response.
4. Click the **Authorize** button at the top right of Swagger, enter `Bearer {token}`, and click **Authorize**.
5. All protected endpoints and permission-governed operations are now authenticated.
