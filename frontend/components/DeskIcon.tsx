'use client';

import React, { use } from 'react';
import { KeepScale } from 'react-zoom-pan-pinch';
import { Box, Avatar } from '@mui/joy';
import { Status } from '@/types';
import useUser from '@/hooks/useUser';


type UserData = {
  name: string,
  image: string | null,
}

const anonymousUser: UserData = {
  name: "anonymous",
  image: null,
}

const getUser = (zid: number) => {
  const { user, isLoading, error } = useUser(zid);
  if (user) {
    return { name: user.fullname, image: user.image} ;
  } else {
    return anonymousUser;
  }
}

const getInitials = (name: string) => {
  const words = name.trim().split(" ", 2);
  const firstLetter = words[0] ? words[0][0] : '';
  const secondLetter = words[1] ? words[1][0] : '';
  return (firstLetter + secondLetter).toUpperCase();
}

interface DeskIconProps {
  id: string,
  x: number,
  y: number,
  selectedDesk: string,
  setSelectedDesk: React.Dispatch<React.SetStateAction<string>>,
  status: Status,
}

interface PinProps {
  color: string,
  on: boolean
}

const activeStyle = {
  transform: "scale(0.8)",
  zIndex: 5
}

const inactiveStyle = {
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
  }
}

const deskStyle = {
  height: "var(--size-var)",
  width: "var(--size-var)",
  position: "absolute",
  top: 0,
  left: 0,
};

const Pin = ({ color, on }: PinProps) => {
  return (
    <Box sx={{ ...deskStyle }}  >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 50 64.1"
        xmlSpace="preserve"
        style={{
          transition: 'transform 0.1s, box-shadow 0.2s',
          transform: on ? 'scale(1)' : 'scale(0)',
          overflow: "visible"
        }}
      >
        <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="2" dy="2" result="offsetblur" />
          <feFlood floodColor="rgba(0, 0, 0, 0.2)" />
          <feComposite in2="offsetblur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
        <path
          fill={color}
          d="M50,25c0,8.2-9.7,20.3-9.7,20.3L25,64.1L9.7,45.2c0,0-9.8-11.7-9.7-20.2C0.2,12.7,10.4,0,25,0
            C38.8,0,50,11.2,50,25z"
          filter="url(#shadow)"
        />
      </svg>
    </Box>

  );
};

const DeskIcon = ({ id, x, y, selectedDesk, setSelectedDesk, status }: DeskIconProps) => {
  const user = status ? (status.status === "available" ? null : getUser(status.booking.zid)) : null;

  return (
    <Box
      key={id}
      sx={{
        display: status ? "block" : "none",
        "--size-var": { xs: "33px", sm: "45px", md: "50px" },
        position: "absolute",
        overflow: "visible",
        transform: "translate(-50%, -50%)",
        zIndex: selectedDesk === id ? 3 : 2,
        left: `${x}%`,
        top: `${y}%`
      }}
    >
      <KeepScale style={{ height: "var(--size-var)", width: "var(--size-var)", overflow: "visible" }}>
        <Box
          onClick={() => setSelectedDesk(id)}
          sx={{ overflow: "visible", height: "var(--size-var)", width: "var(--size-var)" }}
        >
          <Pin color={status && status.status === "available" ? "#207920" : "#0B6BCB"} on={selectedDesk === id ? true : false} />
          <Avatar
            variant="solid"
            color={status && status.status === "available" ? "success" : "primary"}
            src={
              status && status.status === "available" ? "DeskIcon1.svg" :
              user && user.name !== "anonymous" ? `data:image/jpeg;base64,${user.image}` :
              "/defaultUser.svg"
            }
            sx={{
              ...deskStyle,
              ...(selectedDesk === id ? activeStyle : inactiveStyle),
              zIndex: 3,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            {user && user.name ? getInitials(user.name) : ""}
          </Avatar>
        </Box>
      </KeepScale>
    </Box>
  );
};

export default DeskIcon;
