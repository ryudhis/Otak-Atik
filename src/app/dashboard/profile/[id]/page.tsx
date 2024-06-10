/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import axiosConfig from "@utils/axios";
import Image from "next/image";

export interface Kelas {
  nama: string;
  jadwal: string;
  id: number;
  owner: account;
  kategori: string;
  siswa: userData[];
}

export interface userData {
  id: number;
  username: string;
  avatar: string;
  email: string;
  type: string;
  kelasFavorite: number[];
  kelasDiambil: Kelas[];
  kelasDiampu: Kelas[];
  tutorFavorite: number[];
}

export interface account {
  id: number;
  username: string;
  avatar: string;
  email: string;
}

const DetailUser = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState<account[]>([]);
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [userData, setUserData] = useState<userData | undefined>(undefined);

  const getKelas = async () => {
    setIsLoading(true);
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

  const getAllAcount = async () => {
    try {
      const response = await axiosConfig.get("api/account");
      if (response.data.status !== 400) {
        setAccount(response.data.data);
        setUserData(
          response.data.data.find((item: userData) => item.id === parseInt(id))
        );
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getKelas();
    getAllAcount();
  }, []);
  return (
    <div className="mt-20 bg-tertiary p-28 h-screen flex flex-col items-center">
      <div className="flex flex-col items-center justify-center">
        <img className="w-20 mb-4" src={userData?.avatar} />
        <h1 className="font-bold text-2xl">
          {userData?.username} ({userData?.type})
        </h1>
        <h1>{userData?.email}</h1>
      </div>
      {userData?.type === "tutor" ? (
        <div className="mt-10 p-6 w-2/3 h-80 border-2 border-primary rounded-3xl flex flex-col gap-8">
          <h1 className="font-semibold text-2xl">Kelas Diampu</h1>
        </div>
      ) : (
        <div>
          <div></div>
        </div>
      )}
    </div>
  );
};

export default DetailUser;
