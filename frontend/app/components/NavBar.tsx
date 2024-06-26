"use client";

import { AspectRatio, Link, Sheet, Stack, Typography } from "@mui/joy";
import Image from "next/image";
import LogoutIcon from "@mui/icons-material/Logout";
import { pink } from "@mui/material/colors";
import { usePathname } from "next/navigation";
import React from "react";
import NextLink from "next/link";
import { navData } from "@/app/data";
import LogoutButton from "@/app/components/LogoutButton";

interface NavProps {
  title: string;
  navigateTo: string;
}

function NavItem({ title, navigateTo }: NavProps) {
  const activePage = usePathname();

  return (
    <Stack
      component={Link}
      href={navigateTo}
      sx={{
        alignContent: "center",
        width: "100%",
        height: "100%",
        textDecoration: "none",
        borderBottom: activePage === navigateTo ? "4px solid #787979" : "none",
        "&:hover": { bgcolor: "#f0f4fc", textDecoration: "none" },
      }}
    >
      <Typography
        level="h3"
        fontSize={16}
        margin="auto"
        px={5}
        sx={{ textAlign: "center" }}
      >
        {title}
      </Typography>
    </Stack>
  );
}

export default function NavBar() {
  return (
    <Sheet
      sx={{ boxShadow: "md", height: 60, display: { xs: "none", sm: "flex" } }}
    >
      <Stack
        width="100%"
        height="100%"
        direction="row"
        alignItems="center"
        px={2}
      >
        <Link component={NextLink} href="/">
          <AspectRatio
            variant="plain"
            ratio="15/12"
            objectFit="contain"
            sx={{ width: 60 }}
          >
            <Image fill src="/logo.png" alt="logo" />
          </AspectRatio>
        </Link>
        <Stack
          direction="row"
          alignItems="center"
          width="100%"
          height="100%"
          ml={2}
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" height="100%">
            {navData.map(({ text, href }, idx) => (
              <NavItem title={text} navigateTo={href} key={idx} />
            ))}
          </Stack>
          <LogoutButton />
        </Stack>
      </Stack>
    </Sheet>
  );
}
