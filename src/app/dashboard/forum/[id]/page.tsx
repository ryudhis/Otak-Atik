"use client";
import React, { useEffect, useState } from "react";
import Button from "@components/Button";
import axiosConfig from "@utils/axios";
import Image from "next/image";
import Like from "@svg/Like.svg";
import Comments from "@svg/Comments.svg";
import Dislike from "@svg/Dislike.svg";
import { useRouter } from "next/navigation";

export interface forumItem {
  id: number;
  title: string;
  content: string;
  ownerId: number;
  postedAt: string;
  kategori: string;
  owner: ownerItem;
}

export interface ownerItem {
  username: string;
  avatar: string;
}

const DetailForum = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const [diskusi, setDiskusi] = useState<forumItem>();
  const getDiskusi = async () => {
    try {
      const response = await axiosConfig.get(`api/forumDiskusi/${id}`);
      if (response.data.status !== 400) {
        console.log(response.data.data);
        setDiskusi(response.data.data);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDiskusi();
  }, []);

  return (
    <div className="bg-tertiary p-28 h-screen">
      <Button onClick={() => router.back()} alternateStyle="secondary">
        &lt;
      </Button>
      <div className="mt-6 py-4 border-b-2 border-primary flex flex-col gap-8">
        <div className="flex gap-4">
          <img src={diskusi?.owner.avatar} alt="" />
          <h1 className="font-bold">{diskusi?.owner.username}</h1>
          <h1>{diskusi?.postedAt}</h1>
        </div>
        <p className="text-xl font-bold">{diskusi?.title}</p>
        <p className="text-lg">{diskusi?.content}</p>
        <div className="flex gap-6">
          <Button alternateStyle="ghost">
            <Image src={Like} alt="" />
          </Button>
          <Button alternateStyle="ghost">
            <Image src={Dislike} alt="" />
          </Button>
          <Button
            onClick={() => router.push(`/dashboard/forum/${diskusi?.id}`)}
            alternateStyle="ghost"
          >
            <Image src={Comments} alt="" />
          </Button>
        </div>
        <div className="w-full rounded-md border-2 border-primary shadow-md">
          <textarea
            placeholder="Komentar disini..."
            className="w-full p-4 h-32 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
          <div className="flex justify-start items-center gap-3 p-3">
            <Button alternateStyle="secondary">Batal</Button>
            <Button alternateStyle="primary">Komen</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailForum;
