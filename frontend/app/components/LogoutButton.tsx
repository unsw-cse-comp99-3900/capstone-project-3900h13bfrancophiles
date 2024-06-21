'use client'

import { IconButton } from '@mui/joy';
import LogoutIcon from '@mui/icons-material/Logout';
import { pink } from '@mui/material/colors';
import React from 'react';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    deleteCookie("token");
    router.push('/login');
  }

  return (
    <IconButton onClick={handleLogout}>
      <LogoutIcon width={25} height={25} sx={{color: pink[500]}}/>
    </IconButton>
  )
}

export default LogoutButton;