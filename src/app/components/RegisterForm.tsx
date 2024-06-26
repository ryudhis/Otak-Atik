"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@utils/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import UsernameIcon from "@img/login/username.png";
import PasswordIcon from "@img/login/password.png";
import Image from "next/image";
import { toast } from "react-toastify";

const formSchema = z.object({
  email: z.string().min(6).max(50),
  username: z.string().min(4).max(50),
  password: z.string().min(6).max(50),
  type: z.string().min(1),
});

const Registerform = () => {
  const router = useRouter();
  const [userType, setUserType] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      type: "",
    },
  });

  const registerAccount = async (values: any) => {
    try {
      const response = await axios.post("api/register", values);
      if (response.data.status !== 400) {
        toast.success("Berhasil Daftar");
        router.push("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Gagal Daftar");
    }
    reset();
  };

  const handleTypeSelection = (type: string) => {
    setUserType(type);
    setValue("type", type); // Update the form value
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-primary rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4 text-white">Daftar</h2>
      <form onSubmit={handleSubmit(registerAccount)} className="space-y-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Image src={UsernameIcon} alt="Email Icon" className="h-5 w-5" />
          </div>
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className={`text-black pl-10 mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary ${
              errors.email ? "border-red-500" : ""
            }`}
          />
        </div>
        {errors.email && (
          <span className="text-red-600 text-sm">
            Masukkan email minimal 6 karakter
          </span>
        )}

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Image src={UsernameIcon} alt="Username Icon" className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Username"
            {...register("username", { required: true })}
            className={`text-black pl-10 mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary ${
              errors.username ? "border-red-500" : ""
            }`}
          />
        </div>
        {errors.username && (
          <span className="text-red-600 text-sm">
            Masukkan username minimal 4 karakter
          </span>
        )}

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Image src={PasswordIcon} alt="Password Icon" className="h-5 w-5" />
          </div>
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
            className={`text-black pl-10 mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary ${
              errors.password ? "border-red-500" : ""
            }`}
          />
        </div>
        {errors.password && (
          <span className="text-red-600 text-sm">
            Masukkan password minimal 6 karakter
          </span>
        )}

        <div className="flex space-x-2 justify-center">
          <button
            type="button"
            onClick={() => handleTypeSelection("pelajar")}
            className={`px-4 py-2 rounded-md font-semibold w-full ${
              userType === "pelajar"
                ? "bg-secondary  border-primary border-[1px] text-slate-800"
                : "bg-primary border-[1px] border-secondary text-white"
            }`}
          >
            Pelajar
          </button>

          <button
            type="button"
            onClick={() => handleTypeSelection("tutor")}
            className={`px-4 py-2 rounded-md font-semibold w-full ${
              userType === "tutor"
                ? "bg-secondary border-primary border-[1px] text-slate-800"
                : "bg-primary border-[1px] border-secondary text-white"
            }`}
          >
            Tutor
          </button>
        </div>

        <input type="hidden" value={userType} {...register("type")} />

        {errors.type && (
          <span className="text-red-600 text-sm">Pilih salah satu tipe!</span>
        )}

        <button
          type="submit"
          className="w-full bg-secondary text-slate-800 font-bold py-2 px-4 border border-transparent rounded-md shadow-sm hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Daftar
        </button>
      </form>
    </div>
  );
};

export default Registerform;
