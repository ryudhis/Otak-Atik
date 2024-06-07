/* eslint-disable @next/next/no-img-element */
import React from "react";
import { commentItem } from "@/app/dashboard/forum/page";

interface CommentItemProps {
  comments: commentItem[];
  postedAt: (date: string) => string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comments,
  postedAt,
}) => {
  return (
    <div className='mt-6 flex flex-col gap-6'>
      {comments?.map((item) => (
        <div key={item.id} className='flex gap-4'>
          <img className='w-8 h-8' src={item.owner.avatar} alt='' />
          <div className='flex flex-col gap-4'>
            <div className='flex gap-4'>
              <h1 className='font-bold'>{item.owner.username}</h1>
              <h1>{postedAt(item.postedAt)}</h1>
            </div>
            <p>{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentItem;
