"use client";
import * as React from "react";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import { Link, Skeleton, Stack } from "@mui/joy";
import { format } from "date-fns";
import useSpace from "@/hooks/useSpace";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/joy/Avatar";
import useUser from "@/hooks/useUser";
import NextLink from "next/link";
import ApproveDeclineModal from "@/components/ApproveDeclineModal";

import { Booking } from "@/types";

export interface PendingBookingRowProps {
  row: Booking;
  page: number;
  rowsPerPage: number;
  sort: string;
}

export default function PendingBookingsRow({
  row,
  page,
  rowsPerPage,
  sort,
}: PendingBookingRowProps) {
  const { space, type, isLoading: spaceIsLoading } = useSpace(row.spaceid);
  const { user, isLoading: userIsLoading } = useUser(row.zid);

  const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);
  const [approving, setApproving] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [approveDeclineError, setApproveDeclineError] = React.useState<string | null>(null);

  return (
    <>
      <tr>
        <td>
          <Typography level="body-sm">#{row.id}</Typography>
        </td>
        <td>
          <Typography level="body-sm">
            {format(new Date(row.starttime), "dd/MM/yy H:mm")} -{" "}
            {format(new Date(row.endtime), "H:mm")}
          </Typography>
        </td>
        <td>
          <Skeleton loading={spaceIsLoading}>
            <Link
              href={type === "room" ? `/rooms/${row.spaceid}` : `/desks/${row.spaceid}`}
              level="body-sm"
              component={NextLink}
            >
              {space?.name}
            </Link>{" "}
          </Skeleton>
        </td>
        <td>
          <Skeleton loading={userIsLoading}>
            <Stack direction="row" alignItems="center" gap={2}>
              <Avatar variant="solid" color="primary">
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
        </td>
        <td>
          <Typography level="body-sm">{row.description}</Typography>
        </td>
        <td>
          <Stack direction="row" justifyContent="flex-end" px={1}>
            <IconButton
              variant="plain"
              color="success"
              onClick={() => {
                setIsConfirmationOpen(true);
                setApproving(true);
              }}
            >
              <CheckIcon />
            </IconButton>
            <IconButton
              variant="plain"
              color="danger"
              onClick={() => {
                setIsConfirmationOpen(true);
                setApproving(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </td>
      </tr>
      <ApproveDeclineModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        approving={approving}
        row={row}
        page={page}
        rowsPerPage={rowsPerPage}
        sort={sort}
        setApproveDeclineError={setApproveDeclineError}
      />
    </>
  );
}

export function getInitials(fullname: string): string {
  const names = fullname.split(" ");
  return names[0][0] + names[names.length - 1][0];
}
