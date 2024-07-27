"use client";
import * as React from "react";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import { Sheet, Skeleton, Stack } from "@mui/joy";
import { format } from "date-fns";
import Avatar from "@mui/joy/Avatar";
import useUser from "@/hooks/useUser";

import { Booking } from "@/types";

function OverlappingBookingsRow({ row }: { row: Booking }) {
  const { user, isLoading: userIsLoading } = useUser(row.zid);

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
          <Skeleton loading={userIsLoading}>
            <Stack direction="row" alignItems="center" gap={2}>
              <Avatar color="primary">
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
      </tr>
    </>
  );
}

export function getInitials(fullname: string): string {
  const names = fullname.split(" ");
  return names[0][0] + names[names.length - 1][0];
}

export default function OverlappingBookings({
  overlappingBookings,
}: {
  overlappingBookings: Booking[];
}) {
  return (
    <Stack>
      <Sheet
        variant="outlined"
        sx={{
          display: { xs: "initial" },
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow={!!overlappingBookings?.length}
          sx={{
            "--TableCell-headBackground": "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 60, padding: "12px 6px" }}>Reference No.</th>
              <th style={{ width: 100, padding: "12px 6px" }}>Time</th>
              <th style={{ width: 140, padding: "12px 6px" }}>User</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {overlappingBookings.map((row) => (
              <OverlappingBookingsRow key={row.id} row={row} />
            ))}
          </tbody>
        </Table>
      </Sheet>
    </Stack>
  );
}
