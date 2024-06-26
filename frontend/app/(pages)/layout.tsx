import NavBar from '@/components/NavBar';
import MobileNavBar from '@/components/MobileNavBar';
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
      <Stack px={{xs: '5%', md: '92px'}}>
        {children}
      </Stack>
    </>
  );
}