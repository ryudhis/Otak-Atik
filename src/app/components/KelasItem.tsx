/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Button from "./Button";

interface KelasItemProps {
  title: string;
  jadwal: string;
  tutorNama: string;
  avatar: string;
  modul?: string; // Making modul optional
}

const KelasItem: React.FC<KelasItemProps> = ({
  title,
  jadwal,
  tutorNama,
  avatar,
  modul,
}) => {
  return (
    <div className='bg-tertiary p-6 flex justify-between items-center border-b-[1px] border-gray-700'>
      <div className='grid grid-cols-2 items-center gap-10'>
        <div className='flex flex-col gap-2'>
          <p className='font-semibold'>{title}</p>
          <p className='font-bold text-secondary'>{jadwal}</p>
        </div>
        <div className='flex gap-4'>
          {modul ? (
            <a href={modul} download>
              <Button alternateStyle='secondary'>Modul</Button>
            </a>
          ) : (
            <Button disable alternateStyle='secondary'>Modul</Button>
          )}
          <Button alternateStyle='primary'>Masuk Meet</Button>
        </div>
      </div>

      <div className='flex items-center gap-5'>
        <p className='font-semibold'>{tutorNama}</p>
        <img src={avatar} alt='avatar tutor' width={40} height={40}></img>
      </div>
    </div>
  );
};

export default KelasItem;
