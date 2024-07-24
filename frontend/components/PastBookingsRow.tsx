import * as React from "react";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import { Skeleton } from "@mui/joy";
import { format } from "date-fns";
import useSpace from "@/hooks/useSpace";
import NextLink from "next/link";
import { Booking } from "@/types";

interface PastBookingRowProps {
  row: Booking;
}

export default function PastBookingsRow({ row }: PastBookingRowProps) {
  const { space, type, isLoading } = useSpace(row.spaceid);

  return (
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
        <Skeleton loading={isLoading}>
          <Link
            href={type === "room" ? `/rooms/${row.spaceid}` : `/desks/${row.spaceid}`}
            level="body-sm"
            component={NextLink}
          >
            {space?.name}
          </Link>
        </Skeleton>
      </td>
      <td>
        <Typography level="body-sm">{row.description}</Typography>
      </td>
    </tr>
  );
}
