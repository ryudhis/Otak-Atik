/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import Button from "@components/Button";
import axiosConfig from "@utils/axios";
import Image from "next/image";
import Like from "@svg/like.svg";
import Liked from "@svg/solidLike.svg";
import Disliked from "@svg/solidDislike.svg";
import Comments from "@svg/comments.svg";
import Dislike from "@svg/dislike.svg";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";
import Logo from "@img/logo.png";
import CommentItem from "@/app/components/CommentItem";
import deleteIcon from "@svg/delete.svg";

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
  id: number;
  username: string;
  avatar: string;
}

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export interface userData {
  id: number;
  username: string;
}

const formSchema = z.object({
  content: z.string().min(1).max(255),
});

const DetailForum = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [diskusi, setDiskusi] = useState<forumItem | undefined>(undefined);
  const [userData, setUserData] = useState<userData | undefined>(undefined);
  const [commentBoxVisible, setCommentBoxVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const postComment = async (values: any) => {
    const date = new Date();
    const isoDateString = date.toISOString();

    const data = {
      forumDiskusiId: parseInt(id),
      ownerId: userData?.id,
      content: values.content,
      postedAt: isoDateString,
    };
    try {
      const response = await axiosConfig.post("api/commentForum", data);
      if (response.data.status !== 400) {
        toast.success("Berhasil Komentar");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Gagal Komentar");
    } finally {
      setRefresh(!refresh);
      reset();
    }
  };

  const toggleCommentBox = () => {
    setCommentBoxVisible((prev) => !prev);
  };

  const getDiskusi = async () => {
    try {
      const response = await axiosConfig.get(`api/forumDiskusi/${id}`);
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

  const deleteDiskusi = async () => {
    try {
      const response = await axiosConfig.delete(`api/forumDiskusi/${id}`);
      if (response.data.status !== 400) {
        toast.success("Berhasil Hapus Diskusi");
        router.push("/dashboard/forum/");
      } else {
        toast.success("Gagal Hapus Diskusi");
      }
    } catch (error) {
      toast.error("Gagal Hapus Diskusi");
    }
  };

  const toggleLike = async () => {
    const data = {
      forumId: parseInt(id),
      username: userData?.username,
    };
    setDiskusi((prevDiskusi) => {
      if (prevDiskusi) {
        return {
          ...prevDiskusi,
          like: prevDiskusi.like.includes(userData?.username ?? "")
            ? prevDiskusi.like.filter((like) => like !== userData?.username)
            : ([...prevDiskusi.like, userData?.username].filter(
                Boolean
              ) as string[]),
          dislike: prevDiskusi.dislike.filter(
            (dislike) => dislike !== userData?.username
          ),
        };
      }
      return prevDiskusi; // Add this return statement
    });
    try {
      const response = await axiosConfig.patch("api/forumDiskusi/like", data);
      if (response.data.status === 400) {
        alert(response.data.message);
        setDiskusi((prevDiskusi) => {
          if (prevDiskusi) {
            return {
              ...prevDiskusi,
              like: prevDiskusi.like.includes(userData?.username ?? "")
                ? prevDiskusi.like.filter((like) => like !== userData?.username)
                : ([...prevDiskusi.like, userData?.username].filter(
                    Boolean
                  ) as string[]),
              dislike: prevDiskusi.dislike.filter(
                (dislike) => dislike !== userData?.username
              ),
            };
          }
          return prevDiskusi;
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDislike = async () => {
    const data = {
      forumId: parseInt(id),
      username: userData?.username,
    };
    setDiskusi((prevDiskusi) => {
      if (prevDiskusi) {
        return {
          ...prevDiskusi,
          dislike: prevDiskusi.dislike.includes(userData?.username ?? "")
            ? prevDiskusi.dislike.filter(
                (dislike) => dislike !== userData?.username
              )
            : ([...prevDiskusi.dislike, userData?.username].filter(
                Boolean
              ) as string[]),
          like: prevDiskusi.like.filter((like) => like !== userData?.username),
        };
      }
      return prevDiskusi;
    });
    try {
      const response = await axiosConfig.patch(
        "api/forumDiskusi/dislike",
        data
      );
      if (response.data.status === 400) {
        alert(response.data.message);
        setDiskusi((prevDiskusi) => {
          if (prevDiskusi) {
            return {
              ...prevDiskusi,
              dislike: prevDiskusi.dislike.includes(userData?.username ?? "")
                ? prevDiskusi.dislike.filter(
                    (dislike) => dislike !== userData?.username
                  )
                : ([...prevDiskusi.dislike, userData?.username].filter(
                    Boolean
                  ) as string[]),
              like: prevDiskusi.like.filter(
                (like) => like !== userData?.username
              ),
            };
          }
          return prevDiskusi;
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

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
    getDiskusi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

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
    <div className='bg-tertiary p-28 h-screen overflow-auto'>
      <Button onClick={() => router.back()} alternateStyle='secondary'>
        &lt;
      </Button>
      {isLoading ? (
        <div className='-mt-52 h-screen flex flex-col justify-center items-center w-full gap-4'>
          <Image className='scale-110' src={Logo} alt='Logo' />
          <h1 className='text-center text-secondary font-bold text-2xl animate-pulse'>
            Loading konten...
          </h1>
        </div>
      ) : (
        <div className='mt-6 py-4 flex flex-col gap-8'>
          {diskusi && (
            <>
              <div className='border-b-2 border-primary flex flex-col gap-8'>
                <div className='flex justify-between'>
                  <div className='flex items-center gap-4'>
                    <div
                      onClick={() =>
                        router.push(`/dashboard/profile/${diskusi.owner.id}`)
                      }
                      className='flex items-center gap-4 cursor-pointer hover:opacity-80'
                    >
                      <img src={diskusi.owner.avatar} alt='' />
                      <h1 className='font-bold'>{diskusi.owner.username}</h1>
                    </div>

                    <h1>{postedAt(diskusi.postedAt)}</h1>
                  </div>
                  {userData?.id === diskusi?.owner.id && (
                    <Button onClick={() => deleteDiskusi()}>
                      <Image src={deleteIcon} alt='' />
                    </Button>
                  )}
                </div>
                <p className='text-xl font-bold'>{diskusi.title}</p>
                <p className='text-lg'>{diskusi.content}</p>
                <div className='flex gap-6'>
                  {userData &&
                  userData.username &&
                  diskusi.like.includes(userData.username) ? (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike();
                      }}
                      alternateStyle='ghost'
                    >
                      <Image src={Liked} alt='' />
                    </Button>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike();
                      }}
                      alternateStyle='ghost'
                    >
                      <Image src={Like} alt='' />
                    </Button>
                  )}
                  {userData &&
                  userData.username &&
                  diskusi.dislike.includes(userData.username) ? (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDislike();
                      }}
                      alternateStyle='ghost'
                    >
                      <Image src={Disliked} alt='' />
                    </Button>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDislike();
                      }}
                      alternateStyle='ghost'
                    >
                      <Image src={Dislike} alt='' />
                    </Button>
                  )}
                  <Button
                    onClick={() => toggleCommentBox()}
                    alternateStyle='ghost'
                  >
                    <Image src={Comments} alt='' />
                  </Button>
                </div>
              </div>
              <div
                className={
                  commentBoxVisible
                    ? `w-full rounded-md border-2 border-primary shadow-md`
                    : `hidden`
                }
              >
                <form onSubmit={handleSubmit(postComment)}>
                  <textarea
                    placeholder='Komentar disini...'
                    {...register("content", { required: true })}
                    className={`w-full p-4 h-32 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.content ? "border-red-500" : ""
                    }`}
                  />
                  {errors.content && (
                    <span className='text-red-600 text-sm'>
                      This field is required
                    </span>
                  )}
                  <div className='flex justify-start items-center gap-3 p-3'>
                    <Button
                      onClick={() => toggleCommentBox()}
                      alternateStyle='secondary'
                    >
                      Batal
                    </Button>
                    <Button type='submit' alternateStyle='primary'>
                      Komen
                    </Button>
                  </div>
                </form>
              </div>
              <div>
                <h1 className='text-2xl font-bold'>
                  Komentar({diskusi.comment ? diskusi.comment.length : 0})
                </h1>
                <CommentItem comments={diskusi.comment} postedAt={postedAt} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailForum;
