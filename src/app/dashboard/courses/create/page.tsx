"use client"

import React from "react";
import { useRouter } from "next/navigation";
import axios from "@utils/axios";
import Cookies from "js-cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  judul: z.string().min(1, "Judul is required"),
  materi: z.array(z.string().min(1, "Materi is required")),
  spesifikasi: z.array(z.string().min(1, "Spesifikasi is required")),
  metode: z.array(z.enum(["Modul", "Diskusi Kelas"])),
  jadwal: z.string().min(1, "Jadwal is required"),
  durasi: z.enum(["1", "2", "3"]),
  kategori: z.enum([
    "Computer Science",
    "Science",
    "Sport",
    "Marketing",
    "General",
  ]),
});

const CreateClassForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      judul: "",
      materi: ["a",], // Default value for materi
      spesifikasi: ["a",], // Default value for spesifikasi
      metode: [],
      jadwal: "",
      durasi: "1",
      kategori: "Computer Science",
    },
  });

  const { fields: materiFields, append: appendMateri } = useFieldArray({
    control,
    name: "materi",
  });

  const { fields: spesifikasiFields, append: appendSpesifikasi } = useFieldArray({
    control,
    name: "spesifikasi",
  });

  const createClass = async (values: any) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.post("api/create-class", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        alert("Class created successfully");
        router.push("/dashboard/classes");
      } else {
        alert("Failed to create class");
      }
    } catch (error) {
      alert("Failed to create class");
      console.error(error);
    }
    reset();
  };

  return (
    <div className='bg-tertiary p-28 h-screen flex flex-col'>
      <h2 className='text-3xl font-bold mb-4 text-white'>Create Class</h2>
      <form onSubmit={handleSubmit(createClass)} className='space-y-6'>
        <div>
          <label className='text-white'>Judul</label>
          <input
            type='text'
            {...register("judul")}
            className={`text-black mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary ${
              errors.judul ? "border-red-500" : ""
            }`}
          />
          {errors.judul && (
            <span className='text-red-600 text-sm'>{errors.judul.message}</span>
          )}
        </div>

        <div>
        <label className='text-white'>Materi</label>
          {materiFields.map((item, index) => (
            <div key={item.id} className='flex space-x-2'>
              <input
                type='text'
                {...register(`materi.${index}`)}
                defaultValue={item.title} // Assuming you have a `title` property in your materi objects
                className='text-black mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary'
              />
            </div>
          ))}
          <button
            type='button'
            onClick={() => appendMateri("")}
            className='mt-2 bg-secondary text-slate-800 font-bold py-2 px-4 border border-transparent rounded-md shadow-sm hover:opacity-80'
          >
            Add Materi
          </button>
        </div>

        <div>
          <label className='text-white'>Spesifikasi</label>
          {spesifikasiFields.map((item, index) => (
            <div key={item.id} className='flex space-x-2'>
              <input
                type='text'
                {...register(`spesifikasi.${index}` as const)}
                className='text-black mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary'
              />
            </div>
          ))}
          <button
            type='button'
            onClick={() => appendSpesifikasi("")}
            className='mt-2 bg-secondary text-slate-800 font-bold py-2 px-4 border border-transparent rounded-md shadow-sm hover:opacity-80'
          >
            Add Spesifikasi
          </button>
        </div>

        <div>
          <label className='text-white'>Metode</label>
          <div className='flex space-x-4'>
            <label className='text-white'>
              <input
                type='checkbox'
                value='Modul'
                {...register("metode")}
                className='mr-2'
              />
              Modul
            </label>
            <label className='text-white'>
              <input
                type='checkbox'
                value='Diskusi Kelas'
                {...register("metode")}
                className='mr-2'
              />
              Diskusi Kelas
            </label>
          </div>
        </div>

        <div>
          <label className='text-white'>Jadwal</label>
          <input
            type='date'
            {...register("jadwal")}
            className={`text-black mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary ${
              errors.jadwal ? "border-red-500" : ""
            }`}
          />
          {errors.jadwal && (
            <span className='text-red-600 text-sm'>
              {errors.jadwal.message}
            </span>
          )}
        </div>

        <div>
          <label className='text-white'>Durasi</label>
          <select
            {...register("durasi")}
            className={`text-black mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary ${
              errors.durasi ? "border-red-500" : ""
            }`}
          >
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
          </select>
          {errors.durasi && (
            <span className='text-red-600 text-sm'>
              {errors.durasi.message}
            </span>
          )}
        </div>

        <div>
          <label className='text-white'>Kategori</label>
          <select
            {...register("kategori")}
            className={`text-black mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary ${
              errors.kategori ? "border-red-500" : ""
            }`}
          >
            <option value='Computer Science'>Computer Science</option>
            <option value='Science'>Science</option>
            <option value='Sport'>Sport</option>
            <option value='Marketing'>Marketing</option>
            <option value='General'>General</option>
          </select>
          {errors.kategori && (
            <span className='text-red-600 text-sm'>
              {errors.kategori.message}
            </span>
          )}
        </div>

        <button
          type='submit'
          className='w-full bg-secondary text-slate-800 font-bold py-2 px-4 border border-transparent rounded-md shadow-sm hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        >
          Create Class
        </button>
      </form>
    </div>
  );
};

export default CreateClassForm;
