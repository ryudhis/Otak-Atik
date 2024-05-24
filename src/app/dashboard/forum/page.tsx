"use client";
import React, { useState, useEffect } from "react";
import Button from "@components/Button";
import Image from "next/image";
import Like from "@svg/Like.svg";
import Comments from "@svg/Comments.svg";
import Dislike from "@svg/Dislike.svg";
import axiosConfig from "@utils/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

const Forum = () => {
  const router = useRouter();
  const [diskusi, setDiskusi] = useState<forumItem[]>([]);
  const getAllDiskusi = async () => {
    try {
      const response = await axiosConfig.get("api/forumDiskusi");
      if (response.data.status !== 400) {
        setDiskusi(response.data.data);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllDiskusi();
  }, []);

  return (
    <div className="bg-tertiary p-28 h-screen">
      <div className="flex justify-between">
        <div className="flex gap-6 justify-center">
          <h1 className="text-2xl font-bold">Forum Diskusi</h1>
          <Button alternateStyle="primary">Buat Diskusi</Button>
        </div>
        <div className="flex gap-6">
          <Button alternateStyle="secondary">Pilih Topik</Button>
          <input
            className="bg-primary rounded-xl min-w-40 px-6 placeholder:font-bold"
            placeholder="Cari judul diskusi"
            type="text"
          />
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        {diskusi.map((item: forumItem) => (
          <Link key={item.id} href={`/dashboard/forum/${item.id}`}>
            <div className="py-4 border-b-2 border-primary">
              <div className="flex gap-4">
                <img src={item.owner.avatar} alt="" />
                <h1 className="font-bold">{item.owner.username}</h1>
                <h1>{item.postedAt}</h1>
              </div>
              <p className="text-lg">{item.title}</p>
              <div className="flex gap-6">
                <Button alternateStyle="ghost">
                  <Image src={Like} alt="" />
                </Button>
                <Button alternateStyle="ghost">
                  <Image src={Dislike} alt="" />
                </Button>
                <Button
                  onClick={() => router.push(`/dashboard/forum/${item.id}`)}
                  alternateStyle="ghost"
                >
                  <Image src={Comments} alt="" />
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Forum;
