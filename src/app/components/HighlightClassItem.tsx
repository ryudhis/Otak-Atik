/* eslint-disable @next/next/no-img-element */
import React from "react";
import Image from "next/image";
import Button from "@components/Button";
import Star from "@svg/star.svg";
import toggledStar from "@svg/Star-toggled.svg";
import ComputerScience from "@svg/ComputerScience.svg";
import Science from "@svg/Science.svg";
import Sport from "@svg/Sport.svg";
import Design from "@svg/Design.svg";
import General from "@svg/General.svg";
import Business from "@svg/Business.svg";
import Music from "@svg/Music.svg";
import Video from "@svg/Video.svg";
import { Kelas, userData } from "@/app/dashboard/page"; // Ensure userData type is imported
import { useRouter } from "next/navigation";

interface HighlightClassItemProps {
  kelas: Kelas[];
  currentKelas: string;
  userData: userData;
  toggleFavorite: Function;
}

const categoryIcons: { [key: string]: any } = {
  "Computer Science": ComputerScience,
  "Science": Science,
  "Sport": Sport,
  "Design": Design,
  "General": General,
  "Business": Business,
  "Music": Music,
  "Video": Video,
};

const HighlightClassItem: React.FC<HighlightClassItemProps> = ({
  kelas,
  currentKelas,
  userData,
  toggleFavorite,
}) => {
  const router = useRouter();

  const handleFavoriteButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    kelasId: number
  ) => {
    // Prevent the click event from propagating to the parent container
    e.stopPropagation();
    toggleFavorite(userData.id, kelasId);
  };

  const handleUserClick = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    e.stopPropagation();
    router.push(`/dashboard/profile/${id}`);
  };

  return (
    <>
      {kelas
        .filter((item) => item.kategori === currentKelas)
        .slice(0, 3)
        .map((item) => (
          <div
            key={item.id}
            className='p-6 w-56 h-72 border-2 border-primary rounded-3xl flex flex-col gap-8 cursor-pointer'
            onClick={() => {
              router.push(`/dashboard/courses/${item.id}`);
            }}
          >
            <div className="flex justify-between items-center">
              <div onClick={(e) => { handleUserClick(e, item.owner.id) }} className="flex gap-1 items-center justify-center hover:opacity-80">
                <img src={item.owner.avatar} alt="" />
                <h1>{item.owner.username}</h1>
              </div>
              <Button
                alternateStyle='ghost'
                onClick={(e) => handleFavoriteButtonClick(e, item.id)}
              >
                <Image
                  src={userData.kelasFavorite.includes(item.id) ? toggledStar : Star}
                  alt=''
                />
              </Button>
            </div>
            <div className='flex flex-col justify-center items-center gap-4'>
              <Image width={80} src={categoryIcons[item.kategori] || General} alt='' />
              <h1 className='text-lg font-bold text-center'>{item.nama}</h1>
            </div>
          </div>
        ))}
    </>
  );
};

export default HighlightClassItem;
