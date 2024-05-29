"use client";
import React, { useEffect, useState } from "react";
import Button from "@components/Button";
import axiosConfig from "@utils/axios";
import Image from "next/image";
import Star from "@svg/star.svg";
import Comments from "@svg/Comments.svg";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";

export interface kelasItem {
  id: number;
  nama: string;
  kategori: string;
  materi: string[];
  postedAt: string;
  spesifikasi: string[];
  metode: string[];
  jadwal: string;
  durasi: string;
  harga: number;
  owner: ownerItem;
  comment: commentItem[];
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

export interface userData {
  id: number;
  username: string;
}

const formSchema = z.object({
  content: z.string().min(1).max(255),
});

const DetailKelas = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [kelas, setKelas] = useState<kelasItem>();
  const [userData, setUserData] = useState<userData>();
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
    const data = {
      forumDiskusiId: parseInt(id),
      ownerId: userData?.id,
      content: values.content,
      postedAt: "Barusan",
    };
    try {
      const response = await axiosConfig.post("api/commentKelas", data);
      if (response.data.status !== 400) {
        toast.success("Berhasil Komentar");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      toast.error("Gagal Komentar");
    } finally {
      setRefresh(!refresh);
      reset();
    }
  };

  const toggleCommentBox = () => {
    setCommentBoxVisible((prev) => !prev);
  };

  const getKelas = async () => {
    try {
      const response = await axiosConfig.get(`api/kelas/${id}`);
      if (response.data.status !== 400) {
        setKelas(response.data.data);
        console.log(response.data.data);
      } else {
        alert(response.data.message);
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
    getKelas();
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
    <div className='bg-tertiary p-28 h-full'>
      <Button onClick={() => router.back()} alternateStyle='secondary'>
        &lt;
      </Button>
      {isLoading ? (
        <div className='mt-64 h-full'>
          <h1 className='text-center text-secondary font-bold text-2xl animate-pulse'>
            Loading data kelas...
          </h1>
        </div>
      ) : (
        <div className='mt-6 py-4 flex flex-col gap-8'>
          {kelas === null ? (
            <h1 className='text-center text-red-500 font-bold text-2xl'>
              Kelas Tidak Ditemukan
            </h1>
          ) : (
            <>
              <div className='border-b-2 border-primary flex flex-col gap-8'>
                <div className="flex items-center justify-between">
                  <h1 className='text-3xl font-bold'>{kelas?.nama}</h1>
                  <Button alternateStyle='ghost'>
                    <Image src={Star} alt='' />
                  </Button>
                </div>
                <div className='flex gap-6'>
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
                  Komentar(
                  {kelas?.comment && kelas.comment.length > 0
                    ? kelas.comment.length
                    : 0}
                  )
                </h1>
                {kelas?.comment && kelas.comment.length > 0 && (
                  <div className='mt-6 flex flex-col gap-6'>
                    {kelas.comment.map((item) => (
                      <div key={item.id} className='flex gap-4'>
                        <img
                          className='w-8 h-8'
                          src={item.owner.avatar}
                          alt=''
                        />
                        <div className='flex flex-col gap-4'>
                          <div className='flex gap-4'>
                            <h1 className='font-bold'>{item.owner.username}</h1>
                            <h1>{item.postedAt}</h1>
                          </div>
                          <p>{item.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailKelas;
