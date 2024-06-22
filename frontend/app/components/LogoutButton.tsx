'use client'

import { IconButton } from '@mui/joy';
import LogoutIcon from '@mui/icons-material/Logout';
import { pink } from '@mui/material/colors';
import React from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/api';
import { deleteCookie } from 'cookies-next';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      deleteCookie("token");
      router.push('/login');
    } catch (e: any) {
      // TODO: alert user that token is expired and they need to log in again
      // though it doesn't really make sense in logout lol
    }
  }

  return (
    <IconButton onClick={handleLogout}>
      <LogoutIcon width={25} height={25} sx={{color: pink[500]}}/>
    </IconButton>
  )
}

export default LogoutButton;