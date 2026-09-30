using System;

namespace API.Interface;

public interface IUnitOfWork
{
    IMemberRepositry MemberRepository { get; }
    IMessageRepository MessageRepository { get; }
    ILikesRepository LikesRepository { get; }
    IPhotoRepository PhotoRepository { get; }
    Task<bool> Complete();
    bool HasChanges();
}
