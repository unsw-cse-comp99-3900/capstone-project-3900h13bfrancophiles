"use client";

import React from "react";
import { Avatar } from "@mui/joy";
import { UserData } from "@/types";
import useUser from "@/hooks/useUser";
import { getInitials } from "@/utils/icons";

interface UserAvatarProps {
  zid: number;
  selected: boolean;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
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

const UserAvatar = ({ zid, selected, setUser }: UserAvatarProps) => {
  const { user } = useUser(zid);
  const userData = user ? { name: user.fullname, image: user.image } : anonymousUser;

  React.useEffect(() => {
    setUser(userData);
  }, [user]);

  return (
    <Avatar
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
