"use client";

import React from "react";
import { Avatar } from "@mui/joy";
import { UserData } from "@/types";
import useUser from "@/hooks/useUser";

interface UserAvatarProps {
  zid: number;
  selected: boolean;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const anonymousUser: UserData = {
  name: "anonymous",
  image: null,
};

const activeStyle = {
  transform: "scale(0.8) translate(0%, -70%)",
  zIndex: 5,
};

const inactiveStyle = {
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 6,
  },
};

function getInitials(name: string) {
  const words = name.trim().split(" ", 2);
  const firstLetter = words[0] ? words[0][0] : "";
  const secondLetter = words[1] ? words[1][0] : "";
  return (firstLetter + secondLetter).toUpperCase();
}

const UserAvatar = ({ zid, selected, setSelectedUser }: UserAvatarProps) => {
  const { user } = useUser(zid);
  const userData = user ? { name: user.fullname, image: user.image } : anonymousUser;

  return (
    <Avatar
      onClick={() => setSelectedUser(userData)}
      variant="solid"
      size="sm"
      color={"primary"}
      src={
        userData && userData.name !== "anonymous"
          ? `data:image/jpeg;base64,${userData.image}`
          : "/defaultUser.svg"
      }
      sx={{
        height: "var(--size-var)",
        width: "var(--size-var)",
        position: "absolute",
        top: 0,
        left: 0,
        transition: "transform 0.1s, box-shadow 0.1s",
        ...(selected ? activeStyle : inactiveStyle),
      }}
    >
      {getInitials(userData.name)}
    </Avatar>
  );
};

export default UserAvatar;
