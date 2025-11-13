import Sidebar from "@components/Sidebar";
import Header from "@components/Header";
import React from "react";
import { UserProvider } from "@/app/context/UserContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <div className="flex bg-tertiary h-[100vh] overflow-hidden">
        <Sidebar />
        <div className="flex-1 ml-20">
          <Header />
          <div className="bg-tertiary">{children}</div>
        </div>
      </div>
    </UserProvider>
  );
};

export default Layout;
