import NavBar from "@/components/NavBar";
import MobileNavBar from "@/components/MobileNavBar";
import React from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";
import { NavData, TokenPayload } from "@/types";
config.autoAddCss = false;

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems: NavData[] = [
    { text: "Dashboard", href: "/dashboard" },
    { text: "Rooms", href: "/rooms" },
  ];

  const token = getCookie("token", { cookies });
  if (token) {
    const tokenPayload = decodeJwt<TokenPayload>(`${token}`);
    if (tokenPayload.group === "admin") {
      navItems.push({ text: "Admin", href: "/admin" });
    }

    // HDR and above can book desks, Other cannot
    if (tokenPayload.group !== "other") {
      navItems.push({ text: "Desks", href: "/desks" });
    }
  }

  return (
    <>
      <NavBar navItems={navItems} />
      <MobileNavBar navItems={navItems} />
      {children}
    </>
  );
}
