'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';

declare module '@mui/joy/styles' {

}

type ThemeRegistryProps = {
  children: React.ReactNode;
};

// This implementation is suggested by JoyUI for working with App router
// https://mui.com/joy-ui/integrations/next-js-app-router/
export default function ThemeRegistry({
                                        children
                                      }: ThemeRegistryProps) {
  const path = usePathname();

  const theme = extendTheme({})

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      {children}
    </CssVarsProvider>
  );
}