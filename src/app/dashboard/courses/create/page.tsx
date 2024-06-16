"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@utils/axios";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import Button from "@/app/components/Button";
import { toast } from "react-toastify";

const formSchema = z.object({
  nama: z.string().min(1, "nama is required"),
  materi: z.array(
    z.object({
      name: z.string().min(1, "Materi name is required"),
    })
  ),
  spesifikasi: z.array(
    z.object({
      name: z.string().min(1, "Spesifikasi name is required"),
    })
  ),
  metode: z.array(z.enum(["Modul", "Diskusi Kelas"])),
  jadwal: z.string().min(1, "Jadwal is required"),
  durasi: z.enum(["1", "2", "3"]),
  kategori: z.enum([
    "",
    "Computer Science",
    "Science",
    "Sport",
    "Marketing",
    "General",
  ]),
  harga: z.string(),
  file: z.any(),
  linkMeet: z.string(),
});

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export interface UserData {
  id: number;
  type: string;
}

const CreateClassForm = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      materi: [{ name: "" }],
      spesifikasi: [{ name: "" }],
      metode: [] as Array<"Modul" | "Diskusi Kelas">,
      jadwal: "",
      durasi: "",
      harga: "",
      kategori: "",
      file: null,
      linkMeet: "",
    },
  });

  const {
    fields: materiFields,
    append: appendMateri,
    remove: removeMateri,
  } = useFieldArray({
    control,
    name: "materi",
  });

  const {
    fields: spesifikasiFields,
    append: appendSpesifikasi,
    remove: removeSpesifikasi,
  } = useFieldArray({
    control,
    name: "spesifikasi",
  });

  const formatDate = (jadwal: string) => {
    const dateObject = new Date(jadwal);

    const dayOptions = { weekday: "long" as const };
    const dayName = new Intl.DateTimeFormat("id-ID", dayOptions).format(
      dateObject
    );

    const dateOptions = {
      day: "2-digit" as const,
      month: "long" as const,
      year: "numeric" as const,
    };

    const formattedDate = new Intl.DateTimeFormat("id-ID", dateOptions).format(
      dateObject
    );

    const finalFormattedDate = `${dayName}, ${formattedDate}`;

    return finalFormattedDate;
  };

  const createClass = async (values: any) => {
    const formattedDate = formatDate(values.jadwal);

    const data = {
      ...values,
      jadwal: formattedDate,
      ownerId: userData?.id,
      materi: values.materi.map((item: any) => item.name),
      spesifikasi: values.spesifikasi.map((item: any) => item.name),
    };

    console.log(values);

    const formData = new FormData();
    if (values.file && values.file.length > 0) {
      formData.append("file", values.file[0]);
    }
    formData.append("data", JSON.stringify(data));

    try {
      const response = await axios.post("/api/kelas", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      if (response.data.status === 200) {
        toast.success("Berhasil Submit");
        reset();
        router.push("/dashboard/courses");
      } else {
        toast.error("Gagal Submit");
      }
    } catch (error) {
      toast.error("Gagal Submit");
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          const decodedToken = jwtDecode<CustomJwtPayload>(token);
          const userId = decodedToken.id;

          const response = await axios.get(`/api/account/${userId}`);
          if (response.data.data.type === "pelajar") {
            router.push("/dashboard/courses");
          } else {
            setUserData(response.data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [router]);

  const metodeValue = watch("metode");

  return (
    <div className="bg-tertiary overflow-auto h-screen p-28">
      <Button
        onClick={() => {
          router.back();
        }}
        alternateStyle="w-[10px] secondary"
      >
        &lt;
      </Button>
      <div className="flex flex-col mt-[10px]">
        <h2 className="text-3xl font-bold mb-4 text-white">Buat Kelas</h2>
        <form onSubmit={handleSubmit(createClass)} className="space-y-6">
          <div>
            <label className="font-bold text-md">Nama</label>
            <input
              type="text"
              placeholder="Tulis nama kelas anda"
              {...register("nama")}
              className={`text-black mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary ${
                errors.nama ? "border-red-500" : ""
              }`}
            />
            {errors.nama && (
              <span className="text-red-600 text-sm">
                {errors.nama.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="font-bold text-md">Materi</label>
            {materiFields.map((item, index) => (
              <div key={item.id} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Materi kelas"
                  {...register(`materi.${index}.name`)}
                  className="text-black mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary"
                />
              </div>
            ))}
            <div className="flex gap-5">
              <button
                type="button"
                onClick={() => appendMateri({ name: "" })}
                className="mt-2 w-[200px] bg-secondary text-slate-800 font-bold py-2 px-4 border border-transparent rounded-md shadow-sm hover:opacity-80"
              >
                Tambah Materi
              </button>
              {materiFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMateri(materiFields.length - 1)}
                  className="mt-2 bg-secondary text-slate-800 font-bold py-2 px-4 border border-transparent rounded-md shadow-sm hover:opacity-80"
                >
                  Delete Materi
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="font-bold text-md">Spesifikasi</label>
            {spesifikasiFields.map((item, index) => (
              <div key={item.id} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Spesifikasi"
                  {...register(`spesifikasi.${index}.name` as const)}
                  className="text-black mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary"
                />
              </div>
            ))}
            <div className="flex gap-5">
              <button
                type="button"
                onClick={() => appendSpesifikasi({ name: "" })}
                className="mt-2 w-[200px] bg-secondary text-slate-800 font-bold py-2 px-4 border border-transparent rounded-md shadow-sm hover:opacity-80"
              >
                Tambah Spesifikasi
              </button>
              {spesifikasiFields.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    removeSpesifikasi(spesifikasiFields.length - 1)
                  }
                  className="mt-2 bg-secondary text-slate-800 font-bold py-2 px-4 border border-transparent rounded-md shadow-sm hover:opacity-80"
                >
                  Delete Spesifikasi
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="font-bold text-md">Metode</label>
            <div className="flex space-x-4">
              <label className="font-bold text-md">
                <input
                  type="checkbox"
                  value="Modul"
                  {...register("metode")}
                  className="mr-2 rounded-checkbox checked:bg-secondary"
                />
                Modul
              </label>
              <label className="font-bold text-md">
                <input
                  type="checkbox"
                  value="Diskusi Kelas"
                  {...register("metode")}
                  className="mr-2 rounded-checkbox checked:bg-secondary"
                />
                Diskusi Kelas
              </label>
            </div>
          </div>

          <div>
            <label className="font-bold text-md">Jadwal</label>
            <div className="flex gap-5 w-[30%]">
              <input
                type="date"
                {...register("jadwal")}
                className={`bg-white text-black font-semibold  mt-1 block w-full px-3 py-2 border bg-transparent rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary ${
                  errors.jadwal ? "border-red-500" : ""
                }`}
              />

              <select
                {...register("durasi", { required: true })}
                className={`bg-white text-black font-semibold mt-1 block w-full px-3 py-2 border bg-transparent  rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary ${
                  errors.durasi ? "border-red-500" : ""
                }`}
              >
                <option value="">Pilih Jam</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
            <div className="flex gap-5">
              {errors.jadwal && (
                <span className="text-red-600 text-sm">
                  Jadwal belum dipilih
                </span>
              )}
              {errors.durasi && (
                <span className="text-red-600 text-sm">Jam belum dipilih</span>
              )}
            </div>
          </div>

          <div>
            <label className="font-bold text-md">Kategori</label>
            <select
              {...register("kategori")}
              className={`text-black mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary ${
                errors.kategori ? "border-red-500" : ""
              }`}
            >
              <option value="">Pilih Kategori</option>
              <option value="General">General</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Science">Science</option>
              <option value="Sport">Sport</option>
              <option value="Business">Business</option>
              <option value="Design">Design</option>
              <option value="Music">Music</option>
              <option value="Video">Video</option>
            </select>
            {`*Kategori yang kosong akan ditambahkan ke kategori General`}
            <br></br>
          </div>

          <div>
            <label className="font-bold text-md">Harga {`(Rp)`}</label>
            <input
              type="text"
              placeholder="Rp"
              {...register("harga")}
              className={`text-black mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary ${
                errors.harga ? "border-red-500" : ""
              }`}
            />
            {errors.harga && (
              <span className="text-red-600 text-sm">
                {errors.harga.message}
              </span>
            )}
          </div>

          <div>
            <label className="font-bold text-md">Link Google Meet</label>
            <input
              type="text"
              placeholder="Link Google Meet anda"
              {...register("linkMeet")}
              className={`text-black mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary ${
                errors.linkMeet ? "border-red-500" : ""
              }`}
            />
            {`*Link meeting dapat diisi nanti`}
          </div>

          {metodeValue.includes("Modul") && (
            <div>
              <label className="font-bold text-md">Upload Modul (PDF)</label>
              <input
                type="file"
                {...register("file", { required: false })}
                className={`text-black mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary ${
                  errors.file ? "border-red-500" : ""
                }`}
              />
              {`*Modul dapat di upload nanti`}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-secondary text-slate-800 font-bold py-2 px-4 border border-transparent rounded-md shadow-sm hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Buat Kelas
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateClassForm;
