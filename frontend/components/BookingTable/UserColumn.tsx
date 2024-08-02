import * as React from "react";
import Avatar from "@mui/joy/Avatar";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

import { getInitials } from "@/utils/icons";
import useUser from "@/hooks/useUser";

export default function UserColumn({ userId }: { userId: number }) {
  const { user, isLoading } = useUser(userId);

  return (
    <Skeleton loading={isLoading}>
      <Stack direction="row" alignItems="center" gap={2}>
        <Avatar
          color="primary"
          src={user?.image ? `data:image/jpeg;base64,${user.image}` : undefined}
        >
          {user?.fullname === undefined ? "" : getInitials(user?.fullname)}
        </Avatar>
        <Stack direction="column">
          <Typography level="body-sm" fontWeight="lg">
            {user?.fullname}
          </Typography>
          <Typography level="body-sm">z{user?.zid}</Typography>
        </Stack>
      </Stack>
    </Skeleton>
  );
}
