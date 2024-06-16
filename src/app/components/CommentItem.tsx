/* eslint-disable @next/next/no-img-element */
import React from "react";
import { commentItem } from "@/app/dashboard/forum/page";
import { useRouter } from "next/navigation";
import Image from "next/image";
import deleteIcon from "@svg/delete.svg";

interface CommentItemProps {
  comments: commentItem[];
  postedAt: (date: string) => string;
  deleteComment: Function;
  userDataId: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comments,
  postedAt,
  deleteComment,
  userDataId,
}) => {
  const router = useRouter();

  return (
    <div className='mt-6 flex flex-col gap-3'>
      {comments?.map((item) => (
        <div
          key={item.id}
          className='flex gap-4 border-b-2 border-primary pb-3'
        >
          <img
            className='w-8 h-8 cursor-pointer'
            src={item.owner.avatar}
            alt={`Avatar of ${item.owner.username}`}
            onClick={() => router.push(`/dashboard/profile/${item.ownerId}`)}
          />
          <div className='flex flex-col gap-4 w-full'>
            <div className='flex justify-between'>
              <div className='flex gap-4'>
                <h1 className='font-bold'>{item.owner.username}</h1>
                <h1>{postedAt(item.postedAt)}</h1>
              </div>
              {userDataId === item.ownerId && (
                <Image
                  onClick={() => deleteComment(item.id)}
                  className='cursor-pointer hover:scale-110 transition ease-in-out'
                  src={deleteIcon}
                  alt='Delete'
                  width={20}
                  height={20}
                />
              )}
            </div>
            <p>{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentItem;
