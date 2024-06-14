/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import computerScience from "@svg/tech.svg";

interface KelasItemProps {
  id: number;
  title: string;
  jadwal: string;
  avatar?: string;
}

const ProfileClassItem: React.FC<KelasItemProps> = ({
  id,
  title,
  jadwal,
  avatar,
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
          <Image width={40} height={40} src={computerScience} alt="computerScience" />
        </div>
      </div>
    </Link>
  );
};

export default ProfileClassItem;
