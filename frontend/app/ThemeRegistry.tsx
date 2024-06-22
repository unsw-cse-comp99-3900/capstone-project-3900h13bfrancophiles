'use client';

import React from 'react';
import {CssVarsProvider, extendTheme} from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';

declare module '@mui/joy/styles' {
  interface TypographySystemOverrides {
    body: true;
  }
}

type ThemeRegistryProps = {
  children: React.ReactNode;
};

// This implementation is suggested by JoyUI for working with App router
// https://mui.com/joy-ui/integrations/next-js-app-router/
export default function ThemeRegistry({
  children
}: ThemeRegistryProps) {

  // default font family is Inter
  const theme = extendTheme({
    typography: {
      // defining custom levels
      h1: {
        color: '#33373D',
        margin: '30px 0px'
      },
      h2: {

        color: '#33373D',
      },
      h3: {

        color: '#33373D',

      },
      body: {
        fontSize: '13pt',
        color: '#33373D',

      },
    },
  });

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      {children}
    </CssVarsProvider>
  );
}