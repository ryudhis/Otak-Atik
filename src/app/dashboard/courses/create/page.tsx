"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@utils/axios";
import Cookies from "js-cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  judul: z.string().min(1, "Judul is required"),
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
    "Computer Science",
    "Science",
    "Sport",
    "Marketing",
    "General",
  ]),
  harga: z.string(),
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
      materi: [{ name: "" }],
      spesifikasi: [{ name: "" }],
      metode: [],
      jadwal: "",
      durasi: "",
      harga: "",
      kategori: "",
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
    <div className='bg-tertiary w-[90%] p-28 mb-40 h-screen flex flex-col'>
      <h2 className='text-3xl font-bold mb-4 text-white'>Buat Kelas</h2>
      <form onSubmit={handleSubmit(createClass)} className='space-y-6'>
        <div>
          <label className='text-white font-bold text-md'>Judul</label>
          <input
            type='text'
            placeholder='Tulis judul kelas anda'
            {...register("judul")}
            className={`text-black mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary ${
              errors.judul ? "border-red-500" : ""
            }`}
          />
          {errors.judul && (
            <span className='text-red-600 text-sm'>{errors.judul.message}</span>
          )}
        </div>

        <div className='flex flex-col gap-3'>
          <label className='text-white font-bold text-md'>Materi</label>
          {materiFields.map((item, index) => (
            <div key={item.id} className='flex space-x-2'>
              <input
                type='text'
                placeholder='Materi kelas'
                {...register(`materi.${index}.name`)}
                className='text-black mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary'
              />
            </div>
          ))}
          <div className='flex gap-5'>
            <button
              type='button'
              onClick={() => appendMateri({ name: "" })}
              className='mt-2 w-[150px] bg-secondary text-slate-800 font-bold py-2 px-4 border border-transparent rounded-md shadow-sm hover:opacity-80'
            >
              Tambah Materi
            </button>
            {materiFields.length > 1 && (
              <button
                type='button'
                onClick={() => removeMateri(materiFields.length - 1)}
                className='mt-2 w-[150px] bg-secondary text-slate-800 font-bold py-2 px-4 border border-transparent rounded-md shadow-sm hover:opacity-80'
              >
                Delete Materi
              </button>
            )}
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <label className='text-white font-bold text-md'>Spesifikasi</label>
          {spesifikasiFields.map((item, index) => (
            <div key={item.id} className='flex space-x-2'>
              <input
                type='text'
                placeholder='Spesifikasi'
                {...register(`spesifikasi.${index}.name` as const)}
                className='text-black mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary'
              />
            </div>
          ))}
          <div className='flex gap-5'>
            <button
              type='button'
              onClick={() => appendSpesifikasi({ name: "" })}
              className='mt-2 w-[180px] bg-secondary text-slate-800 font-bold py-2 px-4 border border-transparent rounded-md shadow-sm hover:opacity-80'
            >
              Tambah Spesifikasi
            </button>
            {spesifikasiFields.length > 1 && (
              <button
                type='button'
                onClick={() => removeSpesifikasi(spesifikasiFields.length - 1)}
                className='mt-2 bg-secondary text-slate-800 font-bold py-2 px-4 border border-transparent rounded-md shadow-sm hover:opacity-80'
              >
                Delete Spesifikasi
              </button>
            )}
          </div>
        </div>

        <div>
          <label className='text-white font-bold text-md'>Metode</label>
          <div className='flex space-x-4'>
            <label className='text-white font-bold text-md'>
              <input
                type='checkbox'
                value='Modul'
                {...register("metode")}
                className='mr-2 rounded-checkbox checked:bg-secondary'
              />
              Modul
            </label>
            <label className='text-white font-bold text-md'>
              <input
                type='checkbox'
                value='Diskusi Kelas'
                {...register("metode")}
                className='mr-2 rounded-checkbox checked:bg-secondary'
              />
              Diskusi Kelas
            </label>
          </div>
        </div>

        <label className='text-white font-bold text-md'>Jadwal</label>
        <div>
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
          <label className='text-white font-bold text-md'>Durasi</label>
          <select
            {...register("durasi", { required: true })}
            className={`text-black mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary ${
              errors.durasi ? "border-red-500" : ""
            }`}
          >
            <option value=''>Pilih Durasi</option>
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
          <label className='text-white font-bold text-md'>Kategori</label>
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
            <option value='Marketing'>Marketing</option>
          </select>
          {errors.kategori && (
            <span className='text-red-600 text-sm'>
              {errors.kategori.message}
            </span>
          )}
        </div>

        <div>
          <label className='text-white font-bold text-md'>Harga {`(Rp)`}</label>
          <input
            type='text'
            placeholder='Rp'
            {...register("harga")}
            className={`text-black mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary ${
              errors.harga ? "border-red-500" : ""
            }`}
          />
          {errors.harga && (
            <span className='text-red-600 text-sm'>{errors.harga.message}</span>
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
