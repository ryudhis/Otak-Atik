"use client";
import React from "react";
import Image from "next/image";
import logo from "@img/logo.png";
import menuSolid from "@svg/menu.svg";
import menu from "@svg/menu-2.svg";
import courseSolid from "@svg/course.svg";
import course from "@svg/course-2.svg";
import messageSolid from "@svg/message.svg";
import message from "@svg/message-2.svg";
import settingSolid from "@svg/settings.svg";
import setting from "@svg/settings-2.svg";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="w-20 h-screen py-8 bg-tertiary border-r-[3px] border-r-primary flex flex-col justify-between items-center fixed">
      <Link href="/dashboard">
        <Image src={logo} alt="logo image" />
      </Link>
      <div className="flex flex-col gap-6">
        <Link href="/dashboard">
          <Image
            className={
              pathname === "/dashboard"
                ? `scale-110`
                : `scale-100 hover:scale-110 active:scale-100 transition-all duration-200 ease-in-out`
            }
            src={pathname === "/dashboard" ? menuSolid : menu}
            alt="menu image"
          />
        </Link>
        <Link href="/dashboard/courses">
          <Image
            className={
              pathname === "/dashboard/courses"
                ? `scale-110`
                : `scale-100 hover:scale-110 active:scale-100 transition-all duration-200 ease-in-out`
            }
            src={pathname === "/dashboard/courses" ? courseSolid : course}
            alt="course image"
          />
        </Link>
        <Link href="/dashboard/forum">
          <Image
            className={
              pathname === "/dashboard/forum"
                ? `scale-110`
                : `scale-100 hover:scale-110 active:scale-100 transition-all duration-200 ease-in-out`
            }
            src={pathname === "/dashboard/forum" ? messageSolid : message}
            alt="forum image"
          />
        </Link>
        <Link href="/dashboard/profile">
          <Image
            className={
              pathname === "/dashboard/profile"
                ? `scale-110`
                : `scale-100 hover:scale-110 active:scale-100 transition-all duration-200 ease-in-out`
            }
            src={pathname === "/dashboard/profile" ? settingSolid : setting}
            alt="setting image"
          />
        </Link>
      </div>
      <h1 className="text-secondary whitespace-pre-line text-center font-bold text-xl">
        <div>Otak</div>
        <div>Atik</div>
      </h1>
    </div>
  );
};

export default Sidebar;
