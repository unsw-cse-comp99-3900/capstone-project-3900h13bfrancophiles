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
        fontSize: '3rem',
        fontWeight: '600',
        color: '#33373D',
        letterSpacing: '0.4px',
        lineHeight: '1.7',
        margin: '30px 0px'
      },
      h2: {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#33373D',
        letterSpacing: '0.4px',
        lineHeight: '1.7',
        margin: '30px 0px'
      },
      h3: {
        fontSize: '2rem',
        fontWeight: '500',
        color: '#33373D',
        letterSpacing: '0.4px',
        lineHeight: '1.7',
        margin: '30px 0px'
      },
      body: {
        fontSize: '1rem',
        fontWeight: '400',
        color: '#33373D',
        letterSpacing: '0.4px',
        lineHeight: '1.7',
        whiteSpace: 'pre-line'
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