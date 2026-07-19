using API.Entities;
using API.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(IMemberRepositry memberRepositry) : BaseApiController
    {
        [HttpGet] //localhost:5194/api/Members
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
        {
            return Ok(await memberRepositry.GetMembersAsync());
        }

        [HttpGet("{id}")]  //localhost:5194/api/Members/bob-id
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            var member = await memberRepositry.GetMemberByIdAsync(id);
            if (member == null) return NotFound();
            return member;
        }

        [HttpGet("{id}/photos")] //localhost:5194/api/Members/bob-id/photos
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetPhotos(string id)
        {
            return Ok(await memberRepositry.GetPhotosByMemberIdAsync(id));
        }
    }
}
