"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import axiosConfig from '../../utils/axios';
import Cookies from 'js-cookie';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import UsernameIcon from '@img/login/username.png';
import PasswordIcon from '@img/login/password.png';
import Image from 'next/image';

const formSchema = z.object({
  username: z.string().min(6).max(50),
  password: z.string().min(6).max(50),
});

const LoginForm = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const signIn = async (values:any) => {
    try {
      const response = await axiosConfig.post('api/login', values);
      if (response.data.status !== 400) {
        Cookies.set('token', response.data.token, { expires: 1 });
        alert('Berhasil Login');
        router.push('/dashboard');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('Gagal Login');
    }
    reset();
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-primary rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4 text-white">Masuk</h2>
      <form onSubmit={handleSubmit(signIn)} className="space-y-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Image src={UsernameIcon} alt="Username Icon" className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Username"
            {...register('username', { required: true })}
            className={`pl-10 mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary ${errors.username ? 'border-red-500' : ''}`}
          />
          {errors.username && <span className="text-red-600 text-sm">This field is required</span>}
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Image src={PasswordIcon} alt="Password Icon" className="h-5 w-5" />
          </div>
          <input
            type="password"
            placeholder="Password"
            {...register('password', { required: true })}
            className={`pl-10 mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-secondary focus:border-secondary ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && <span className="text-red-600 text-sm">This field is required</span>}
        </div>

        <button
          type="submit"
          className="w-full bg-secondary text-slate-800 font-bold py-2 px-4 border border-transparent rounded-md shadow-sm hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Masuk
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
