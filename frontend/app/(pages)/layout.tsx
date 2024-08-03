import NavBar from "@/components/nav/NavBar";
import MobileNavBar from "@/components/nav/MobileNavBar";
import React from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";
import { NavData, TokenPayload } from "@/types";
import { redirect } from "next/navigation";
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
  if (!token) return redirect("/login");

  let tokenPayload: TokenPayload;
  try {
    tokenPayload = decodeJwt<TokenPayload>(`${token}`);
  } catch (e) {
    return redirect("/login");
  }

  // HDR and above can book desks, Other cannot
  if (tokenPayload.group !== "other") {
    navItems.push({ text: "Desks", href: "/desks" });
  }

  if (tokenPayload.group === "admin") {
    navItems.push({ text: "Admin", href: "/admin" });
  }

  return (
    <>
      <NavBar navItems={navItems} zid={tokenPayload.user} />
      <MobileNavBar navItems={navItems} zid={tokenPayload.user} />
      {children}
    </>
  );
}
