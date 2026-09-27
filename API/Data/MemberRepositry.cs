using System;
using API.Entities;
using API.Interface;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MemberRepositry(AppDbContext _context) : IMemberRepositry
{
    public async Task<Member?> GetMemberByIdAsync(string id)
    {
        return await _context.Members.FindAsync(id);
    }

    public async Task<Member?> GetMemberForUpdate(string id)
    {
        return await _context.Members
            .Include(x => x.User)
            .SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<IReadOnlyList<Member>> GetMembersAsync()
    {
        return await _context.Members.ToListAsync();
    }

    public async Task<IReadOnlyList<Photo>> GetPhotosByMemberIdAsync(string memberId)
    {
        return await _context.Photos
            .Where(p => p.MemberId == memberId)
            .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }

    public void update(AppUser user)
    {
        _context.Entry(user).State = EntityState.Modified;
    }

    public void Update(Member member)
    {
        _context.Entry(member).State = EntityState.Modified;
    }
}