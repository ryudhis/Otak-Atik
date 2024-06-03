/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface KelastTutorProps {
  title: string;
  jadwal: string;
  siswa: number;
  detail: string;
}

const KelastTutor: React.FC<KelastTutorProps> = ({
  title,
  jadwal,
  siswa,
  detail,
}) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(detail)}
      className='bg-tertiary py-6 px-1 flex justify-between items-center border-b-[1px] border-gray-700 hover:opacity-80 cursor-pointer'
    >
      <div className='flex flex-col gap-2'>
        <p className='font-semibold'>{title}</p>
        <p className='font-bold text-secondary'>{jadwal}</p>
      </div>

      <div className='flex flex-col gap-2'>
        <p className='font-semibold'>Siswa Daftar</p>
        <p className='font-bold text-secondary self-end'>{siswa}</p>
      </div>
    </div>
  );
};

export default KelastTutor;
