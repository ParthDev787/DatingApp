using System;
using API.Interface;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class UnitOfWork(AppDbContext context) : IUnitOfWork
{
    private IMemberRepositry? _memberRepository;
    private IMessageRepository? _messageRepository;
    private ILikesRepository? _likesRepository;
    private IPhotoRepository? _photoRepository;

    public IMemberRepositry MemberRepository => _memberRepository
        ??= new MemberRepositry(context);

    public IMessageRepository MessageRepository => _messageRepository
        ??= new MessageRepository(context);

    public ILikesRepository LikesRepository => _likesRepository
        ??= new LikesRepository(context);

    public IPhotoRepository PhotoRepository => _photoRepository
        ??= new PhotoRepository(context);

    public async Task<bool> Complete()
    {
        try
        {
            return await context.SaveChangesAsync() > 0;
        }
        catch (DbUpdateException ex)
        {
            throw new Exception("An error occurred while saving changes", ex);
        }
    }

    public bool HasChanges()
    {
        return context.ChangeTracker.HasChanges();
    }
}
