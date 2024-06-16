/* eslint-disable @next/next/no-img-element */

import React from "react";
import Button from "./Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ComputerScience from "@svg/computerScience.svg";
import Science from "@svg/science.svg";
import Sport from "@svg/sport.svg";
import Design from "@svg/design.svg";
import General from "@svg/general.svg";
import Business from "@svg/business.svg";
import Music from "@svg/music.svg";
import Video from "@svg/video.svg";

const categoryIcons: { [key: string]: any } = {
  "Computer Science": ComputerScience,
  "Science": Science,
  "Sport": Sport,
  "Design": Design,
  "General": General,
  "Business": Business,
  "Music": Music,
  "Video": Video,
};

interface KelasItemProps {
  id: number;
  title: string;
  jadwal: string;
  tutorNama: string;
  avatar: string;
  modul?: string;
  linkMeet: string;
  kategori: string
}

const KelasItem: React.FC<KelasItemProps> = ({
  id,
  title,
  jadwal,
  tutorNama,
  avatar,
  modul,
  linkMeet,
  kategori
}) => {
  const router = useRouter();

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={() => router.push(`/dashboard/courses/${id}`)}
      className='bg-tertiary p-6 flex justify-between items-center border-b-[1px] border-gray-700 hover:opacity-80 cursor-pointer'
    >
      <div className='grid grid-cols-3 items-center gap-10'>
        <div className='flex flex-col gap-2'>
          <p className='font-semibold'>{title}</p>
          <p className='font-bold text-secondary'>{jadwal}</p>
        </div>
        <div className='flex gap-4'>
          {modul ? (
            <a href={modul} download>
              <Button onClick={handleButtonClick} alternateStyle='secondary'>
                Modul
              </Button>
            </a>
          ) : (
            <Button disable alternateStyle='secondary'>
              Modul
            </Button>
          )}
          {linkMeet ? (
            <a href={linkMeet} download>
              <Button onClick={handleButtonClick} alternateStyle='primary'>
                Masuk Meet
              </Button>
            </a>
          ) : (
            <Button disable alternateStyle='primary'>
              Masuk Meet
            </Button>
          )}
        </div>
        <Image width={30} src={categoryIcons[kategori] || General} alt={kategori} /> 
      </div>

      <div className='flex items-center gap-5'>
        <p className='font-semibold'>{tutorNama}</p>
        <img src={avatar} alt='avatar tutor' width={40} height={40}></img>
      </div>
    </div>
  );
};

export default KelasItem;
