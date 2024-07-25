"use client";

import React from "react";
import { KeepScale } from "react-zoom-pan-pinch";
import { Box, Avatar } from "@mui/joy";
import { Status, UserData } from "@/types";
import useSpace from "@/hooks/useSpace";
import UserAvatar from "./UserAvatar";

interface DeskIconProps {
  id: string;
  x: number;
  y: number;
  selectedDesk: string;
  setSelectedDesk: React.Dispatch<React.SetStateAction<string>>;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  setAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  setDeskName: React.Dispatch<React.SetStateAction<string>>;
  status: Status | undefined;
}

interface PinProps {
  color: string;
  on: boolean;
}

const activeStyle = {
  transform: "scale(0.8) translate(0%, -70%)",
  zIndex: 5,
};

const inactiveStyle = {
  "&:hover": {
    transform: "scale(1.2)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 6,
  },
};

const deskStyle = {
  height: "var(--size-var)",
  width: "var(--size-var)",
  position: "absolute",
  top: 0,
  left: 0,
};

const Pin = ({ color, on }: PinProps) => {
  return (
    <Box
      sx={{ ...deskStyle, pointerEvents: on ? "auto" : "none", transform: "translate(0%, -55%)" }}
    >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 50 64.1"
        xmlSpace="preserve"
        style={{
          transition: "transform 0.1s, box-shadow 0.2s",
          transform: on ? "scale(1)" : "scale(0)",
          overflow: "visible",
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

const DeskIcon = ({
  id,
  x,
  y,
  selectedDesk,
  setSelectedDesk,
  setSelectedUser,
  setAvailable,
  setDeskName,
  status,
}: DeskIconProps) => {
  const { space } = useSpace(id);
  const deskName = space ? space.name : "Desk";

  const handleClick = () => {
    if (selectedDesk === id) {
      setAvailable(false);
      setSelectedDesk("");
      setSelectedUser(null);
      setDeskName("");
    } else {
      setAvailable(status?.status === "Available");
      setSelectedDesk(id);
      setDeskName(deskName);
    }
  };

  if (!status) return <></>;

  return (
    <Box
      key={id}
      sx={{
        "--size-var": { xs: "25px", sm: "30px", md: "35px" },
        position: "absolute",
        overflow: "visible",
        transform: "translate(-50%, -50%)",
        zIndex: selectedDesk === id ? 3 : 2,
        "&:hover": {
          zIndex: 4,
        },
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      <KeepScale
        style={{ height: "var(--size-var)", width: "var(--size-var)", overflow: "visible" }}
      >
        <Box
          onClick={() => handleClick()}
          sx={{
            height: "var(--size-var)",
            width: "var(--size-var)",
            "&:hover": {
              transform: selectedDesk === id ? "scale(1.2)" : "",
            },
            transition: "transform 0.1s",
          }}
        >
          <Pin
            color={status.status === "Available" ? "#207920" : "#0B6BCB"}
            on={selectedDesk === id ? true : false}
          />
          {status && status.status === "Unavailable" && (
            <UserAvatar
              zid={status.booking.zid}
              selected={selectedDesk === id}
              setSelectedUser={setSelectedUser}
            />
          )}
          {status && status.status === "Available" && (
            <Avatar
              variant="solid"
              size="sm"
              color={"success"}
              src={"DeskIcon1.svg"}
              sx={{
                ...deskStyle,
                ...(selectedDesk === id ? activeStyle : inactiveStyle),
                transition: "transform 0.1s, box-shadow 0.1s",
              }}
            />
          )}
        </Box>
      </KeepScale>
    </Box>
  );
};

export default DeskIcon;
