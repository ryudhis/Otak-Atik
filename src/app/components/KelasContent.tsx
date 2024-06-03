"use client";

import React from "react";

interface KelasContentProps {
  title: string;
  subtitle: string;
  content: string[];
}

const KelasContent: React.FC<KelasContentProps> = ({
  title,
  subtitle,
  content,
}) => {
  return (
    <div className='p-6 py-10 flex flex-col gap-2 items-start border-solid border-[2px] rounded-xl border-primary shadow-box-kelas'>
      <h1 className='text-3xl font-bold'>{title}</h1>
      <h2>{subtitle}</h2>
      <ol className='ml-3 mt-1 flex flex-col justify-center h-[50%]'>
        {content.map((item, index) => {
          return (
            <li className='text-xl' key={index}>
              {`\u2022 ${item}`}{" "}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default KelasContent;
