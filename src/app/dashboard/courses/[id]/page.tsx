/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import KelasContent from "@/app/components/KelasContent";
import Button from "@components/Button";
import axiosConfig from "@utils/axios";
import Image from "next/image";
import Star from "@svg/star.svg";
import toggledStar from "@svg/star-toggled.svg";
import deleteIcon from "@svg/delete.svg";
import Comments from "@svg/comments.svg";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";
import CommentItem from "@/app/components/CommentItem";

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
  modul: string;
  linkMeet: string;
  harga: number;
  owner: ownerItem;
  comment: commentItem[];
  siswa: userData[];
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
  type: string;
  kelasFavorite: number[];
  tutorFavorite: number[];
}

const DetailKelas = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [kelas, setKelas] = useState<kelasItem>();
  const [userData, setUserData] = useState<userData>({} as userData);
  const [commentBoxVisible, setCommentBoxVisible] = useState(false);
  const [checkoutVisible, setCheckoutVisible] = useState(false);

  const formSchema = z.object({
    content: commentBoxVisible
      ? z.string().min(1).max(255)
      : z.string().optional(),
    file: z.any(),
    linkMeet: z.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      file: null,
      linkMeet: "",
    },
  });

  const postComment = async (values: any) => {
    const date = new Date();
    const isoDateString = date.toISOString();

    const data = {
      kelasId: parseInt(id),
      ownerId: userData?.id,
      content: values.content,
      postedAt: isoDateString,
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
      resetField("content");
      setCommentBoxVisible(false);
    }
  };

  const deleteComment = async (idComment: number) => {
    try {
      console.log(idComment);

      const response = await axiosConfig.delete(`api/commentKelas/${idComment}`);
      if (response.data.status !== 400) {
        toast.success("Berhasil Hapus Komentar");
        setRefresh(!refresh);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadModul = async (values: any) => {
    const formData = new FormData();
    formData.append("file", values.file[0]);

    try {
      const response = await axiosConfig.patch(
        `/api/kelas/updateModul/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === 200) {
        toast.success("Berhasil Upload");
        resetField("file");
        setRefresh(!refresh);
      } else {
        toast.error("Gagal Upload");
      }
    } catch (error) {
      toast.error("Gagal Upload");
      console.error("Error:", error);
    }
  };

  const tambahLink = async (values: any) => {
    const data = {
      linkMeet: values.linkMeet,
    };

    try {
      const response = await axiosConfig.patch(`api/kelas/${id}`, data);
      if (response.data.status !== 400) {
        toast.success("Berhasil Tambah Link Meet");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      toast.error("Gagal Tambah Link Meet");
    } finally {
      setRefresh(!refresh);
    }
  };

  const checkoutKelas = async () => {
    const data = {
      userId: userData?.id,
    };

    try {
      const response = await axiosConfig.patch(
        `api/kelas/checkout/${id}`,
        data
      );
      if (response.data.status !== 400) {
        toast.success("Berhasil Checkout");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      toast.error("Gagal Checkout");
    } finally {
      setRefresh(!refresh);
      toggleCheckoutBox();
    }
  };

  const toggleKelasFavorite = async (userId: number, kelasId: number) => {
    const data = { userId, kelasId };

    let updatedKelasFavorite;

    if (userData.kelasFavorite.includes(kelasId)) {
      updatedKelasFavorite = userData.kelasFavorite.filter(
        (kelas) => kelas !== kelasId
      );
    } else {
      updatedKelasFavorite = [kelasId, ...userData.kelasFavorite];
    }

    setUserData((prevUserData) => ({
      ...prevUserData,
      kelasFavorite: updatedKelasFavorite,
    }));

    try {
      const response = await axiosConfig.patch(
        "api/account/kelasFavorite",
        data
      );
      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        kelasFavorite: userData.kelasFavorite.includes(kelasId)
          ? [kelasId, ...prevUserData.kelasFavorite]
          : prevUserData.kelasFavorite.filter((kelas) => kelas !== kelasId),
      }));
      toast.error("Gagal Favorite Kelas");
    }
  };

  const toggleTutorFavorite = async (userId: number) => {
    const tutorId = kelas?.owner.id ?? 0;
    const data = { userId, tutorId };

    let updatedTutorFavorite;

    if (userData.tutorFavorite.includes(tutorId)) {
      updatedTutorFavorite = userData.tutorFavorite.filter(
        (tutor) => tutor !== tutorId
      );
    } else {
      updatedTutorFavorite = [tutorId, ...userData.tutorFavorite];
    }

    setUserData((prevUserData) => ({
      ...prevUserData,
      tutorFavorite: updatedTutorFavorite,
    }));

    try {
      const response = await axiosConfig.patch(
        "api/account/tutorFavorite",
        data
      );
      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        tutorFavorite: userData.tutorFavorite.includes(tutorId)
          ? [tutorId, ...prevUserData.tutorFavorite]
          : prevUserData.tutorFavorite.filter((tutor) => tutor !== tutorId),
      }));

      toast.error("Gagal Mengikuti Tutor");
    }
  };

  const toggleCommentBox = () => {
    setCommentBoxVisible((prev) => !prev);
  };

  const toggleCheckoutBox = () => {
    setCheckoutVisible((prev) => !prev);
  };

  const getKelas = async () => {
    try {
      const response = await axiosConfig.get(`api/kelas/${id}`);
      if (response.data.status !== 400) {
        setKelas(response.data.data);
        setValue("linkMeet", response.data.data.linkMeet);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserData = async () => {
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

  function formatHarga(harga: number) {
    if (isNaN(harga)) {
      throw new Error("Invalid number string");
    }

    return harga.toLocaleString("de-DE");
  }

  const deleteKelas = async () => {
    try {
      const response = await axiosConfig.delete(`api/kelas/${id}`);
      if (response.data.status !== 400) {
        toast.success("Berhasil Hapus Kelas");
        router.push("/dashboard/courses");
      } else {
        toast.error("Gagal Hapus Kelas");
      }
    } catch (error) {
      toast.error("Gagal Hapus Kelas");
    }
  };

  useEffect(() => {
    getKelas();
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <>
      <div
        className={
          checkoutVisible
            ? "p-[60px] mt-5 px-36 h-screen overflow-auto"
            : `hidden`
        }
      >
        <div 
          className='p-8 px-12 border-solid border-[2px] rounded-xl border-primary shadow-box-kelas mt-5'
          data-aos="zoom-in"
          data-aos-duration="800"
        >
          {kelas && (
            <>
              <div className='flex flex-col gap-8'>
                <div 
                  className='flex items-center'
                  data-aos="fade-down"
                >
                  <h1 className='text-3xl font-bold'>Checkout Kelas</h1>
                </div>
                <div 
                  className='grid grid-cols-3 gap-8 w-[90%] self-center'
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <KelasContent
                    title={"Materi"}
                    subtitle={"Materi yang akan dibahas"}
                    content={kelas.materi}
                  />
                  <KelasContent
                    title={"Spesifikasi"}
                    subtitle={"Spesifikasi kelas yang dibutuhkan"}
                    content={kelas.spesifikasi}
                  />
                  <KelasContent
                    title={"Metode Ajar"}
                    subtitle={"Metode pembelajaran"}
                    content={[`Meet : ${kelas.durasi} Jam `, ...kelas.metode]}
                  />
                </div>

                <div 
                  className='flex flex-col gap-5'
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className='font-semibold text-xl'>
                    <p>Kelas :</p>
                    <p className='text-secondary'>{kelas.nama}</p>
                  </div>

                  <div className='font-semibold text-xl'>
                    <p>Tutor :</p>
                    <p className='text-secondary'>{kelas.owner.username}</p>
                  </div>

                  <div className='font-semibold text-xl'>
                    <p>Jadwal :</p>
                    <p className='text-secondary'>{kelas.jadwal}</p>
                  </div>

                  <div className='font-semibold text-xl'>
                    <p>Harga :</p>
                    <p className='text-secondary'>{`Rp. ${formatHarga(
                      kelas.harga
                    )}`}</p>
                  </div>
                </div>

                <div 
                  className='grid grid-cols-2 gap-5 self-center '
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <Button
                    onClick={() => toggleCheckoutBox()}
                    alternateStyle='secondary'
                  >
                    Batal
                  </Button>
                  <Button onClick={checkoutKelas} alternateStyle='primary'>
                    Checkout
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div
        className={
          !checkoutVisible
            ? "bg-tertiary p-[60px] mt-5 px-36 h-screen overflow-auto"
            : "hidden"
        }
      >
        <div data-aos="fade-right" data-aos-duration="600">
          <Button onClick={() => router.back()} alternateStyle='secondary'>
            &lt;
          </Button>
        </div>
        {isLoading ? (
          <div className='mt-[25%] h-screen'>
            <h1 className='text-center text-secondary font-bold text-2xl animate-pulse'>
              Loading data kelas...
            </h1>
          </div>
        ) : (
          <div className={"mt-6 flex flex-col gap-8"}>
            {kelas ? (
              <>
                <div className='border-b-2 border-primary flex flex-col gap-8'>
                  <div 
                    className='flex items-center justify-between'
                    data-aos="fade-down"
                    data-aos-duration="800"
                  >
                    <h1 className='text-3xl font-bold'>{kelas?.nama}</h1>

                    <div className='flex items-center gap-5'>
                      {userData.id === kelas.owner.id && (
                        <Image
                          onClick={() => deleteKelas()}
                          className='cursor-pointer hover:scale-110 transition ease-in-out'
                          src={deleteIcon}
                          alt=''
                        />
                      )}

                      <Button
                        onClick={() =>
                          toggleKelasFavorite(userData.id, kelas.id)
                        }
                        alternateStyle='ghost'
                      >
                        <Image
                          src={
                            userData.kelasFavorite.includes(kelas.id)
                              ? toggledStar
                              : Star
                          }
                          alt='Favorite'
                        />
                      </Button>
                    </div>
                  </div>

                  <div 
                    className='grid grid-cols-3 gap-8 w-[90%] self-center'
                    data-aos="fade-up"
                    data-aos-delay="100"
                  >
                    <KelasContent
                      title={"Materi"}
                      subtitle={"Materi yang akan dibahas"}
                      content={kelas.materi}
                    />
                    <KelasContent
                      title={"Spesifikasi"}
                      subtitle={"Spesifikasi kelas yang dibutuhkan"}
                      content={kelas.spesifikasi}
                    />
                    <KelasContent
                      title={"Metode Ajar"}
                      subtitle={"Metode pembelajaran"}
                      content={[`Meet : ${kelas.durasi} Jam `, ...kelas.metode]}
                    />
                  </div>
                  <div 
                    className='flex flex-col gap-3 items-center'
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    <h1 className='font-bold text-2xl'>Jadwal Kelas</h1>
                    <p className='text-secondary font-semibold text-md border-x-[2px] border-primary p-5 mb-4'>
                      {kelas.jadwal}
                    </p>
                    {userData?.type === "pelajar" &&
                      (kelas.siswa.some(
                        (siswa) => siswa.id === userData?.id
                      ) ? (
                        <p className='font-bold text-xl text-secondary mb-4'>
                          Kamu Sudah Daftar
                        </p>
                      ) : (
                        <Button
                          onClick={toggleCheckoutBox}
                          alternateStyle='primary'
                        >
                          Daftar Kelas
                        </Button>
                      ))}
                    {kelas.owner.id === userData?.id && (
                      <div className='grid grid-cols-2 items-center gap-5 '>
                        <form
                          onSubmit={handleSubmit(uploadModul)}
                          className='flex flex-col gap-4'
                        >
                          <label htmlFor='file' className='font-bold text-lg'>
                            {kelas.modul
                              ? "Ganti Modul (PDF)"
                              : "Upload Modul (PDF)"}
                          </label>
                          <input
                            id='file'
                            type='file'
                            {...register("file", { required: true })}
                            className={`w-full p-2 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              errors.file ? "border-red-500" : ""
                            }`}
                          />
                          {errors.file && (
                            <span className='text-red-600 text-sm'>
                              This field is required
                            </span>
                          )}
                          <Button type='submit' alternateStyle='primary'>
                            {kelas.modul ? "Ganti" : "Upload"}
                          </Button>
                        </form>
                        <form
                          onSubmit={handleSubmit(tambahLink)}
                          className='flex flex-col gap-4'
                        >
                          <label
                            htmlFor='linkMeet'
                            className='font-bold text-lg'
                          >
                            Link Meet
                          </label>
                          <input
                            id='linkMeet'
                            type='text'
                            {...register("linkMeet", { required: true })}
                            className={`w-full p-2 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              errors.file ? "border-red-500" : ""
                            }`}
                          />
                          <Button type='submit' alternateStyle='primary'>
                            {kelas.linkMeet ? "Ganti" : "Tambah"}
                          </Button>
                        </form>
                      </div>
                    )}
                  </div>
                  <div data-aos="fade-up" data-aos-delay="300">
                    <div className='flex items-center gap-3 mb-4'>
                      <div
                        onClick={() =>
                          router.push(`/dashboard/profile/${kelas.owner.id}`)
                        }
                        className='flex items-center gap-3 cursor-pointer hover:opacity-80'
                      >
                        <img
                          className='w-10 h-10'
                          src={kelas.owner.avatar}
                          alt='owner avatar'
                        />
                        <p className='text-xl font-semibold'>
                          {kelas.owner.username}
                        </p>
                      </div>

                      {userData.id !== kelas.owner.id && (
                        <Button
                          onClick={() => toggleTutorFavorite(userData.id)}
                        >
                          {userData?.tutorFavorite?.includes(kelas?.owner?.id)
                            ? "Batal Ikuti"
                            : "Ikuti"}
                        </Button>
                      )}
                    </div>

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
                  data-aos="fade-up"
                  data-aos-duration="500"
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
                <div data-aos="fade-up" data-aos-delay="100">
                  <h1 className='text-2xl font-bold'>
                    Komentar(
                    {kelas?.comment && kelas.comment.length > 0
                      ? kelas.comment.length
                      : 0}
                    )
                  </h1>
                  <CommentItem
                    comments={kelas.comment}
                    postedAt={postedAt}
                    deleteComment={deleteComment}
                    userDataId={userData.id}
                  />
                </div>
              </>
            ) : (
              <h1 className='text-center text-red-500 font-bold text-2xl mt-[25%]'>
                Kelas Tidak Ditemukan
              </h1>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default DetailKelas;
