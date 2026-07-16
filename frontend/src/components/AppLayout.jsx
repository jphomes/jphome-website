import React from "react";
import { useLocation } from "react-router-dom";
import AppHeader from "./AppHeader.jsx";
import BottomNav from "./BottomNav.jsx";
import SiteNavbar from "./SiteNavbar.jsx";
import SiteFooter from "./SiteFooter.jsx";

const PAGE_TITLES = {
  "/properties": "Properties",
  "/blogs": "Blogs",
  "/blog": "Blogs",
  "/about": "About",
  "/contact": "Contact",
};

export default function AppLayout({ children }) {
  const location = useLocation();
  const isDetail =
    location.pathname.startsWith("/properties/") || location.pathname.startsWith("/blogs/") || location.pathname.startsWith("/blog/");
  const baseTitle = PAGE_TITLES[location.pathname];

  return (
    <div className="app-frame">
      <div className="app-shell">
        <AppHeader title={baseTitle} showBack={isDetail} />
        <SiteNavbar />
        <main className="app-main">{children}</main>
        <BottomNav />
        <SiteFooter />
      </div>
    </div>
  );
}
