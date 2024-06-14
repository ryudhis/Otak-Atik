/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import axiosConfig from "@utils/axios";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";
import ProfileClassItem from "@/app/components/ProfileClassItem";

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
  email: string;
  type: string;
  kelasFavorite: number[];
  kelasDiambil: Kelas[];
  kelasDiampu: Kelas[];
  tutorFavorite: number[];
}

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export interface account {
  id: number;
  username: string;
  avatar: string;
  email: string;
}

const DetailUser = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<account[]>([]);
  const [userData, setUserData] = useState<userData | undefined>(undefined);

  useEffect(() => {
    const getAllAccount = async () => {
      try {
        const response = await axiosConfig.get("api/account");
        if (response.data.status !== 400) {
          setAccounts(response.data.data);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchProfileData = async () => {
      try {
        const response = await axiosConfig.get(`/api/account/${id}`);
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getAllAccount();
    fetchProfileData();
  }, [id]);

  const tutorFavorit = accounts.filter((account) =>
    userData?.tutorFavorite.includes(account.id)
  );

  return (
    <>
      {isLoading ? (
        <div className='mt-[25%] h-screen'>
          <h1 className='text-center text-secondary font-bold text-2xl animate-pulse'>
            Loading data profile...
          </h1>
        </div>
      ) : (
        <div className='bg-tertiary p-28 h-screen flex flex-col items-center'>
          <div className='flex flex-col items-center justify-center'>
            <img className='w-16 mb-4' src={userData?.avatar} alt='avatar' />
            <h1 className='font-bold text-2xl'>
              {userData?.username} ({userData?.type})
            </h1>
            <h1>{userData?.email}</h1>
          </div>
          <div className='mt-10 p-6 w-2/3 h-[500px] overflow-auto border-2 border-primary rounded-3xl flex flex-col gap-8 shadow-box-kelas'>
            {userData?.type === "tutor" ? (
              <>
                <h1 className='font-semibold text-2xl'>Kelas Diampu</h1>
                {userData?.kelasDiampu && userData.kelasDiampu.length > 0 ? (
                  userData.kelasDiampu.map((kelas) => (
                    <ProfileClassItem
                      key={kelas.id}
                      id={kelas.id}
                      title={kelas.nama}
                      jadwal={kelas.jadwal}
                      kategori={kelas.kategori}
                    />
                  ))
                ) : (
                  <p>Belum ada Kelas</p>
                )}
              </>
            ) : (
              <>
                <h1 className='font-semibold text-2xl'>Kelas Diambil</h1>
                {userData?.kelasDiambil && userData.kelasDiambil.length > 0 ? (
                  userData.kelasDiambil.map((kelas) => (
                    <ProfileClassItem
                      key={kelas.id}
                      id={kelas.id}
                      title={kelas.nama}
                      jadwal={kelas.jadwal}
                      avatar={kelas.owner.avatar}
                    />
                  ))
                ) : (
                  <p>Belum ada</p>
                )}
              </>
            )}
          </div>
          <div className='mt-8 p-6 w-1/3 h-[200px] border-2 border-primary rounded-3xl shadow-box-kelas mr-[33%]'>
            <h1 className='font-semibold text-2xl'>Tutor Favorit</h1>
            <div className='flex mt-5 gap-5 overflow-x-auto flex-nowrap'>
              {tutorFavorit.length > 0 ? (
                tutorFavorit.map((tutor) => (
                  <div key={tutor.id} className='flex flex-col items-center'>
                    <img
                      className='w-9 rounded-full'
                      src={tutor.avatar}
                      alt={tutor.username}
                    />
                    <span>
                      {tutor.username.length > 5
                        ? `${tutor.username.substring(0, 5)}..`
                        : tutor.username}
                    </span>
                  </div>
                ))
              ) : (
                <p>Belum ada</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailUser;
