import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  alternateStyle?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  alternateStyle,
}) => {
  return (
    <button
      onClick={onClick}
      className={` bg-secondary font-bold py-2 px-4 rounded-lg hover:bg-secondaryhover hover:scale-105 active:bg-secondary active:scale-100 transition-all duration-200 ease-in-out ${alternateStyle}`}
    >
      {children}
    </button>
  );
};

export default Button;
