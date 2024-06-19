"use client"

import {Sheet, Stack, Typography} from "@mui/joy";
import Image from "next/image";
import Link from "next/link";
import LogoutIcon from "@mui/icons-material/Logout";
import {pink} from '@mui/material/colors';
import {usePathname} from "next/navigation";


interface NavProps {
  title: string;
  navigateTo: string;
}

function NavItem({title, navigateTo}: NavProps) {
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
        borderBottom: activePage === navigateTo ? '4px solid #787979' : 'none',
        "&:hover": {bgcolor: "#D1E2F8", opacity: "40%"}
      }}
    >
      <Typography
        level="h4"
        fontSize={14}
        margin="auto"
        px={5}
        sx={{textAlign: "center"}}>
        {title}
      </Typography>
    </Stack>
  )
}

export default function NavBar() {
  const activePage = usePathname();

  return (
    <Sheet sx={{height: 60, "display": {xs: "none", sm: "flex"}}}>
      <Stack width="100%" height="100%" boxShadow="md" direction="row" alignItems="center" px={2}>
        <Link href="/">
          <Image src={"/logo.png"} alt={"logo"} height={35} width={40}/>
        </Link>
        <Stack direction="row" alignItems="center" width="100%" height="100%" ml={2}
               sx={{justifyContent: 'space-between'}}>
          <Stack direction="row" alignItems="center" height="100%">
            <NavItem title="Dashboard" navigateTo="/dashboard"/>
            <NavItem title="Rooms" navigateTo="/rooms"/>
            <NavItem title="Desks" navigateTo="/desks"/>
          </Stack>
          <LogoutIcon width={25} height={25} sx={{color: pink[500]}}/>
        </Stack>
      </Stack>
    </Sheet>)
}
