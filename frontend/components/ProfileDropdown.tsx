import { Avatar, Dropdown, ListDivider, Menu, MenuButton, Skeleton, Stack } from "@mui/joy";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import LogoutButton from "@/components/LogoutButton";
import { getCookie } from "cookies-next";
import { decodeJwt } from "jose";
import { TokenPayload, UserGroup } from "@/types";
import useUser from "@/hooks/useUser";
import { getInitials } from "@/components/PendingBookingsRow";

export default function ProfileDropdown() {
  const token = getCookie("token");
  const zid = decodeJwt<TokenPayload>(`${token}`).user;
  const { user, isLoading } = useUser(zid);

  return (
    <Dropdown>
      <MenuButton
        variant="plain"
        size="sm"
        sx={{ maxWidth: "32px", maxHeight: "32px", borderRadius: "9999999px" }}
      >
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
      </MenuButton>
      <Menu
        placement="bottom-end"
        size="sm"
        sx={{
          zIndex: "99999",
          p: 1,
          gap: 1,
          "--ListItem-radius": "var(--joy-radius-sm)",
        }}
      >
        <Stack p={0.5} direction="row" alignItems="center">
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
        <ListDivider />
        <LogoutButton paddingRight={12} />
      </Menu>
    </Dropdown>
  );
}

const roleNames: { [key in UserGroup]: string } = {
  admin: "Admin",
  csestaff: "CSE Staff",
  hdr: "HDR Student",
  other: "Other",
};

export function getRoleName(role: UserGroup): string {
  return roleNames[role] || "Unknown role";
}
