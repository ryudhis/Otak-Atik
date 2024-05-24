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
  return (
    <div className="h-20 w-full py-8 px-36 flex justify-end items-center fixed top-0 bg-tertiary z-10">
      <div className="flex gap-6">
        <Button alternateStyle="ghost">
          <Link href="/dashboard/faq">
            <Image src={HelpCenter} alt="help center" />
          </Link>
        </Button>
        <Button alternateStyle="ghost">
          <Image src={Notification} alt="notification" />
        </Button>
        <Button
          alternateStyle="primary"
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
};

export default Header;
