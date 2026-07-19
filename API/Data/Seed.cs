using System.IO;
using System.Security.Cryptography;
using System.Text.Json;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(AppDbContext context)
    {
      if(await context.Users.AnyAsync()) return;  

      var seedFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "UserSeedData.json");
      if (!File.Exists(seedFilePath))
      {
          throw new FileNotFoundException("Seed file not found.", seedFilePath);
      }

      var memberData = await File.ReadAllTextAsync(seedFilePath);
      var jsonOptions = new JsonSerializerOptions
      {
          PropertyNameCaseInsensitive = true,
      };

      var members = JsonSerializer.Deserialize<List<SeedUserDto>>(memberData, jsonOptions);

      if(members is null) return;

      foreach(var member in members)
      {
        using var hmac = new HMACSHA512();

        var user = new AppUser
        {
            Id = member.Id,
            Email = member.Email.ToLower(),
            DisplayName = member.DisplayName,
            ImageUrl = member.ImageUrl,
            PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes("Pa$$w0rd")), 
            PasswordSalt = hmac.Key,
            Member = new Member
            {
                Id = member.Id,
                DisplayName = member.DisplayName,
                Description = member.Description,
                DateOfBirth = member.DateOfBirth,
                ImageUrl = member.ImageUrl,
                Gender = member.Gender,
                City = member.City,
                Country = member.Country,
                Created = member.Created,
                LastActive = member.LastActive,
            }
        };
            user.Member.Photos.Add(new Photo
            {
                Url = member.ImageUrl!,
                MemberId = member.Id,
            });
        context.Users.Add(user);
      }      
        await context.SaveChangesAsync();
    }
}