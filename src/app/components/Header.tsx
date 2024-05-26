"use client";
import React from "react";
import Button from "./Button";
import HelpCenter from "@svg/helpcenter.svg";
import Notification from "@svg/notification.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import cookies from "js-cookie";

const Header = () => {
  const router = useRouter();
  return (
    <div className="h-20 w-full py-8 px-36 flex justify-end items-center fixed top-0 bg-tertiary z-10">
      <div className="flex gap-6">
        <Button onClick={()=>{router.push("/dashboard/faq")}} alternateStyle="ghost">
            <Image src={HelpCenter} alt="help center" />
        </Button>
        <Button alternateStyle="ghost">
          <Image src={Notification} alt="notification" />
        </Button>
        <Button
          alternateStyle="primary"
          onClick={() => {
            cookies.remove("token");
            router.push("/login");
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Header;
