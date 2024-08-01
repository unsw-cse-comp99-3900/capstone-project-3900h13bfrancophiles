"use client";

import {
  AspectRatio,
  Avatar,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItemButton,
  Sheet,
  Skeleton,
  Stack,
  Typography,
} from "@mui/joy";
import Image from "next/image";
import NextLink from "next/link";
import React from "react";
import { Menu as MenuIcon } from "@mui/icons-material";
import LogoutButton from "@/components/LogoutButton";
import { NavData } from "@/types";
import { getInitials } from "@/utils/icons";
import Box from "@mui/joy/Box";
import useUser from "@/hooks/useUser";
import { getRoleName } from "@/components/ProfileDropdown";

const NavBar = ({ navItems, zid }: { navItems: NavData[]; zid: number }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Sheet sx={{ zIndex: 2, boxShadow: "md", height: 60, display: { sm: "none" } }}>
        <Stack
          direction="row"
          height="100%"
          width="100%"
          p={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <NextLink href="/">
            <AspectRatio variant="plain" ratio="15/12" objectFit="contain" sx={{ width: 60 }}>
              <Image fill src="/roomalloclogo.svg" alt="logo" />
            </AspectRatio>
          </NextLink>
          <IconButton variant="plain" color="neutral" onClick={() => setOpen(true)}>
            <MenuIcon sx={{ fontSize: "2.2rem" }} />
          </IconButton>
        </Stack>
      </Sheet>
      <MenuDrawer open={open} setOpen={setOpen} navItems={navItems} zid={zid} />
    </>
  );
};

interface MenuDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navItems: NavData[];
  zid: number;
}

const MenuDrawer: React.FC<MenuDrawerProps> = ({ open, setOpen, navItems, zid }) => {
  const { user, isLoading } = useUser(zid);

  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <Stack alignItems="center">
        <Link component={NextLink} href="/" mx="auto" my={2}>
          <AspectRatio variant="plain" ratio="15/4" objectFit="contain" sx={{ width: 200 }}>
            <Image fill src="/roomalloclogo.svg" alt="logo" />
          </AspectRatio>
        </Link>
        <Divider />
        <Stack p={1} direction="row" alignItems="center">
          <Skeleton loading={isLoading}>
            <Avatar
              variant="solid"
              color="primary"
              size="sm"
              src={user?.image ? `data:image/jpeg;base64,${user?.image}` : undefined}
            >
              {user?.fullname ? getInitials(user?.fullname) : ""}
            </Avatar>
          </Skeleton>
          <Box sx={{ ml: 1.5 }}>
            <Typography level="title-sm" textColor="text.primary">
              {user?.fullname}
            </Typography>
            <Typography level="body-xs" textColor="text.tertiary">
              z{user?.zid} - {getRoleName(user?.usergrp ? user?.usergrp : "other")}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <List
          size="lg"
          component="nav"
          sx={{
            width: "100%",
            flex: "none",
            fontSize: "xl",
            "& > div": { justifyContent: "center" },
          }}
        >
          {navItems.map(({ text, href }) => (
            <ListItemButton
              key={href}
              onClick={() => setOpen(false)}
              sx={{ "&:hover": { bgcolor: "#f0f4fc" } }}
            >
              <Link
                component={NextLink}
                href={href}
                underline="none"
                sx={{ color: "inherit", fontSize: "inherit" }}
              >
                <Typography level="body" fontSize={20}>
                  {text}
                </Typography>
              </Link>
            </ListItemButton>
          ))}
          <Divider sx={{ marginTop: 1 }} />
        </List>
        <Stack width="100%">
          <LogoutButton paddingRight={0} />
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default NavBar;
