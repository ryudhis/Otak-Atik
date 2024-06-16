"use client";

import axiosConfig from "@utils/axios";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import  { jwtDecode, JwtPayload } from "jwt-decode";
import KelasItem from "@/app/components/KelasItem";
import Image from "next/image";
import addButton from "@img/courses/add.png";
import Button from "@/app/components/Button";
import Logo from "@img/logo.png";

export interface Kelas {
  nama: string;
  id: number;
  owner: OwnerItem;
  kategori: string;
  jadwal: string;
  modul: string;
  linkMeet: string;
}

export interface OwnerItem {
  username: string;
  avatar: string;
}

export interface UserData {
  id: number;
  kelasDiambil: Kelas[];
  kelasDiampu: Kelas[];
  type: string;
}

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

const Courses = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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

  const classesToDisplay =
    userData?.type === "pelajar"
      ? userData?.kelasDiambil
      : userData?.kelasDiampu;

  return (
    <div className="bg-tertiary p-28 h-screen flex flex-col overflow-auto">
      <h1 className="font-bold text-2xl mb-4">Kelas Aktif</h1>
      {isLoading && !userData ? (
        <div className="h-screen flex flex-col justify-center items-center w-full gap-4">
          <Image className="scale-110" src={Logo} alt="Logo" />
          <h1 className="text-center text-secondary font-bold text-2xl animate-pulse">
            Loading kelas...
          </h1>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 h-[80vh] overflow-auto">
            {classesToDisplay && classesToDisplay.length > 0 ? (
              classesToDisplay.map((kelas) => (
                <KelasItem
                  key={kelas.id}
                  id={kelas.id}
                  title={kelas.nama}
                  jadwal={kelas.jadwal}
                  modul={kelas.modul}
                  linkMeet={kelas.linkMeet}
                  tutorNama={kelas.owner.username}
                  avatar={kelas.owner.avatar}
                  kategori={kelas.kategori}
                />
              ))
            ) : (
              <p className="text-center text-secondary font-bold text-xl mt-[10%]">
                Belum ada kelas ...
              </p>
            )}
          </div>
          {userData?.type !== "pelajar" && (
            <Button
              onClick={() => router.push("/dashboard/courses/create")}
              alternateStyle="absolute"
            >
              <Image width={60} height={60} src={addButton} alt="add logo" />
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default Courses;
