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
  comments: commentItem[];
}

export interface commentItem {
  id: number;
  content: string;
  ownerId: number;
  postedAt: string;
  owner: ownerItem;
}

export interface ownerItem {
  username: string;
  avatar: string;
}

const Forum = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [diskusi, setDiskusi] = useState<forumItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");

  const kategori = [
    "General",
    "Computer Science",
    "Science",
    "Sport",
    "Marketing",
  ];

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
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDiskusi = diskusi
    .filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) =>
      selectedKategori ? item.kategori === selectedKategori : true
    );

  useEffect(() => {
    getAllDiskusi();
  }, []);

  return (
    <div className="bg-tertiary p-28 h-screen">
      <div className="flex justify-between">
        <div className="flex gap-6 justify-center">
          <h1 className="text-2xl font-bold">Forum Diskusi</h1>
          <Button
            onClick={() => router.push("/dashboard/forum/create")}
            alternateStyle="primary"
          >
            Buat Diskusi
          </Button>
        </div>
        <div className="flex gap-6">
          <select
            value={selectedKategori}
            onChange={(e) => setSelectedKategori(e.target.value)}
            className="bg-primary rounded-xl w-50 px-2 placeholder:font-bold"
          >
            <option value="">Pilih Topik</option>
            {kategori.map((kat) => (
              <option key={kat} value={kat}>
                {kat}
              </option>
            ))}
          </select>
          <input
            className="bg-primary rounded-xl min-w-40 px-6 placeholder:font-bold"
            placeholder="Cari judul diskusi"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="mt-6 py-4 h-full flex flex-col gap-8 items-center justify-center">
          <p className="text-center">Loading diskusi...</p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col">
          {filteredDiskusi.length > 0 ? (
            filteredDiskusi.map((item: forumItem) => (
              <Link key={item.id} href={`/dashboard/forum/${item.id}`}>
                <div className="py-4 border-b-2 border-primary flex flex-col gap-4">
                  <div className="flex gap-4">
                    <img src={item.owner.avatar} alt="" />
                    <h1 className="font-bold">{item.owner.username}</h1>
                    <h1>{item.postedAt}</h1>
                    <div className="border-2 border-secondary p-1.5 rounded-3xl">
                      {item.kategori}
                    </div>
                  </div>
                  <p className="text-lg font-bold">{item.title}</p>
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
            ))
          ) : (
            <p className="mt-20 text-center">
              Tidak ada diskusi pada kategori {selectedKategori}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Forum;
