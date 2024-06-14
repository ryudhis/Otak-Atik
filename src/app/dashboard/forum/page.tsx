"use client";
import React, { useState, useEffect } from "react";
import Button from "@components/Button";
import Image from "next/image";
import axiosConfig from "@utils/axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Logo from "@img/logo.png";
import ForumItem from "@/app/components/ForumItem";

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

export interface CustomJwtPayload extends JwtPayload {
  id: string;
}

const Forum = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<ownerItem>({} as ownerItem);
  const [isLoading, setIsLoading] = useState(true);
  const [diskusi, setDiskusi] = useState<forumItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");

  const kategori = [
    "General",
    "Computer Science",
    "Science",
    "Sport",
    "Design",
    "Business",
    "Music",
    "Video",
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
    )
    .reverse();

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
    <div className="bg-tertiary p-28 h-screen overflow-auto">
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
        <div className="-mt-32 h-screen flex flex-col justify-center items-center w-full gap-4">
          <Image className="scale-110" src={Logo} alt="Logo" />
          <h1 className="text-center text-secondary font-bold text-2xl animate-pulse">
            Loading diskusi...
          </h1>
        </div>
      ) : (
        <ForumItem
          filteredDiskusi={filteredDiskusi}
          selectedKategori={selectedKategori}
          userData={userData}
          toggleLike={toggleLike}
          toggleDislike={toggleDislike}
          postedAt={postedAt}
        />
      )}
    </div>
  );
};

export default Forum;
