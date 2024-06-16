/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Kelas, userData } from "@/app/dashboard/page";
import { useRouter } from "next/navigation";

interface FavouriteClassItemProps {
  kelas: Kelas[];
  userData: userData;
}

const FavouriteClassItem: React.FC<FavouriteClassItemProps> = ({
  kelas,
  userData,
}) => {
  const router = useRouter();

  const handleUserClick = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    e.stopPropagation();
    router.push(`/dashboard/courses/${id}`);
  };

  return (
    <div className="overflow-y-auto max-h-full flex flex-col gap-2 pr-2">
      {kelas
        .filter((item) => userData?.kelasFavorite.includes(item.id))
        .map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center gap-4 hover:opacity-80 cursor-pointer"
            onClick={(e) => handleUserClick(e, item.id)}
          >
            <div className="flex gap-1 items-center">
              <img src={item.owner.avatar} alt={item.owner.username} />
              <h1>{item.owner.username}</h1>
            </div>
            <h1>{item.nama}</h1>
          </div>
        ))}
    </div>
  );
};

export default FavouriteClassItem;
