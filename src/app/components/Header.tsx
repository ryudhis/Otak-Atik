/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import Button from "./Button";
import HelpCenter from "@svg/helpCenter.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import cookies from "js-cookie";
import { useUser } from "@/app/context/UserContext";

const Header = () => {
  const router = useRouter();
  const { userData, isLoading } = useUser();

  return (
    <div className='h-20 w-full py-8 px-36 flex justify-end items-center fixed top-0 bg-transparent z-10'>
      <div 
        className='flex items-center gap-6 bg-tertiary rounded-full p-3'
        data-aos="fade-down"
        data-aos-duration="800"
      >
        {!isLoading && userData && (
          <div onClick={()=> router.push(`/dashboard/profile/${userData.id}`)} className='flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-200'>
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
