/* eslint-disable @next/next/no-img-element */
"use client";
import axiosConfig from "@utils/axios";
import React, { useState, useEffect } from "react";
import Button from "@components/Button";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import Image from "next/image";
import Logo from "@img/logo.png";

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export interface userData {
  id: number;
  username: string;
  avatar: string;
  email: string;
  type: string;
}

const updateSchema = z.object({
  username: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
  oldPassword: z.string().min(6).optional(),
  newPassword: z.string().min(6).optional(),
});

type UpdateData =
  | {
      id: number | undefined;
      username?: string;
      email?: string;
    }
  | {
      id: number | undefined;
      oldPassword: string;
      newPassword: string;
    };

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<userData>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"username" | "email" | "password">(
    "username"
  );
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateSchema),
  });

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (data: any) => {
    let updateData: UpdateData = {
      id: userData?.id,
    };

    if (modalType === "password") {
      updateData = {
        ...updateData,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      };
    } else {
      updateData = {
        ...updateData,
        [modalType]: data[modalType],
      };
    }

    try {
      const response = await axiosConfig.patch(
        "api/account/update",
        updateData
      );
      if (response.data.status === 400) {
        alert(response.data.message);
      } else {
        if (modalType !== "password") {
          setUserData((prev: userData | undefined) => ({
            ...(prev || {
              id: 0,
              username: "",
              avatar: "",
              email: "",
              type: "",
            }),
            [modalType]: data[modalType],
          }));
        }
        toast.success(`Data ${modalType} berhasil diubah`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleOpenModal = (type: "username" | "email" | "password") => {
    setModalType(type);
    if (type !== "password") {
      setValue(type, userData ? userData[type] : "");
    } else {
      setValue("oldPassword", "");
      setValue("newPassword", "");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return isLoading ? (
    <div className="h-screen flex flex-col justify-center items-center w-full gap-4">
      <Image className="scale-110" src={Logo} alt="Logo" />
      <h1 className="text-center text-secondary font-bold text-2xl animate-pulse">
        Loading profile...
      </h1>
    </div>
  ) : (
    <div className="bg-tertiary p-28 h-screen justify-between">
      <div className="flex gap-4 items-center">
        <img className="w-20" src={userData?.avatar} alt="" />
        <div className="flex flex-col">
          <h1 className="font-bold text-2xl">{userData?.username}</h1>
          <p className="text-lg">{userData?.email}</p>
        </div>
      </div>
      <div className="mt-16">
        <h1 className="font-bold text-2xl">Biodata Diri</h1>
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center">
            <p className="w-40">Nama Lengkap</p>
            <div className="flex-1 flex items-center">
              <p>: {userData?.username}</p>
              <Button
                alternateStyle="text"
                onClick={() => handleOpenModal("username")}
              >
                Ubah Nama
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="my-4">
        <h1 className="font-bold text-2xl">Kontak</h1>
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center">
            <p className="w-40">Email</p>
            <div className="flex-1 flex items-center">
              <p>: {userData?.email}</p>
              <Button
                alternateStyle="text"
                onClick={() => handleOpenModal("email")}
              >
                Ubah Email
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Button
        alternateStyle="secondary"
        onClick={() => handleOpenModal("password")}
      >
        Ubah sandi
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-tertiary bg-opacity-50 flex justify-center items-center">
          <div className="bg-tertiary p-6 shadow-lg border-4 border-primary rounded-xl">
            <h2 className="text-2xl font-bold mb-4">
              Ubah{" "}
              {modalType === "username"
                ? "Nama"
                : modalType === "email"
                ? "Email"
                : "Sandi"}
            </h2>
            <form onSubmit={handleSubmit(handleSave)}>
              {modalType === "password" ? (
                <>
                  <input
                    type="password"
                    {...register("oldPassword")}
                    placeholder="Sandi Lama"
                    className={`border p-2 w-full mb-4 text-black rounded-lg ${
                      errors.oldPassword ? "border-red-500" : ""
                    }`}
                  />
                  {errors.oldPassword && (
                    <p className="text-red-600">
                      {String(errors.oldPassword?.message)}
                    </p>
                  )}
                  <input
                    type="password"
                    {...register("newPassword")}
                    placeholder="Sandi Baru"
                    className={`border p-2 w-full mb-4 text-black rounded-lg ${
                      errors.newPassword ? "border-red-500" : ""
                    }`}
                  />
                  {errors.newPassword && (
                    <p className="text-red-600">
                      {String(errors.newPassword?.message)}
                    </p>
                  )}
                </>
              ) : (
                <input
                  type="text"
                  {...register(modalType)}
                  className={`border p-2 w-full mb-4 text-black rounded-lg ${
                    errors[modalType] ? "border-red-500" : ""
                  }`}
                />
              )}
              {errors[modalType] && (
                <p className="text-red-600">
                  {String(errors[modalType]?.message)}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <Button alternateStyle="secondary" onClick={handleCloseModal}>
                  Batal
                </Button>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
