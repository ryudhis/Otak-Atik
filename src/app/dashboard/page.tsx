"use client";
import axiosConfig from "@utils/axios";
import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import Star from "@svg/star.svg";
import Image from "next/image";
import tech from "@svg/tech.svg";

export interface dashboard {
  nama: string;
  id: number;
  owner: ownerItem;
}

export interface ownerItem {
  username: string;
}

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<dashboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const getDashboard = async () => {
    setIsLoading(true);
    try {
      const response = await axiosConfig.get("api/kelas");
      if (response.data.status !== 400) {
      } else {
        alert(response.data.message);
      }
      setDashboard(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getDashboard();
  }, []);

  return (
    <div className="bg-tertiary p-28 h-screen">
      <div className="flex flex-col gap-12">
        <div className="flex gap-[410px]">
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
        {isLoading ? (
          <div className="flex gap-5">
            <div className="p-6 w-56 h-80 border-2 border-primary rounded-3xl animate-pulse flex justify-center items-center">
              <h1 className="text-center animate-pulse">Loading class..</h1>
            </div>
            <div className="p-6 w-56 h-80 border-2 border-primary rounded-3xl animate-pulse flex justify-center items-center">
              <h1 className="text-center animate-pulse">Loading class..</h1>
            </div>
            <div className="p-6 w-56 h-80 border-2 border-primary rounded-3xl animate-pulse flex justify-center items-center">
              <h1 className="text-center animate-pulse">Loading class..</h1>
            </div>
          </div>
        ) : (
          <div className="flex gap-5">
            {dashboard.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-6 w-56 h-80 border-2 border-primary rounded-3xl flex flex-col gap-8"
              >
                <div className="flex justify-between items-center">
                  <h1>{item.owner.username}</h1>
                  <Button alternateStyle="bg-transparent hover:bg-transparent active:bg-transparent">
                    <Image src={Star} alt="" />
                  </Button>
                </div>
                <div className="flex flex-col justify-center items-center gap-4">
                  <Image src={tech} alt="" />
                  <h1 className="text-lg font-bold text-center">{item.nama}</h1>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
