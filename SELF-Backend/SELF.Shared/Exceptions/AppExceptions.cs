namespace SELF.Shared.Exceptions;

public class NotFoundException(string message) : Exception(message);

public class BadRequestException(string message) : Exception(message);

public class UnauthorizedException(string message = "Unauthorized access.") : Exception(message);

public class ForbiddenException(string message = "You do not have permission to perform this action.") : Exception(message);
