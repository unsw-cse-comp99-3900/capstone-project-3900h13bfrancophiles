import ThemeRegistry from '@/app/ThemeRegistry';
import NavBar from '@/app/components/NavBar';
import MobileNavBar from '@/app/components/MobileNavBar';
import React from 'react';
import {Stack} from "@mui/joy";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; 

export default function Layout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar/>
      <MobileNavBar/>
      {children}
    </>
  );
}