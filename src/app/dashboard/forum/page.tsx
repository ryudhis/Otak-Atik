import React from "react";
import Button from "@components/Button";
import Image from "next/image";
import tech from "@svg/tech.svg";

const Forum = () => {
  return (
    <div className="bg-tertiary p-28 h-screen">
      <div className="flex justify-between">
        <div className="flex gap-6 justify-center">
          <h1 className="text-2xl font-bold">Forum Diskusi</h1>
          <Button alternateStyle="text-tertiary">Buat Diskusi</Button>
        </div>
        <div className="flex gap-6">
          <Button alternateStyle="bg-tertiary border-2 border-secondary text-secondary hover:text-tertiary">
            Pilih Topik
          </Button>
          <input
            className="bg-primary rounded-xl min-w-40 px-6 placeholder:font-bold"
            placeholder="Cari judul diskusi"
            type="text"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Image src={tech} alt="" width={32} />
          <h1>Jerome Bell</h1>
          <h1>1 Jam yang lalu</h1>
        </div>
        <p>Aku adalah anak gembala</p>
        <div></div>
      </div>
    </div>
  );
};

export default Forum;
