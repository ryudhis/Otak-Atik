import Sidebar from "@components/Sidebar";
import Header from "@components/Header";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-20">
        <Header />
        <div className="mt-20">{children}</div>
      </div>
    </div>
  );
};

export default Layout;