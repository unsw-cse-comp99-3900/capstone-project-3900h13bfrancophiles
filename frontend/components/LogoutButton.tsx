"use client";

import { IconButton, Stack } from "@mui/joy";
import LogoutIcon from "@mui/icons-material/Logout";
import { pink } from "@mui/material/colors";
import React from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/api";
import { deleteCookie } from "cookies-next";
import Typography from "@mui/joy/Typography";

interface LogoutButtonProps {
  paddingRight: number;
}

const LogoutButton = ({ paddingRight }: LogoutButtonProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      deleteCookie("token");
      router.push("/login");
    } catch (e: unknown) {
      // TODO: alert user that token is expired and they need to log in again
      // though it doesn't really make sense in logout lol
    }
  };

  return (
    <IconButton onClick={handleLogout}>
      <Stack direction="row" spacing={1} p={0.5} alignItems="center" pr={paddingRight}>
        <LogoutIcon width={25} height={25} sx={{ color: pink[500] }} />
        <Typography level="body-sm">Logout</Typography>
      </Stack>
    </IconButton>
  );
};

export default LogoutButton;
