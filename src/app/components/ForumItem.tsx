/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@components/Button";
import Like from "@svg/Like.svg";
import Comments from "@svg/Comments.svg";
import Dislike from "@svg/Dislike.svg";
import Liked from "@svg/SolidLike.svg";
import Disliked from "@svg/SolidDislike.svg";
import { forumItem } from "@/app/dashboard/forum/page";
import { ownerItem } from "@/app/dashboard/forum/page";
import { useRouter } from "next/navigation";

interface ForumItemProps {
  filteredDiskusi: forumItem[];
  selectedKategori: string;
  userData: ownerItem;
  toggleLike: (id: number) => void;
  toggleDislike: (id: number) => void;
  postedAt: (date: string) => string;
}

const ForumItem: React.FC<ForumItemProps> = ({
  filteredDiskusi,
  selectedKategori,
  userData,
  toggleLike,
  toggleDislike,
  postedAt,
}) => {
  const router = useRouter();
  return (
    <div className="mt-8 flex flex-col">
      {filteredDiskusi.length > 0 ? (
        filteredDiskusi.map((item: forumItem) => (
          <div
            key={item.id}
            className="py-4 border-b-2 border-primary flex flex-col gap-4"
          >
            <div className="flex gap-4">
              <div className="basis-full flex gap-4">
                <img className="w-8 h-8" src={item.owner.avatar} alt="" />
                <h1 className="font-bold">{item.owner.username}</h1>
                <h1>{postedAt(item.postedAt)}</h1>
              </div>
              <div className="basis-44 border-2 text-center border-secondary p-1.5 rounded-3xl">
                {item.kategori}
              </div>
            </div>
            <Link href={`/dashboard/forum/${item.id}`}>
              <p className="text-lg font-bold">{item.title}</p>
            </Link>
            <div className="flex items-center gap-6">
              {userData &&
              userData.username &&
              item.like.includes(userData.username) ? (
                <div className="flex items-center gap-1">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(item.id);
                    }}
                    alternateStyle="ghost"
                  >
                    <Image src={Liked} alt="" />
                  </Button>
                  <p className="font-semibold">{item.like.length}</p>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(item.id);
                    }}
                    alternateStyle="ghost"
                  >
                    <Image src={Like} alt="" />
                  </Button>
                  <p className="font-semibold">{item.like.length}</p>
                </div>
              )}
              {userData &&
              userData.username &&
              item.dislike.includes(userData.username) ? (
                <div className="flex items-center gap-1">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDislike(item.id);
                    }}
                    alternateStyle="ghost"
                  >
                    <Image src={Disliked} alt="" />
                  </Button>
                  <p className="font-semibold">{item.dislike.length}</p>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDislike(item.id);
                    }}
                    alternateStyle="ghost"
                  >
                    <Image src={Dislike} alt="" />
                  </Button>
                  <p className="font-semibold">{item.dislike.length}</p>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/dashboard/forum/${item.id}`);
                  }}
                  alternateStyle="ghost"
                >
                  <Image src={Comments} alt="" />
                </Button>
                <p className="font-semibold">
                  {item.comment ? item.comment.length : 0}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="mt-20 text-center">
          Tidak ada diskusi pada kategori {selectedKategori}
        </p>
      )}
    </div>
  );
};

export default ForumItem;
