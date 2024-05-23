import React from "react";
import Button from "@components/Button";

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
      <div className="flex"></div>
    </div>
  );
};

export default Forum;
