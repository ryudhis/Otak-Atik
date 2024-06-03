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
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Liked from "@svg/SolidLike.svg";
import Disliked from "@svg/SolidDislike.svg";

export interface forumItem {
  id: number;
  title: string;
  content: string;
  ownerId: number;
  postedAt: string;
  kategori: string;
  owner: ownerItem;
  comment: commentItem[];
  like: string[];
  dislike: string[];
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

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

const Forum = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<ownerItem>();
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

  const toggleLike = async (forumId: number) => {
    const data = {
      forumId: forumId,
      username: userData?.username,
    };
    setDiskusi((prevDiskusi) =>
      prevDiskusi.map((item) =>
        item.id === forumId
          ? {
              ...item,
              like: item.like.includes(userData?.username ?? "")
                ? item.like.filter((like) => like !== userData?.username)
                : ([...item.like, userData?.username].filter(
                    Boolean
                  ) as string[]),
              dislike: item.dislike.filter(
                (dislike) => dislike !== userData?.username
              ),
            }
          : item
      )
    );
    try {
      const response = await axiosConfig.patch("api/forumDiskusi/like", data);
      if (response.data.status === 400) {
        alert(response.data.message);
        setDiskusi((prevDiskusi) =>
          prevDiskusi.map((item) =>
            item.id === forumId
              ? {
                  ...item,
                  like: item.like.filter((like) => like !== userData?.username),
                }
              : item
          )
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDislike = async (forumId: number) => {
    const data = {
      forumId: forumId,
      username: userData?.username,
    };
    setDiskusi((prevDiskusi) =>
      prevDiskusi.map((item) =>
        item.id === forumId
          ? {
              ...item,
              dislike: item.dislike.includes(userData?.username ?? "")
                ? item.dislike.filter(
                    (dislike) => dislike !== userData?.username
                  )
                : ([...item.dislike, userData?.username].filter(
                    Boolean
                  ) as string[]),
              like: item.like.filter((like) => like !== userData?.username),
            }
          : item
      )
    );
    try {
      const response = await axiosConfig.patch(
        "api/forumDiskusi/dislike",
        data
      );
      if (response.data.status === 400) {
        alert(response.data.message);
        setDiskusi((prevDiskusi) =>
          prevDiskusi.map((item) =>
            item.id === forumId
              ? {
                  ...item,
                  dislike: item.dislike.filter(
                    (dislike) => dislike !== userData?.username
                  ),
                }
              : item
          )
        );
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

  function postedAt(date?: string) {
    if (!date) {
      return "Unknown";
    }

    const now = new Date();
    const posted = new Date(date);
    const diff = now.getTime() - posted.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffSeconds = Math.floor(diff / 1000);

    if (diffDays > 0) {
      return `${diffDays} days ago`;
    }
    if (diffHours > 0) {
      return `${diffHours} hours ago`;
    }
    if (diffMinutes > 0) {
      return `${diffMinutes} minutes ago`;
    }
    if (diffSeconds > 0) {
      return `${diffSeconds} seconds ago`;
    }
    return "just now";
  }

  useEffect(() => {
    getAllDiskusi();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          const decodedToken = jwtDecode<CustomJwtPayload>(token);
          const userId = decodedToken.id;

          const response = await axiosConfig.get(`/api/account/${userId}`);
          setUserData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
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
        <div className="-mt-32 h-screen flex flex-col items-center justify-center">
          <h1 className="text-center text-secondary font-bold text-2xl animate-pulse">
            Loading diskusi...
          </h1>
        </div>
      ) : (
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
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(item.id);
                      }}
                      alternateStyle="ghost"
                    >
                      <Image src={Liked} alt="" />
                    </Button>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(item.id);
                      }}
                      alternateStyle="ghost"
                    >
                      <Image src={Like} alt="" />
                    </Button>
                  )}
                  {userData &&
                  userData.username &&
                  item.dislike.includes(userData.username) ? (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDislike(item.id);
                      }}
                      alternateStyle="ghost"
                    >
                      <Image src={Disliked} alt="" />
                    </Button>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDislike(item.id);
                      }}
                      alternateStyle="ghost"
                    >
                      <Image src={Dislike} alt="" />
                    </Button>
                  )}
                  <div className="flex items-center gap-2">
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
      )}
    </div>
  );
};

export default Forum;
