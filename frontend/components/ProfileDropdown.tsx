import {
  Avatar,
  Dropdown,
  ListDivider,
  Menu,
  MenuButton,
  MenuItem,
  Stack,
} from "@mui/joy";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import LogoutButton from "@/components/LogoutButton";
import { UserGroup } from "@/types";
import useUser from "@/hooks/useUser";
import { getInitials } from "@/utils/icons";

export default function ProfileDropdown({ zid }: { zid: number }) {
  const { user } = useUser(zid);

  return (
    <Dropdown>
      <MenuButton
        variant="plain"
        size="sm"
        sx={{ maxWidth: "32px", maxHeight: "32px", borderRadius: "9999999px" }}
      >
        <Avatar
          variant="soft"
          color="neutral"
          size="sm"
          src={user?.image ? `data:image/jpeg;base64,${user.image}` : undefined}
        >
          {user?.fullname ? getInitials(user.fullname) : undefined}
        </Avatar>
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
          <Avatar
            variant="soft"
            color="neutral"
            size="sm"
            src={user?.image ? `data:image/jpeg;base64,${user.image}` : undefined}
          >
            {user?.fullname ? getInitials(user.fullname) : undefined}
          </Avatar>
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
        <MenuItem>
          <LogoutButton paddingRight={12} />
        </MenuItem>
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
