namespace SELF.Shared.Constants;

public static class Roles
{
    public const string Admin = "ADMIN";
    public const string Officer = "OFFICER";
    public const string NGO = "NGO";
    public const string User = "USER";
}

public static class Permissions
{
    public const string ImageUpload = "ImageUpload";
    public const string JobPost = "JobPost";
    public const string ProjectUpload = "ProjectUpload";
    public const string SchemeManage = "SchemeManage";
    public const string UserManage = "UserManage";
}

public static class ApplicationConstants
{
    public const string UploadsFolder = "uploads";
    public const string NgoDocumentsFolder = "uploads/ngo-documents";
    public const string ApplicationDocumentsFolder = "uploads/application-documents";
    public const string CandidateDocumentsFolder = "uploads/candidate-documents";
    public const string ResourcesFolder = "uploads/resources";
}
