"use client"

import axiosConfig from "@utils/axios";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@img/logo.png";
import SearchClassItem from "@/app/components/SearchClassItem";

export interface Kelas {
  nama: string;
  id: number;
  owner: OwnerItem;
  kategori: string;
  jadwal: string;
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

const Search = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");

  const kategori = [
    "General",
    "Computer Science",
    "Science",
    "Sport",
    "Marketing",
  ];

  const getAllKelas = async () => {
    try {
      const response = await axiosConfig.get("api/kelas");
      if (response.data.status !== 400) {
        setKelas(response.data.data);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredKelas = kelas
    .filter((item) =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) =>
      selectedKategori ? item.kategori === selectedKategori : true
    )
    .reverse();

  useEffect(() => {
    getAllKelas();
  }, []);

  return (
    <div className="bg-tertiary p-28 h-screen flex flex-col">
      <div className="flex justify-between">
        <h1 className="font-bold text-2xl mb-4">Cari Kelas</h1>
        <div className="flex gap-6">
          <select
            value={selectedKategori}
            onChange={(e) => setSelectedKategori(e.target.value)}
            className="bg-primary rounded-xl w-50 px-2 placeholder:font-bold"
          >
            <option value="">Pilih Topik</option>
            {kategori.map((kat) => (
              <option key={kat} value={kat}>
                {kat}
              </option>
            ))}
          </select>
          <input
            className="bg-primary rounded-xl min-w-40 px-6 placeholder:font-bold"
            placeholder="Cari judul diskusi"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="h-screen flex flex-col justify-center items-center w-full gap-4">
          <Image className="scale-110" src={Logo} alt="Logo" />
          <h1 className="text-center text-secondary font-bold text-2xl animate-pulse">
            Loading kelas...
          </h1>
        </div>
      ) : (
        <>
          {filteredKelas.length === 0 ? (
            <div className="mt-8 flex justify-center items-center h-[80vh]">
              <h1 className="text-secondary font-bold text-xl">
                Belum ada kelas
              </h1>
            </div>
          ) : (
            <div className="mt-8 flex flex-col gap-4 h-[80vh] overflow-auto">
              {filteredKelas.map((kelas) => (
                <SearchClassItem
                  key={kelas.id}
                  id={kelas.id}
                  title={kelas.nama}
                  jadwal={kelas.jadwal}
                  tutorNama={kelas.owner.username}
                  avatar={kelas.owner.avatar}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
