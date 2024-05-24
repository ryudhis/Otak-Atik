import React from "react";
import Accordion from "@/app/components/Accordion";

const FAQ = () => {
  return (
    <div className="p-4 rounded-lg">
      <Accordion
        title="Kelas virtual menggunakan apa?"
        answer="Kelas virtual akan menggunakan Google Meet."
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