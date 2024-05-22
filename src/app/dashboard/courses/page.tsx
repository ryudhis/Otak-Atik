"use client";
import axiosConfig from "@utils/axios";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";

export interface Kelas {
  nama: string;
  id: number;
  owner: OwnerItem;
  kategori: string;
}

export interface OwnerItem {
  username: string;
}

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = Cookies.get("token");
        if (token) {
          const decodedToken = jwtDecode<CustomJwtPayload>(token);
          const userId = decodedToken.id;

          const response = await axios.get(`/api/account/${userId}`);
          console.log(response.data);
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return <div className='bg-tertiary p-28 h-screen flex justify-between'></div>;
};

export default Dashboard;
