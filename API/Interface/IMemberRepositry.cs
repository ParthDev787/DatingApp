using System;
using API.Entities;
namespace API.Interface;

public interface IMemberRepositry
{
    void update(AppUser user);
    void Update(Member member);
    Task<bool> SaveAllAsync();
    Task<IReadOnlyList<Member>> GetMembersAsync();
    Task<Member?> GetMemberByIdAsync(string id);
    Task<IReadOnlyList<Photo>> GetPhotosByMemberIdAsync(string memberId);
    Task<Member?> GetMemberForUpdate(string id);
}