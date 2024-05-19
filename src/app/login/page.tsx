"use client";

import React from "react";
import LoginForm from "../components/LoginForm";
import Image from "next/image";
import logo from "@img/login/logo.png";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  return (
    <main className='bg-tertiary'>
      <div className='h-screen w-screen flex flex-col items-center justify-center'>
        <Image className='mb-6' src={logo} alt='logo-image' />
        <LoginForm />
        <div className='flex justify-between w-[450px] mt-6'>
          <p className='text-white font-semibold'>Belum punya akun?</p>
          <p onClick={()=>{
			router.push('/login/register');
		  }} className='text-secondary font-semibold cursor-pointer hover:opacity-80'>Daftar Sekarang!</p>
        </div>
      </div>
    </main>
  );
};

export default Login;
