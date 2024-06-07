/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";

interface KelasItemProps {
  id: number;
  title: string;
  jadwal: string;
  tutorNama: string;
  avatar: string;
}

const SearchClassItem: React.FC<KelasItemProps> = ({
  id,
  title,
  jadwal,
  tutorNama,
  avatar,
}) => {
  return (
    <Link href={`/dashboard/course/${id}`}>
      <div className="bg-tertiary p-6 flex justify-between items-center border-b-[1px] border-gray-700 cursor-pointer hover:opacity-80 transition">
        <div className="grid grid-cols-2 items-center gap-10">
          <div className="flex flex-col gap-2">
            <p className="font-semibold">{title}</p>
            <p className="font-bold text-secondary">{jadwal}</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <p className="font-semibold">{tutorNama}</p>
          <img src={avatar} alt="avatar tutor" width={40} height={40}></img>
        </div>
      </div>
    </Link>
  );
};

export default SearchClassItem;
