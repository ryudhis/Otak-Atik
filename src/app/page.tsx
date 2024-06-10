"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect } from "react";
import Image from "next/image";
import Logo from "@img/logo.png";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="bg-tertiary p-28 h-screen flex flex-col gap-3 justify-center items-center">
      <Image src={Logo} alt="Logo" />
      <h1 className="text-center text-secondary font-bold text-2xl animate-pulse">
        Please wait...
      </h1>
    </div>
  );
};

export default Page;
