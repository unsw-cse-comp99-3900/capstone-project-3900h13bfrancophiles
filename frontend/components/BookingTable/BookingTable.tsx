import React from "react";
import { Booking } from "@/types";
import {
  FormControl,
  FormLabel,
  IconButton,
  Option,
  Select,
  Sheet,
  Stack,
  Table,
  Typography,
} from "@mui/joy";
import { NoBookingsRow } from "@/components/BookingTable/NoBookingsRow";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Property } from "csstype";
import BookingStatusPill from "@/components/BookingTable/BookingStatusPill";
import { format } from "date-fns";
import SpaceColumn from "@/components/BookingTable/SpaceColumn";
import UserColumn from "@/components/BookingTable/UserColumn";

const defaultColumnRenderers = {
  "Reference No.": (booking: Booking) => <Typography level="body-sm">#{booking.id}</Typography>,
  Status: (booking: Booking) => <BookingStatusPill status={booking.currentstatus} />,
  Time: (booking: Booking) => (
    <Typography level="body-sm">
      {format(new Date(booking.starttime), "dd/MM/yy H:mm")} -{" "}
      {format(new Date(booking.endtime), "H:mm")}
    </Typography>
  ),
  Location: (booking: Booking) => <SpaceColumn spaceId={booking.spaceid} />,
  Description: (booking: Booking) => <Typography level="body-sm">{booking.description}</Typography>,
  User: (booking: Booking) => <UserColumn userId={booking.zid} />,
} as const;

type DefaultColumn = {
  heading: keyof typeof defaultColumnRenderers;
  width: number;
};

type CustomColumn = {
  heading: string;
  width: Property.Width<string | number>;
  render: (booking: Booking) => React.ReactNode;
};

export type BookingTableColumn = DefaultColumn | CustomColumn;

interface PaginatedBookingTableProps {
  columns: BookingTableColumn[];
  data?: Booking[];
  isLoading: boolean;
  noPagination?: false;
  total?: number;
  page: number;
  rowsPerPage: number;
  onChange: (page: number, rowsPerPage: number) => void;
}

interface UnpaginatedBookingTableProps {
  columns: BookingTableColumn[];
  data?: Booking[];
  isLoading: boolean;
  noPagination: true;
}

type BookingTableProps = PaginatedBookingTableProps | UnpaginatedBookingTableProps;

export default function BookingTable(props: BookingTableProps) {
  const { columns, data, isLoading, noPagination } = props;

  return (
    <Sheet
      variant="outlined"
      sx={{
        display: "initial",
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
        hoverRow={!!data?.length}
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
            {columns.map(({ width, heading }) => (
              <th key={heading} style={{ width: width, padding: "12px 6px" }}>
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length ? (
            data.map((booking) => (
              <tr key={booking.id}>
                {columns.map((column) => (
                  <td key={column.heading}>
                    {"render" in column
                      ? column.render(booking)
                      : defaultColumnRenderers[column.heading](booking)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <NoBookingsRow bookingType="Upcoming" colSpan={columns.length} isLoading={isLoading} />
          )}
        </tbody>
        {!noPagination && (
          <PaginationFooter
            numColumns={columns.length}
            total={props.total}
            page={props.page}
            rowsPerPage={props.rowsPerPage}
            onChange={props.onChange}
          />
        )}
      </Table>
    </Sheet>
  );
}

interface PaginationFooterProps {
  numColumns: number;
  total?: number;
  page: number;
  rowsPerPage: number;
  onChange: (page: number, rowsPerPage: number) => void;
}

function PaginationFooter({
  numColumns,
  total = 0,
  page,
  rowsPerPage,
  onChange,
}: PaginationFooterProps) {
  const from = page * rowsPerPage + 1;
  const to = Math.min(total, (page + 1) * rowsPerPage);

  return (
    <tfoot>
      <tr>
        <td colSpan={numColumns}>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={2}>
            <FormControl orientation="horizontal" size="sm">
              <FormLabel>Rows per page:</FormLabel>
              <Select
                required
                onChange={(_e, val) => val && onChange(0, val)}
                placeholder="5"
                value={rowsPerPage}
              >
                <Option value={5}>5</Option>
                <Option value={10}>10</Option>
                <Option value={25}>25</Option>
              </Select>
            </FormControl>
            <Typography textAlign="center" sx={{ minWidth: 80 }}>
              {from}-{to} of {total}
            </Typography>
            <Stack direction="row" gap={1}>
              <IconButton
                size="sm"
                color="neutral"
                variant="outlined"
                disabled={page === 0}
                onClick={() => onChange(page - 1, rowsPerPage)}
                sx={{ bgcolor: "background.surface" }}
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
              <IconButton
                size="sm"
                color="neutral"
                variant="outlined"
                disabled={page >= Math.ceil((total ?? 0) / rowsPerPage) - 1}
                onClick={() => onChange(page + 1, rowsPerPage)}
                sx={{ bgcolor: "background.surface" }}
              >
                <KeyboardArrowRightIcon />
              </IconButton>
            </Stack>
          </Stack>
        </td>
      </tr>
    </tfoot>
  );
}
