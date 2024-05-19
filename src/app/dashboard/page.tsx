import React from "react";
import Button from "../components/Button";

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
          <div className="px-36 py-44 border-2 border-primary rounded-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
