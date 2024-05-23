"use client";

import axiosConfig from "@utils/axios";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {jwtDecode, JwtPayload } from "jwt-decode";
import KelasItem from "@/app/components/KelasItem";

export interface Kelas {
  nama: string;
  id: number;
  owner: OwnerItem;
  kategori: string;
  jadwal: string[];
}

export interface OwnerItem {
  username: string;
  avatar: string;
}

export interface UserData {
  id: number;
  kelasDiambil: Kelas[];
  kelasDiampu: Kelas[];
}

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

const Dashboard = () => {
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

  if (isLoading) {
    return <div className="bg-tertiary p-28 h-screen flex justify-center items-center">
      <h1>Loading...</h1>
    </div>;
  }

  if (!userData) {
    return <div className="bg-tertiary p-28 h-screen flex justify-center items-center">
      <h1>Error loading user data</h1>
    </div>;
  }

  return (
    <div className="bg-tertiary p-28 h-screen flex flex-col">
      <h1 className="font-bold text-2xl mb-4">Kelas Aktif</h1>
      <div className="flex flex-col gap-4">
        {userData.kelasDiambil.map((kelas) => (
          <KelasItem
            key={kelas.id}
            title={kelas.nama}
            jadwal={kelas.jadwal[0]}
            tutorNama={kelas.owner.username}
            avatar={kelas.owner.avatar}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
