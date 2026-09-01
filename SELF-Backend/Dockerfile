# Stage 1: Build & Publish
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

# Copy solution and project files for caching restore layer
COPY ["SELF.sln", "./"]
COPY ["SELF.Api/SELF.Api.csproj", "SELF.Api/"]
COPY ["SELF.Application/SELF.Application.csproj", "SELF.Application/"]
COPY ["SELF.Domain/SELF.Domain.csproj", "SELF.Domain/"]
COPY ["SELF.Infrastructure/SELF.Infrastructure.csproj", "SELF.Infrastructure/"]
COPY ["SELF.Shared/SELF.Shared.csproj", "SELF.Shared/"]

# Restore dependencies
RUN dotnet restore "SELF.sln"

# Copy remaining source code
COPY . .

# Publish API
WORKDIR "/src/SELF.Api"
RUN dotnet publish "SELF.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime Environment
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS final
WORKDIR /app
COPY --from=build /app/publish .

# Create uploads directory for documents & media
RUN mkdir -p /app/uploads

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "SELF.Api.dll"]
