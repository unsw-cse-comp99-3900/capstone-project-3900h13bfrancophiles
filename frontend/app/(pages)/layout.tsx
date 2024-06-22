import ThemeRegistry from '@/app/ThemeRegistry';
import NavBar from '@/app/components/NavBar';
import MobileNavBar from '@/app/components/MobileNavBar';
import React from 'react';
import {Stack} from "@mui/joy";

export default function Layout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar/>
      <MobileNavBar/>
      <Stack sx={{ px: { xs: '5%', md: '92px' } }}>
        {children}
      </Stack>
    </>
  );
}