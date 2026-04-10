using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class MembersController(AppDbContext context) : BaseApiController
    {
        [HttpGet] //localhost:5194/api/Members
        public async Task<ActionResult<IReadOnlyList<AppUser>>> GetMembers()
        {
            var member = await context.Users.ToListAsync();
            return member;
        }

        [HttpGet("{id}")]  //localhost:5194/api/Members/bob-id
        public async Task<ActionResult<AppUser>> GetMember(string id)
        {
            var member = await context.Users.FindAsync(id);
            if (member == null) return NotFound();
            return member;
        }
    }
}
