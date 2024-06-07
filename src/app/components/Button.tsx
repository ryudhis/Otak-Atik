import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  alternateStyle?: string;
  disable?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  alternateStyle,
  type,
  disable,
}) => {
  const style =
    alternateStyle === "primary"
      ? "text-tertiary py-1 px-3 border-secondary border-[2px] hover:bg-tertiary hover:text-secondary"
      : alternateStyle === "absolute"
      ? "px-0 py-0 bg-transparent hover:bg-transparent active:bg-transparent -mx-4 absolute bottom-5 right-16"
      : alternateStyle === "ghost"
      ? "px-0 py-0 bg-transparent hover:bg-transparent active:bg-transparent -mx-4 flex"
      : alternateStyle === "text"
      ? "hover:bg-transparent text-secondary bg-tertiary"
      : "hover:text-tertiary text-secondary bg-tertiary border-secondary border-[2px] py-1 px-3";

  const disabledStyle = disable ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type ? type : "button"}
      onClick={onClick}
      disabled={disable}
      className={`bg-secondary font-bold py-2 px-4 rounded-lg hover:bg-secondaryhover hover:scale-105 active:bg-secondary active:scale-100 transition-all duration-200 ease-in-out ${style} ${disabledStyle}`}
    >
      {children}
    </button>
  );
};

export default Button;
