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
  const style =
    alternateStyle === "primary"
      ? "text-tertiary py-1 px-3 border-secondary border-[2px] hover:bg-tertiary hover:text-secondary"
      : alternateStyle === "ghost"
      ? "px-0 py-0 bg-transparent hover:bg-transparent active:bg-transparent -mx-4"
      : "hover:text-tertiary text-secondary bg-tertiary border-secondary border-[2px] py-1 px-3";
  return (
    <button
      onClick={onClick}
      className={` bg-secondary font-bold py-2 px-4 rounded-lg hover:bg-secondaryhover hover:scale-105 active:bg-secondary active:scale-100 transition-all duration-200 ease-in-out ${style}`}
    >
      {children}
    </button>
  );
};

export default Button;
