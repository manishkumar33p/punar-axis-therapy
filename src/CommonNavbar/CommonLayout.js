import React from "react";
import CommonNavbar from "./CommonNavbar";

function CommonLayout({ children }) {
  return (
    <div className="app-layout">

      <CommonNavbar />

      <main className="app-content">
        {children}
      </main>

    </div>
  );
}

export default CommonLayout;