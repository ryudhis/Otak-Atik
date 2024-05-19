import React from "react";
import Button from "../components/Button";
import Star from "@svg/star.svg";
import Image from "next/image";
import tech from "@svg/tech.svg";

const Dashboard = () => {
  return (
    <div className="bg-tertiary p-28 h-screen">
      <div className="flex flex-col gap-12">
        <div className="flex gap-80">
          <h1 className="text-4xl font-bold">Kelas Tech</h1>
          <div className="flex gap-4">
            <Button alternateStyle="text-white bg-tertiary border-secondary border-[2px] py-1 px-3">
              &lt;
            </Button>
            <Button alternateStyle="py-1 px-3 border-secondary border-[2px]">
              &gt;
            </Button>
          </div>
        </div>
        <div className="flex">
          <div className="p-6 w-56 h-80 border-2 border-primary rounded-3xl flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <h1>Rizky</h1>
              <Button alternateStyle="bg-transparent hover:bg-transparent active:bg-transparent">
                <Image src={Star} alt="" />
              </Button>
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
              <Image src={tech} alt="" />
              <h1 className="text-lg font-bold text-center">
                Data Visualization dengan Python
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
