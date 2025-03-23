import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; // Ensure Navbar is imported

interface LayoutProps {
  children?: ReactNode; // Accept children prop
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout-container">
      <Navbar />
      {children || <Outlet />}
    </div>
  );
};

export default Layout;
