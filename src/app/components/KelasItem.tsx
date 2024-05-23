/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import Button from "./Button";

interface KelasItemProps {
  title: string;
  jadwal: string;
  tutorNama: string;
}

const KelasItem: React.FC<KelasItemProps> = ({ title, jadwal, tutorNama }) => {

  return (
    <div className='bg-tertiary p-6 flex justify-between items-center border-b-[1px] border-gray-700'>
      <div className='flex gap-10 items-center'>
        <div className='flex flex-col'>
          <p className='font-semibold'>{title}</p>
          <p>{jadwal}</p>
        </div>
      </div>
      <div className='flex gap-4'>
        <Button alternateStyle='bg-transparent border-[2px] border-secondary active:bg-secondary hover:bg-secondary w-[120px] h-[40px] text-sm hover:text-slate-900'>
          Modul
        </Button>
        <Button alternateStyle='hover:bg-transparent active:bg-transparent hover:opacity-80 border-[2px] border-secondary w-[120px] h-[40px] text-sm text-slate-900 hover:text-white'>
          Masuk Meet
        </Button>
      </div>
      <p className='font-semibold'>{tutorNama}</p>
      <img src={`https://ui-avatars.com/api/?name=${tutorNama}`} alt="avatar tutor" width={40} height={40}></img>
    </div>
  );
};

export default KelasItem;
