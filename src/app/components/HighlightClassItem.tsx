import React from "react";
import Image from "next/image";
import Button from "@components/Button";
import Star from "@svg/star.svg";
import tech from "@svg/tech.svg";
import { Kelas } from "@/app/dashboard/page";
import { useRouter } from "next/navigation";

interface HighlightClassItemProps {
  kelas: Kelas[];
  currentKelas: string;
}

const HighlightClassItem: React.FC<HighlightClassItemProps> = ({
  kelas,
  currentKelas,
}) => {
  const router = useRouter();
  return (
    <>
      {kelas
        .filter((item) => item.kategori === currentKelas)
        .slice(0, 3)
        .map((item) => (
          <div
            key={item.id}
            className="p-6 w-56 h-72 border-2 border-primary rounded-3xl flex flex-col gap-8 cursor-pointer"
            onClick={() => {
              router.push(`/dashboard/course/${item.id}`);
            }}
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-1 items-center justify-center">
                <img src={item.owner.avatar} alt="" />
                <h1>{item.owner.username}</h1>
              </div>
              <Button alternateStyle="ghost">
                <Image src={Star} alt="" />
              </Button>
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
              <Image src={tech} alt="" />
              <h1 className="text-lg font-bold text-center">{item.nama}</h1>
            </div>
          </div>
        ))}
    </>
  );
};

export default HighlightClassItem;
