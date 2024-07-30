import {Avatar, Dropdown, ListDivider, Menu, MenuButton, MenuItem} from "@mui/joy";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import LogoutButton from "@/components/LogoutButton";
import {getCookie} from "cookies-next";
import {decodeJwt} from "jose";
import {TokenPayload} from "@/types";
import useUser from "@/hooks/useUser";
import {getInitials} from "@/components/PendingBookingsRow";

export default function ProfileDropdown() {
  const token = getCookie("token");
  let zid = decodeJwt<TokenPayload>(`${token}`).user;
  const { user, isLoading, error } = useUser(zid);


  return (
    <Dropdown>
      <MenuButton
        variant="plain"
        size="sm"
        sx={{ maxWidth: '32px', maxHeight: '32px', borderRadius: '9999999px' }}
      >
        <Avatar
          src={user?.image ? user?.image : ""}
          sx={{ maxWidth: '32px', maxHeight: '32px' }}
        >

        </Avatar>
      </MenuButton>
      <Menu
        placement="bottom-end"
        size="sm"
        sx={{
          zIndex: '99999',
          p: 1,
          gap: 1,
          '--ListItem-radius': 'var(--joy-radius-sm)',
        }}
      >
          <Box
            p={0.5}
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar
              src={user?.image ? user?.image : ""}
              sx={{ maxWidth: '32px', maxHeight: '32px' }}
            >
              {!user?.image && getInitials(user?.fullname ? user?.fullname : "N A")}
            </Avatar>
            <Box sx={{ ml: 1.5 }}>
              <Typography level="title-sm" textColor="text.primary">
                {user?.fullname}
              </Typography>
              <Typography level="body-xs" textColor="text.tertiary">
                z{user?.zid}
              </Typography>
            </Box>
          </Box>
        <ListDivider />
        <MenuItem>
          <LogoutButton/>
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}