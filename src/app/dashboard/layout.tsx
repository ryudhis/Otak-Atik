import Sidebar from "@components/Sidebar";
import Header from "@components/Header";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex bg-tertiary h-[100vh] overflow-hidden">
      <Sidebar />
      <div className="flex-1 ml-20">
        <Header />
        <div className="bg-tertiary">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
