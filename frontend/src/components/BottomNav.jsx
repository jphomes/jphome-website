import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { HiHome, HiBuildingOffice2, HiNewspaper, HiPhone } from "react-icons/hi2";

const items = [
  { key: "home", label: "Home", to: "/", icon: HiHome, end: true },
  { key: "properties", label: "Projects", to: "/properties", icon: HiBuildingOffice2 },
  { key: "blogs", label: "Blogs", to: "/blogs", icon: HiNewspaper },
  { key: "contact", label: "Contact", to: "/contact", icon: HiPhone },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav safe-bottom" aria-label="App navigation">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.end
          ? location.pathname === item.to
          : location.pathname.startsWith(item.to);

        return (
          <NavLink
            key={item.key}
            to={item.to}
            end={item.end}
            className={`bottom-nav-item min-h-[48px] ${isActive ? "bottom-nav-item-active" : ""}`}
          >
            <span className="bottom-nav-icon-wrap">
              <Icon size={22} />
            </span>
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
