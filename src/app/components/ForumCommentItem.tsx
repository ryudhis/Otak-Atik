import React from "react";
import { forumItem } from "@/app/dashboard/forum/page";

const ForumCommentItem: React.FC<{ diskusi: forumItem }> = ({ diskusi }) => {
  return (
    <div className="mt-6 flex flex-col gap-6">
      {diskusi?.comment.map((item) => (
        <div key={item.id} className="flex gap-4">
          <img className="w-8 h-8" src={item.owner.avatar} alt="" />
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <h1 className="font-bold">{item.owner.username}</h1>
              <h1>{item.postedAt}</h1>
            </div>
            <p>{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForumCommentItem;
