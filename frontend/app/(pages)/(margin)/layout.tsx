import React from 'react';
import {Stack} from "@mui/joy";

export default function Layout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Stack px={{xs: '5%', md: '92px'}}>
        {children}
      </Stack>
    </>
  );
}