/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import Button from "./Button";
import HelpCenter from "@svg/helpcenter.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import cookies from "js-cookie";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
import axiosConfig from "@utils/axios";

export interface userData {
  id: number;
  username: string;
  avatar: string;
  type: string;
}

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

const Header = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<userData | null>(null);

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

  return (
    <div className='h-20 w-full py-8 px-36 flex justify-end items-center fixed top-0 bg-transparent z-10'>
      <div className='flex items-center gap-6 bg-tertiary rounded-full p-3'>
        {!isLoading && userData && (
          <div onClick={()=> router.push(`/dashboard/profile/${userData.id}`)} className='flex items-center gap-3 cursor-pointer hover:opacity-80'>
            <img src={userData?.avatar} alt='avatar' />
            <p>{userData?.username}</p>
          </div>
        )}
        <Button
          onClick={() => {
            router.push("/dashboard/faq");
          }}
          alternateStyle='ghost'
        >
          <Image src={HelpCenter} alt='help center' />
        </Button>
        <Button
          alternateStyle='primary'
          onClick={() => {
            cookies.remove("token");
            router.push("/login");
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Header;
