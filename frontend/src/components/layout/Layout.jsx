import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import "./Layout.css";

function Layout({ children, pageTitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="agrimind-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="agrimind-main-wrapper">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          pageTitle={pageTitle}
        />
        <main className="agrimind-content-area">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
