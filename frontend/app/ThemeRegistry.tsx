'use client';

import React from 'react';
import { Experimental_CssVarsProvider as MaterialCssVarsProvider, } from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider, extendTheme, THEME_ID } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

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
  return (
    <MaterialCssVarsProvider>
      <JoyCssVarsProvider theme={{ [THEME_ID]: theme }}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {children}
        </LocalizationProvider>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}

// default font family is Inter
export const theme = extendTheme({
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
      color: '#33373D',
    },
    'title-lg': {
      color: '#33373D',
    },
    'body-sm': {
      color: '#33373D',
    },
    'body-md': {
      color: '#33373D',
    },
    'body-lg': {
      color: '#33373D',
    },
  },
});