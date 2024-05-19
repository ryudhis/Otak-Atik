import React from "react";
import Registerform from "@/app/components/RegisterForm";
import Image from "next/image";
import logo from "@img/login/logo.png";

const Login = () => {
  return (
    <main className='bg-tertiary'>
      <div className='h-screen w-screen flex flex-col items-center justify-center'>
        <Image className='mb-6' src={logo} alt='logo-image' />
        <Registerform />
        <div className='flex justify-between w-[450px] mt-6'>
          <p className='text-white font-semibold'>Belum punya akun?</p>
          <p className='text-secondary font-semibold'>Daftar Sekarang!</p>
        </div>
      </div>
    </main>
  );
};

export default Login;
