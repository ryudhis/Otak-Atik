import Sidebar from "@components/Sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Sidebar />
      <div className="ml-20">{children}</div>
    </div>
  );
};

export default layout;
