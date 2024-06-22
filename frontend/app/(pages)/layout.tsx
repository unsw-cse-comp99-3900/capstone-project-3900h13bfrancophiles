import ThemeRegistry from '@/app/ThemeRegistry';
import NavBar from '@/app/components/NavBar';
import MobileNavBar from '@/app/components/MobileNavBar';
import React from 'react';

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