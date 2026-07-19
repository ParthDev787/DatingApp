using System;
using API.Entities;
namespace API.Interface;

public interface IMemberRepositry
{
    void update(AppUser user);
    Task<bool> SaveAllAsync();
    Task<IReadOnlyList<Member>> GetMembersAsync();
    Task<Member?> GetMemberByIdAsync(string id);
    Task<IReadOnlyList<Photo>> GetPhotosByMemberIdAsync(string memberId);

}