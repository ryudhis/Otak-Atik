"use client";
import Button from "@components/Button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
import axiosConfig from "@utils/axios";
import { toast } from "react-toastify";

const formSchema = z.object({
  title: z.string().min(1).max(50),
  content: z.string().min(1).max(255),
  kategori: z.string().min(1).max(50),
});

interface userData {
  id: number;
}

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

const CreateForum = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<userData>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      kategori: "",
    },
  });
  
  const postDiskusi = async (values: any) => {
    const date = new Date();
    const isoDateString = date.toISOString();

    const data = {
      ownerId: userData?.id,
      title: values.title,
      content: values.content,
      kategori: values.kategori,
      postedAt: isoDateString,
    };
    try {
      const response = await axiosConfig.post("api/forumDiskusi", data);
      if (response.data.status !== 400) {
        toast.success("Berhasil Buat Dikusi");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Gagal Membuat Diskusi");
    } finally {
      reset();
      router.push(`/dashboard/forum`)
    }
  };

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
      <Button onClick={() => router.back()} alternateStyle="secondary">
        &lt;
      </Button>
      <h1 className="text-2xl font-bold my-4">Buat Diskusi</h1>
      <form
        onSubmit={handleSubmit(postDiskusi)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-4">
          <label htmlFor="judul" className="text-lg font-bold">
            Judul
          </label>
          <input
            placeholder="Judul disini..."
            {...register("title", { required: true })}
            className={`w-full p-4 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.title ? "border-red-500" : ""
            }`}
          />
          {errors.title && (
            <span className="text-red-600 text-sm">This field is required</span>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <label htmlFor="konten" className="text-lg font-bold">
            Konten
          </label>
          <textarea
            placeholder="Konten disini..."
            {...register("content", { required: true })}
            className={`w-full p-4 h-32 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.content ? "border-red-500" : ""
            }`}
          />
          {errors.content && (
            <span className="text-red-600 text-sm">This field is required</span>
          )}
        </div>
        <div className="flex flex-col gap-4 mb-4">
          <label htmlFor="kategori" className="text-lg font-bold">
            Kategori
          </label>
          <select
            {...register("kategori")}
            className={`text-black mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary ${
              errors.kategori ? "border-red-500" : ""
            }`}
          >
              <option value=''>Pilih Kategori</option>
              <option value='General'>General</option>
              <option value='Computer Science'>Computer Science</option>
              <option value='Science'>Science</option>
              <option value='Sport'>Sport</option>
              <option value='Business'>Business</option>
              <option value='Design'>Design</option>
              <option value='Music'>Music</option>
              <option value='Video'>Video</option>
          </select>
          {errors.kategori && (
            <span className="text-red-600 text-sm">
              {errors.kategori.message}
            </span>
          )}
        </div>
        <Button type="submit" alternateStyle="primary">
          Buat Diskusi
        </Button>
      </form>
    </div>
  );
};

export default CreateForum;
