"use client";

import React from "react";
import Accordion from "@/app/components/Accordion";
import Image from "next/image";
import logo from "@img/login/logo.png";

const FAQ = () => {
  return (
    <div className="bg-tertiary p-28 h-screen justify-center items-center ">

      <div  className="flex flex-col items-center justify-center">
        <Image className='mb-6 ' src={logo} alt='logo-image' />
        <h1 className=" text-xl mb-16 text-center">Platform pembelajaran berbasis website dikembangkan untuk pengguna agar dapat belajar dan mengajar berbagai macam materi tanpa terbatas pada mata pelajaran dasar</h1>
      </div>

      <h1 className="font-bold text-2xl mb-8">Frequently Asked Questions</h1>
      <Accordion
        title="Kelas virtual menggunakan apa?"
        answer="Kelas virtual akan menggunakan Link Meeting seperti Google Meet, Zoom, Jitsy, dan lainnya."
      />
      <Accordion
        title="Apa modul selalu bisa diakses?"
        answer="Modul bisa diakses walaupun kelas virtual telah berakhir."
      />
      <Accordion 
        title="Apa saja materi yang ditawarkan?" 
        answer="Materi yang ditawarkan beragam mulai dari Desain, Pemrograman, Sains, dan sebagainya."
        />

    </div>
  );
};

export default FAQ;