/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import ComputerScience from "@svg/ComputerScience.svg";
import Science from "@svg/Science.svg";
import Sport from "@svg/Sport.svg";
import Design from "@svg/Design.svg";
import General from "@svg/General.svg";
import Business from "@svg/Business.svg";
import Music from "@svg/Music.svg";
import Video from "@svg/Video.svg";

interface KelasItemProps {
  id: number;
  title: string;
  jadwal: string;
  avatar?: string;
  kategori: string;
}

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

const ProfileClassItem: React.FC<KelasItemProps> = ({
  id,
  title,
  jadwal,
  avatar,
  kategori,
}) => {
  return (
    <Link href={`/dashboard/courses/${id}`}>
      <div className="bg-tertiary p-2 px-1 flex justify-between items-center border-b-[1px] border-gray-700 cursor-pointer hover:opacity-80 transition">
        <div className="flex items-center gap-3">
          {avatar && <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full" />}
          <div className="flex flex-col">
            <p className="font-semibold">{title}</p>
            <p>{jadwal}</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Image width={30} src={categoryIcons[kategori] || General} alt={kategori} />
        </div>
      </div>
    </Link>
  );
};

export default ProfileClassItem;
