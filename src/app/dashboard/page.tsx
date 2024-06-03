/* eslint-disable @next/next/no-img-element */
"use client";
import axiosConfig from "@utils/axios";
import React, { useState, useEffect } from "react";
import Button from "@components/Button";
import Star from "@svg/star.svg";
import Image from "next/image";
import tech from "@svg/tech.svg";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useRouter } from "next/navigation";
import KelasTutor from "../components/KelasTutor";
import Logo from "@img/logo.png";

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
  const [userData, setUserData] = useState<userData>();
  const listKategori = ["Computer Science", "Science", "Sport", "Marketing"];
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

          <div className='flex items-center gap-4 bottom-6 right-6 absolute'>
            <p className='font-semibold'>{userData.username}</p>
            <img src={userData.avatar} alt='avatar tutor'></img>
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
              {kelas
                .filter((item) => item.kategori === currentKelas)
                .slice(0, 3)
                .map((item) => (
                  <div
                    key={item.id}
                    className='p-6 w-56 h-72 border-2 border-primary rounded-3xl flex flex-col gap-8 cursor-pointer'
                    onClick={() => {
                      router.push(`/dashboard/course/${item.id}`);
                    }}
                  >
                    <div className='flex justify-between items-center'>
                      <div className='flex gap-1 items-center justify-center'>
                        <img src={item.owner.avatar} alt='' />
                        <h1>{item.owner.username}</h1>
                      </div>
                      <Button alternateStyle='ghost'>
                        <Image src={Star} alt='' />
                      </Button>
                    </div>
                    <div className='flex flex-col justify-center items-center gap-4'>
                      <Image src={tech} alt='' />
                      <h1 className='text-lg font-bold text-center'>
                        {item.nama}
                      </h1>
                    </div>
                  </div>
                ))}
              {kelas.filter((item) => item.kategori === currentKelas).length ===
                0 &&
                !isLoading && (
                  <h1 className='text-center mx-auto'>
                    Tidak ada kelas pada kategori {currentKelas}
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
            <h1 className='text-center'>Tidak ada kelas favorit</h1>
          ) : (
            <div className='overflow-y-auto max-h-full flex flex-col gap-2 pr-2'>
              {kelas
                .filter((item) => userData?.kelasFavorite.includes(item.id))
                .map((item: any) => (
                  <div
                    key={item.id}
                    className='flex justify-between items-center gap-4'
                  >
                    <div className='flex gap-1 items-center'>
                      <img src={item.owner.avatar} alt='' />
                      <h1>{item.owner.username}</h1>
                    </div>
                    <h1>{item.nama}</h1>
                  </div>
                ))}
            </div>
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
              <h1 className='text-center'>Tidak ada kelas diikuti</h1>
            ) : (
              <div className='flex flex-col gap-2 overflow-y-auto max-h-full'>
                {kelas
                  .filter((item) =>
                    userData?.kelasDiambil.some((kelas) => kelas.id === item.id)
                  )
                  .map((item: any) => (
                    <div key={item.id} className='flex gap-3 items-center'>
                      <img className='w-8 h-8' src={item.owner.avatar} alt='' />
                      <div className='flex flex-col'>
                        <h1 className='text-base font-semibold'>{item.nama}</h1>
                        <h1 className='text-sm'>12 Mei 2024</h1>
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
            <h1 className='text-center'>Tidak ada tutor favorit</h1>
          ) : (
            account
              .filter((item) => userData?.tutorFavorite.includes(item.id))
              .map((item) => (
                <div key={item.id} className='flex flex-col gap-1'>
                  <img className='w-8' src={item.avatar} alt='' />
                  <h1 className='text-sm'>{item.username}</h1>
                </div>
              ))
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
        <div className='flex flex-col justify-center items-center w-full'>
          <Image src={Logo} alt="Logo" />
          <h1 className='mt-2 animate-pulse font-semibold text-secondary text-xl'>
            Loading
          </h1>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
