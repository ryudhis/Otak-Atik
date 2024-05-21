"use client";
import axiosConfig from "@utils/axios";
import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import Star from "@svg/star.svg";
import Image from "next/image";
import tech from "@svg/tech.svg";

export interface kelas {
  nama: string;
  id: number;
  owner: ownerItem;
  kategori: string;
}

export interface ownerItem {
  username: string;
}

// export interface account {
//   username: string;
//   email: string;
//   password: string;
// }

const Dashboard = () => {
  const [kelas, setKelas] = useState<kelas[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const listKategori = ["Computer Science", "Science", "Sport"];
  const [currentKelas, setCurrentKelas] = useState("Computer Science");
  const switchKelas = (direction: string) => {
    const currentIndex = listKategori.indexOf(currentKelas);
    let newIndex;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % listKategori.length;
    } else if (direction === "prev") {
      newIndex = (currentIndex - 1 + listKategori.length) % listKategori.length;
    } else {
      newIndex = 0; // Set a default value for newIndex
    }

    setCurrentKelas(listKategori[newIndex]); // Update state variable
  };

  const getKelas = async () => {
    setIsLoading(true);
    try {
      const response = await axiosConfig.get("api/kelas");
      if (response.data.status !== 400) {
      } else {
        alert(response.data.message);
      }
      setKelas(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getKelas();
  }, [currentKelas]);

  return (
    <div className="bg-tertiary p-28 h-screen flex flex-col gap-10">
      <div className="flex flex-col gap-12 min-w-[600px] max-w-[600px] min-h-[380px] max-h-[380px]">
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold">Kelas {currentKelas}</h1>
          <div className="flex gap-4">
            <Button
              onClick={() => switchKelas("prev")}
              alternateStyle="text-white bg-tertiary border-secondary border-[2px] py-1 px-3"
            >
              &lt;
            </Button>
            <Button
              onClick={() => switchKelas("next")}
              alternateStyle="py-1 px-3 border-secondary border-[2px]"
            >
              &gt;
            </Button>
          </div>
        </div>
        {!isLoading ? (
          <div className="flex gap-5">
            {kelas
              .filter((item) => item.kategori === currentKelas)
              .slice(0, 3)
              .map((item) => (
                <div
                  key={item.id}
                  className="p-6 w-56 h-72 border-2 border-primary rounded-3xl flex flex-col gap-8"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1 items-center justify-center">
                      <Image src={tech} alt="" width={20} />
                      <h1>{item.owner.username}</h1>
                    </div>
                    <Button alternateStyle="bg-transparent hover:bg-transparent active:bg-transparent px-0 py-0">
                      <Image src={Star} alt="" />
                    </Button>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-4">
                    <Image src={tech} alt="" />
                    <h1 className="text-lg font-bold text-center">
                      {item.nama}
                    </h1>
                  </div>
                </div>
              ))}
            {kelas.filter((item) => item.kategori === currentKelas).length ===
              0 &&
              !isLoading && (
                <h1 className="text-center">
                  Tidak ada kelas pada kategori {currentKelas}
                </h1>
              )}
          </div>
        ) : (
          <div className="flex gap-5">
            <div className="p-6 w-56 h-80 border-2 border-primary rounded-3xl animate-pulse flex justify-center items-center">
              <h1 className="text-center animate-pulse">Loading class..</h1>
            </div>
            <div className="p-6 w-56 h-80 border-2 border-primary rounded-3xl animate-pulse flex justify-center items-center">
              <h1 className="text-center animate-pulse">Loading class..</h1>
            </div>
            <div className="p-6 w-56 h-80 border-2 border-primary rounded-3xl animate-pulse flex justify-center items-center">
              <h1 className="text-center animate-pulse">Loading class..</h1>
            </div>
          </div>
        )}
      </div>
      <div className="p-6 w-[600px] h-80 border-2 border-primary rounded-3xl flex flex-col gap-8">
        <h1 className="text-3xl font-bold">Kelas Favorit</h1>
        <div className="flex py-2 justify-between">
          <h1 className="font-bold text-lg">Kelas 1</h1>
          <div className="flex justify-center items-center gap-2">
            <h1 className="text-lg">Jarwo</h1>
            <Image src={tech} alt="" width={32}></Image>
          </div>
        </div>
        <div className="flex py-2 justify-between">
          <h1 className="font-bold text-lg">Kelas 1</h1>
          <div className="flex justify-center items-center gap-2">
            <h1 className="text-lg">Jarwo</h1>
            <Image src={tech} alt="" width={32}></Image>
          </div>
        </div>
        <div className="flex py-2 justify-between">
          <h1 className="font-bold text-lg">Kelas 1</h1>
          <div className="flex justify-center items-center gap-2">
            <h1 className="text-lg">Jarwo</h1>
            <Image src={tech} alt="" width={32}></Image>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
