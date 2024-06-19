'use client';

import {AspectRatio, Divider, Drawer, IconButton, Link, List, ListItemButton, Sheet, Stack,} from '@mui/joy';
import Image from 'next/image';
import NextLink from 'next/link';
import React from 'react';
import {Menu as MenuIcon} from '@mui/icons-material';
import LogoutIcon from "@mui/icons-material/Logout";
import {pink} from "@mui/material/colors";

const NavBar = () => {
  const [open, setOpen] = React.useState(false);

  return (<>
      <Sheet sx={{boxShadow: 'md', height: 60, display: {sm: 'none'}}}>
        <Stack direction='row' height='100%' width='100%' p={2} justifyContent='space-between' alignItems='center'>
          <Link component={NextLink} href="/">
            <AspectRatio variant="plain" ratio="15/12" objectFit="contain" sx={{width: 60}}>
              <Image fill src='/logo.png' alt='logo'/>
            </AspectRatio>
          </Link>
          <IconButton variant="plain" sx={{color: '#fff'}} onClick={() => setOpen(true)}>
            <MenuIcon sx={{fontSize: '2.2rem'}}/>
          </IconButton>
        </Stack>
      </Sheet>
      <MenuDrawer open={open} setOpen={setOpen}/>
    </>)
}

interface MenuDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuDrawer: React.FC<MenuDrawerProps> = ({open, setOpen}) => {
  return (<Drawer anchor='right' open={open} onClose={() => setOpen(false)}>
      <Link component={NextLink} href="/" mx='auto' my={2}>
        <AspectRatio variant="plain" ratio="15/4" objectFit="contain" sx={{width: 200}}>
          <Image fill src='/logo.png' alt='logo'/>
        </AspectRatio>
      </Link>
      <Divider/>
      <List
        size="lg"
        component="nav"
        sx={{
          flex: 'none', fontSize: 'xl', '& > div': {justifyContent: 'center'},
        }}
      >
        <ListItemButton onClick={() => setOpen(false)}>
          <Link component={NextLink} href={'/dashboard'} underline='none' sx={{color: 'inherit', fontSize: 'inherit'}}>
            Dashboard
          </Link>
        </ListItemButton>
        <ListItemButton onClick={() => setOpen(false)}>
          <Link component={NextLink} href={'/rooms'} underline='none' sx={{color: 'inherit', fontSize: 'inherit'}}>
            Rooms
          </Link>
        </ListItemButton>
        <ListItemButton onClick={() => setOpen(false)}>
          <Link component={NextLink} href={'/desks'} underline='none' sx={{color: 'inherit', fontSize: 'inherit'}}>
            Desks
          </Link>
        </ListItemButton>
      </List>
      <Divider/>
      <Stack mx='auto' my={2}>
        <AspectRatio variant="plain" ratio="15/15" objectFit="contain" sx={{width: 35}}>
          <LogoutIcon width={25} height={25} sx={{color: pink[500]}}/>
        </AspectRatio>
      </Stack>

    </Drawer>)
}

export default NavBar;