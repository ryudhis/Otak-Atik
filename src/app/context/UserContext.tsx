"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
import axiosConfig from "@utils/axios";

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
}

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

interface UserContextType {
  userData: userData | null;
  isLoading: boolean;
  setUserData: React.Dispatch<React.SetStateAction<userData | null>>;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<userData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
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

  const refreshUserData = async () => {
    await fetchUserData();
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, isLoading, setUserData, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
