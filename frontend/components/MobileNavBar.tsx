"use client";

import {
  AspectRatio,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItemButton,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import Image from "next/image";
import NextLink from "next/link";
import React from "react";
import { Menu as MenuIcon } from "@mui/icons-material";
import { navData } from "@/app/data";
import LogoutButton from "@/components/LogoutButton";

const NavBar = () => {
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
            <AspectRatio
              variant="plain"
              ratio="15/12"
              objectFit="contain"
              sx={{ width: 60 }}
            >
              <Image fill src="/roomalloclogo.svg" alt="logo" />
            </AspectRatio>
          </NextLink>
          <IconButton
            variant="plain"
            color="neutral"
            onClick={() => setOpen(true)}
          >
            <MenuIcon sx={{ fontSize: "2.2rem" }} />
          </IconButton>
        </Stack>
      </Sheet>
      <MenuDrawer open={open} setOpen={setOpen} />
    </>
  );
};

interface MenuDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuDrawer: React.FC<MenuDrawerProps> = ({ open, setOpen }) => {
  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <Link component={NextLink} href="/frontend/public" mx="auto" my={2}>
        <AspectRatio
          variant="plain"
          ratio="15/4"
          objectFit="contain"
          sx={{ width: 200 }}
        >
          <Image fill src="/roomalloclogo.svg" alt="logo" />
        </AspectRatio>
      </Link>
      <Divider />
      <List
        size="lg"
        component="nav"
        sx={{
          flex: "none",
          fontSize: "xl",
          "& > div": { justifyContent: "center" },
        }}
      >
        {navData.map(({ text, href }, idx) => (
          <ListItemButton
            key={idx}
            onClick={() => setOpen(false)}
            sx={{ "&:hover": { bgcolor: "#f0f4fc" } }}
          >
            <Link
              component={NextLink}
              href={href}
              key={idx}
              underline="none"
              sx={{ color: "inherit", fontSize: "inherit" }}
            >
              <Typography level="body" fontSize={20}>
                {text}
              </Typography>
            </Link>
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Stack mx="auto" my={2}>
        <AspectRatio
          variant="plain"
          ratio="15/15"
          objectFit="contain"
          sx={{ width: 35 }}
        >
          <LogoutButton />
        </AspectRatio>
      </Stack>
    </Drawer>
  );
};

export default NavBar;
