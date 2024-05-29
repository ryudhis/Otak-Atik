"use client";

import React from "react";

interface KelasContentProps {
  title: string;
  subtitle: string;
  content: string[];
}

const KelasContent: React.FC<KelasContentProps> = ({ title, subtitle, content }) => {
  return (
    <div className='bg-tertiary p-6 flex flex-col justify-between items-center border-b-[1px] border-gray-700'>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <ul>
        {content.map((item, index) => {
          return <li key={index}>{item}</li>;
        })}
      </ul>
    </div>
  );
};

export default KelasContent;
