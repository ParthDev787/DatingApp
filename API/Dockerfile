# ==========================================
# ASP.NET Core 9 Web API - Production Dockerfile
# ==========================================

# 1. Build Stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY ["API.csproj", "./"]
RUN dotnet restore "API.csproj"

# Copy remaining source code and publish
COPY . .
RUN dotnet publish "API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 2. Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Development

EXPOSE 8080

# Copy published artifacts from build stage
COPY --from=build /app/publish .

# Create directory for SQLite database storage
RUN mkdir -p /app/data

ENTRYPOINT ["dotnet", "API.dll"]
