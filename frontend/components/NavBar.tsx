"use client";

import { AspectRatio, Sheet, Stack, Typography } from "@mui/joy";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, {useEffect, useState} from "react";
import NextLink from "next/link";
import { navData } from "@/app/data";
import LogoutButton from "@/components/LogoutButton";
import {getCookie} from "cookies-next";
import * as jwt from "jsonwebtoken";

interface NavProps {
  title: string;
  navigateTo: string;
}

function NavItem({ title, navigateTo }: NavProps) {
  const activePage = usePathname();

  return (
    <Stack
      component={NextLink}
      href={navigateTo}
      sx={theme => ({
        alignContent: "center",
        width: "100%",
        height: "100%",
        textDecoration: "none",
        borderBottom: activePage === navigateTo
          ? `4px solid ${theme.vars.palette.neutral[500]}`
          : "none",
        "&:hover": { bgcolor: `${theme.vars.palette.neutral.plainHoverBg}` },
      })}
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
  const [adminNavBar, setAdminNavBar] = useState(false);

  useEffect(() => {
    const token = getCookie('token');

    if (token) {
      const decoded = jwt.decode(`${token}`) as jwt.JwtPayload;
      if (decoded.group === "admin") {
        setAdminNavBar(true)
      }
    }
  }, []);

  return (
    <Sheet
      sx={{ zIndex: 2, boxShadow: "md", height: 60, display: { xs: "none", sm: "flex" } }}
    >
      <Stack
        width="100%"
        height="100%"
        direction="row"
        alignItems="center"
        px={2}
      >
        <NextLink href="/">
          <AspectRatio
            variant="plain"
            ratio="15/12"
            objectFit="contain"
            sx={{ width: 60 }}
          >
            <Image fill src="/roomalloclogo.svg" alt="logo" />
          </AspectRatio>
        </NextLink>
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
            {adminNavBar ? (
              <NavItem title="Admin" navigateTo='/admin' />
            ) : null}
          </Stack>
          <LogoutButton />
        </Stack>
      </Stack>
    </Sheet>
  );
}
