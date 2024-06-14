/* eslint-disable @next/next/no-img-element */
"use client";
import axiosConfig from "@utils/axios";
import React, { useState, useEffect } from "react";
import Button from "@components/Button";
import Image from "next/image";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import KelasTutor from "../components/KelasTutor";
import Logo from "@img/logo.png";
import HighlightClassItem from "../components/HighlightClassItem";
import FavouriteClassItem from "../components/FavouriteClassItem";

export interface Kelas {
  nama: string;
  jadwal: string;
  id: number;
  owner: account;
  kategori: string;
  siswa: userData[];
}

export interface userData {
  id: number;
  username: string;
  avatar: string;
  type: string;
  kelasFavorite: number[];
  kelasDiambil: Kelas[];
  kelasDiampu: Kelas[];
  tutorFavorite: number[];
}

export interface account {
  id: number;
  username: string;
  avatar: string;
}

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

const Dashboard = () => {
  const router = useRouter();
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [account, setAccount] = useState<account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<userData>({} as userData);
  const listKategori = [
    "General",
    "Computer Science",
    "Science",
    "Sport",
    "Design",
    "Business",
    "Music",
    "Video",
  ];
  const [currentKelas, setCurrentKelas] = useState("Computer Science");

  const switchKelas = (direction: string) => {
    const currentIndex = listKategori.indexOf(currentKelas);
    let newIndex;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % listKategori.length;
    } else if (direction === "prev") {
      newIndex = (currentIndex - 1 + listKategori.length) % listKategori.length;
    } else {
      newIndex = 0;
    }

    setCurrentKelas(listKategori[newIndex]);
  };

  const getKelas = async () => {
    setIsLoading(true);
    try {
      const response = await axiosConfig.get("api/kelas");
      if (response.data.status !== 400) {
        setKelas(response.data.data);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllAcount = async () => {
    try {
      const response = await axiosConfig.get("api/account");
      if (response.data.status !== 400) {
        setAccount(response.data.data);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleKelasFavorite = async (userId: number, kelasId: number) => {
    const data = { userId, kelasId };

    let updatedKelasFavorite;

    if (userData.kelasFavorite.includes(kelasId)) {
      updatedKelasFavorite = userData.kelasFavorite.filter(
        (kelas) => kelas !== kelasId
      );
    } else {
      updatedKelasFavorite = [kelasId, ...userData.kelasFavorite];
    }

    setUserData((prevUserData) => ({
      ...prevUserData,
      kelasFavorite: updatedKelasFavorite,
    }));

    try {
      const response = await axiosConfig.patch(
        "api/account/kelasFavorite",
        data
      );
      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        kelasFavorite: userData.kelasFavorite.includes(kelasId)
          ? [kelasId, ...prevUserData.kelasFavorite]
          : prevUserData.kelasFavorite.filter((kelas) => kelas !== kelasId),
      }));

      toast.error("Gagal Favorite Kelas");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          const decodedToken = jwtDecode<CustomJwtPayload>(token);
          const userId = decodedToken.id;

          const response = await axiosConfig.get(`/api/account/${userId}`);
          setUserData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    getKelas();
    getAllAcount();
  }, [currentKelas]);

  const renderTutorDashboard = () => (
    <div className='flex flex-col p-8 border-solid border-[2px] rounded-2xl border-primary shadow-box-kelas h-full w-full relative'>
      <h1 className='font-bold text-2xl mb-4'>Kelas Saya</h1>

      {!isLoading && userData ? (
        <>
          <div className='flex flex-col'>
            {userData.kelasDiampu.map((kelas) => (
              <KelasTutor
                detail={`/dashboard/course/${kelas.id}`}
                title={kelas.nama}
                jadwal={kelas.jadwal}
                siswa={kelas.siswa.length}
                key={kelas.id}
              />
            ))}
            {userData.kelasDiampu.length === 0 && (
              <h1 className='text-secondary text-center mx-auto self-center mt-[10%] font-semibold'>
                Belum Ada Kelas Diampu ...
              </h1>
            )}
          </div>

          <div
            onClick={() => router.push(`/dashboard/profile/${userData.id}`)}
            className='flex items-center gap-4 bottom-6 right-6 absolute hover:opacity-80 cursor-pointer z-10'
          >
            <p className='font-semibold'>{userData.username}</p>
            <img width={45} src={userData.avatar} alt='avatar tutor'></img>
          </div>
        </>
      ) : (
        <h1 className='h-[full] mt-[20%] text-center animate-pulse'>
          Loading Data Kelas Diampu ...
        </h1>
      )}
    </div>
  );

  const renderPelajarDashboard = () => (
    <>
      <div className='flex flex-col gap-10'>
        <div className='flex flex-col gap-12 min-w-[600px] max-w-[600px] min-h-[380px] max-h-[380px]'>
          <div className='flex justify-between'>
            <h1 className='text-4xl font-bold'>Kelas {currentKelas}</h1>
            <div className='flex gap-4'>
              <Button
                onClick={() => {
                  switchKelas("prev");
                }}
                alternateStyle='secondary'
              >
                &lt;
              </Button>
              <Button
                onClick={() => switchKelas("next")}
                alternateStyle='primary'
              >
                &gt;
              </Button>
            </div>
          </div>
          {!isLoading ? (
            <div className='flex gap-5'>
              <HighlightClassItem
                userData={userData}
                kelas={kelas}
                currentKelas={currentKelas}
                toggleFavorite={toggleKelasFavorite}
              />
              {kelas.filter((item) => item.kategori === currentKelas).length ===
                0 &&
                !isLoading && (
                  <h1 className='text-center mx-auto'>
                    Belum ada kelas pada kategori {currentKelas}
                  </h1>
                )}
            </div>
          ) : (
            <h1 className='text-center animate-pulse'>
              Loading kelas kategori {currentKelas}...
            </h1>
          )}
        </div>
        <div className='p-6 w-[600px] h-80 border-2 border-primary rounded-3xl flex flex-col gap-8'>
          <h1 className='text-3xl font-bold'>Kelas Favorit</h1>
          {isLoading ? (
            <h1 className='text-center animate-pulse my-auto'>
              Loading Kelas Favorit...
            </h1>
          ) : userData?.kelasFavorite?.length === 0 ? (
            <h1 className='text-center'>Belum ada kelas favorit</h1>
          ) : (
            <FavouriteClassItem kelas={kelas} userData={userData} />
          )}
        </div>
      </div>
      <div className='flex flex-col gap-6'>
        <div className='p-6 w-[420px] h-[588px] border-2 border-primary rounded-3xl flex flex-col gap-6'>
          <h1 className='text-2xl font-bold'>Performa Saya</h1>
          <h1 className='text-lg font-semibold'>Kelas diikuti</h1>
          <div className='min-h-[300px] max-h-[300px]'>
            {isLoading ? (
              <h1 className='text-center animate-pulse my-auto'>
                Loading Kelas Diikuti...
              </h1>
            ) : userData?.kelasDiambil?.length === 0 ? (
              <h1 className='text-center'>Belum ada kelas diikuti</h1>
            ) : (
              <div className='flex flex-col gap-2 overflow-y-auto max-h-full'>
                {userData?.kelasDiambil.map((kelas) => (
                  <div
                    onClick={() =>
                      router.push(`/dashboard/courses/${kelas.id}`)
                    }
                    key={kelas.id}
                    className='flex gap-3 items-center hover:opacity-80 cursor-pointer'
                  >
                    <img className='w-8 h-8' src={kelas.owner.avatar} alt='' />
                    <div className='flex flex-col'>
                      <h1 className='text-base font-semibold'>{kelas.nama}</h1>
                      <h1 className='text-sm'>{kelas.jadwal}</h1>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <h1 className='text-lg font-semibold'>Tutor Favorit</h1>
          {isLoading ? (
            <h1 className='text-center animate-pulse my-auto'>
              Loading Tutor Favorit...
            </h1>
          ) : userData?.tutorFavorite?.length === 0 ? (
            <h1 className='text-center'>Belum ada tutor favorit</h1>
          ) : (
            <div className='flex gap-5 overflow-x-auto overflow-y-hidden flex-nowrap'>
              {account
                .filter((account) =>
                  userData?.tutorFavorite.includes(account.id)
                )
                .map((tutor) => (
                  <div onClick={()=> router.push(`/dashboard/profile/${tutor.id}`)} key={tutor.id} className='flex flex-col items-center cursor-pointer hover:opacity-80'>
                    <img
                      className='w-8 h-8 rounded-full'
                      src={tutor.avatar}
                      alt={tutor.username}
                    />
                    <h1 className='text-sm'>
                      {tutor.username.length > 5
                        ? `${tutor.username.substring(0, 5)}..`
                        : tutor.username}
                    </h1>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className='bg-primary p-6 w-[420px] h-[120px] rounded-3xl flex justify-between'>
          <div className='flex flex-col justify-center items-center'>
            <h1 className='text-xl font-bold'>Kelas Selanjutnya:</h1>
            <h1 className='text-xl font-semibold'>React Expert</h1>
          </div>
          <div className='flex flex-col justify-center'>
            <h1 className='text-lg font-bold text-secondary'>Senin, 13 Mei</h1>
            <h1 className='text-lg font-semibold'>13.00 - 15.00</h1>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className='bg-tertiary p-28 h-screen flex justify-between'>
      {userData && userData.type === "tutor" ? (
        renderTutorDashboard()
      ) : userData && userData.type === "pelajar" ? (
        renderPelajarDashboard()
      ) : (
        <div className='flex flex-col justify-center items-center w-full gap-4'>
          <Image className='scale-110' src={Logo} alt='Logo' />
          <h1 className='text-center text-secondary font-bold text-2xl animate-pulse'>
            Loading dashboard...
          </h1>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
