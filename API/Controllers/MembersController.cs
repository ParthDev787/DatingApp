using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(IUnitOfWork uow, IPhotoService photoService) : BaseApiController
    {
        [HttpGet] //localhost:5194/api/Members
        public async Task<ActionResult<PaginatedResult<Member>>> GetMembers([FromQuery] MemberParams memberParams)
        {
            memberParams.CurrentMemberId = User.GetMemberId();
            return Ok(await uow.MemberRepository.GetMembersAsync(memberParams));
        }

        [HttpGet("{id}")]  //localhost:5194/api/Members/bob-id
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            var member = await uow.MemberRepository.GetMemberByIdAsync(id);
            if (member == null) return NotFound();
            return member;
        }

        [HttpGet("{id}/photos")] //localhost:5194/api/Members/bob-id/photos
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetPhotos(string id)
        {
            var isCurrentUser = User.GetMemberId() == id;
            return Ok(await uow.MemberRepository.GetPhotosByMemberIdAsync(id, isCurrentUser));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            var memberId = User.GetMemberId();

            var member = await uow.MemberRepository.GetMemberForUpdate(memberId);

            if (member == null) return BadRequest("Could not get member");

            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.City = memberUpdateDto.City ?? member.City;
            member.Country = memberUpdateDto.Country ?? member.Country;

            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;

            uow.MemberRepository.Update(member); // optional

            if (await uow.Complete()) return NoContent();

            return BadRequest("Failed to update member");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)
        {
            var member = await uow.MemberRepository.GetMemberForUpdate(User.GetMemberId());

            if (member == null) return BadRequest("Cannot update member");

            if (file == null || file.Length == 0) return BadRequest("No file provided");

            var result = await photoService.UploadPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            if (result.SecureUrl == null) return BadRequest("Problem uploading photo to Cloudinary");

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                MemberId = User.GetMemberId()
            };

            member.Photos.Add(photo);

            if (await uow.Complete()) return Ok(photo);

            return BadRequest("Problem adding photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var member = await uow.MemberRepository.GetMemberForUpdate(User.GetMemberId());

            if (member == null) return BadRequest("Cannot get member from token");

            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);

            if (member.ImageUrl == photo?.Url || photo == null)
            {
                return BadRequest("Cannot set this as main image");
            }

            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;

            if (await uow.Complete()) return NoContent();

            return BadRequest("Problem setting main photo");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var member = await uow.MemberRepository.GetMemberForUpdate(User.GetMemberId());

            if (member == null) return BadRequest("Cannot get member from token");

            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);

            if (photo == null || photo.Url == member.ImageUrl)
            {
                return BadRequest("This photo cannot be deleted");
            }

            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            member.Photos.Remove(photo);

            if (await uow.Complete()) return Ok();

            return BadRequest("Problem deleting the photo");
        }
    }
}
