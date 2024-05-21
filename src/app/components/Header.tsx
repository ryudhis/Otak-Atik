"use client";
import React from "react";
import Button from "./Button";
import HelpCenter from "@svg/helpcenter.svg";
import Notification from "@svg/notification.svg";
import Image from "next/image";
import Link from "next/link";
import cookies from "js-cookie";

const Header = () => {
  const token = cookies.get("token")?.valueOf();
  if (token) {
    return (
      <div className="h-20 w-full py-8 px-36 flex justify-end items-center fixed top-0 bg-tertiary z-10">
        <div className="flex gap-6">
          <Button alternateStyle="bg-transparent hover:bg-transparent active:bg-transparent">
            <Image src={HelpCenter} alt="help center" />
          </Button>
          <Button alternateStyle="bg-transparent hover:bg-transparent active:bg-transparent">
            <Image src={Notification} alt="notification" />
          </Button>
          <Button
            alternateStyle="text-tertiary"
            onClick={() => {
              cookies.remove("token");
              window.location.reload();
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="h-20 w-full py-8 px-36 flex justify-end items-center fixed top-0 bg-tertiary z-10">
      <div className="flex gap-6">
        <Button alternateStyle="bg-transparent hover:bg-transparent active:bg-transparent">
          <Image src={HelpCenter} alt="help center" />
        </Button>
        <Button alternateStyle="bg-transparent hover:bg-transparent active:bg-transparent">
          <Image src={Notification} alt="notification" />
        </Button>
        <Link href="/login/register">
          <Button alternateStyle="text-white bg-tertiary border-secondary border-[2px]">
            Daftar
          </Button>
        </Link>
        <Link href="/login">
          <Button alternateStyle="text-tertiary">Masuk</Button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
