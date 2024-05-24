"use client";
import React from "react";
import Button from "@components/Button";
import { useRouter } from "next/navigation";

const DetailForum = () => {
  const router = useRouter();
  return (
    <div className="bg-tertiary p-28 h-screen">
      <Button
        onClick={() => router.back()}
        alternateStyle="text-white bg-tertiary border-secondary border-[2px] py-1 px-3"
      >
        &lt;
      </Button>
    </div>
  );
};

export default DetailForum;
