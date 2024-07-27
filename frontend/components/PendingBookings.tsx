"use client";
import * as React from "react";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalDialog,
  Sheet,
  Skeleton,
  Stack,
} from "@mui/joy";
import { format } from "date-fns";
import useSpace from "@/hooks/useSpace";
import usePendingBookings from "@/hooks/usePendingBookings";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/joy/Avatar";
import useUser from "@/hooks/useUser";
import useOverlappingBookings from "@/hooks/useOverlappingBookings";

import { NoBookingsRow } from "@/components/NoBookingsRow";
import { Booking } from "@/types";
import { approveBooking, declineBooking } from "@/api";
import { mutate } from "swr";

export interface PendingBookingRowProps {
  row: Booking;
  page: number;
  rowsPerPage: number;
  sort: string;
}

function PendingBookingsRow({ row, page, rowsPerPage, sort }: PendingBookingRowProps) {
  const { space, isLoading: spaceIsLoading } = useSpace(row.spaceid);
  const { user, isLoading: userIsLoading } = useUser(row.zid);

  const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);
  const [isApprovingOrDeclining, setIsApprovingOrDeclining] = React.useState(false);
  const [approving, setApproving] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [approveDeclineError, setApproveDeclineError] = React.useState<string | null>(null);

  const { bookings } = useOverlappingBookings(row.id);

  console.log(bookings);
  const handleApproveDecline = async () => {
    setIsApprovingOrDeclining(true);
    if (approving) {
      // approve booking
      try {
        await approveBooking(row.id);
        await mutate(`/admin/bookings/pending?page=${page + 1}&limit=${rowsPerPage}&sort=${sort}`);
      } catch (error) {
        if (error instanceof Error) {
          setApproveDeclineError(error.message);
        } else {
          setApproveDeclineError("An unexpected error occurred");
        }
        // TODO: handle error
      } finally {
        setIsApprovingOrDeclining(false);
        setIsConfirmationOpen(false);
      }
      return;
    } else {
      // Decline booking
      try {
        await declineBooking(row.id);
        await mutate(`/admin/bookings/pending?page=${page + 1}&limit=${rowsPerPage}&sort=${sort}`);
      } catch (error) {
        if (error instanceof Error) {
          setApproveDeclineError(error.message);
        } else {
          setApproveDeclineError("An unexpected error occurred");
        }
        // TODO: handle error
      } finally {
        setIsApprovingOrDeclining(false);
        setIsConfirmationOpen(false);
      }
    }
  };

  return (
    <>
      <tr>
        <td>
          <Typography level="body-sm">
            {format(new Date(row.starttime), "dd/MM/yy H:mm")} -{" "}
            {format(new Date(row.endtime), "H:mm")}
          </Typography>
        </td>
        <td>
          <Skeleton loading={spaceIsLoading}>
            <Typography level="body-sm">{space?.name}</Typography>
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
                <Typography level="body-sm">{user?.email}</Typography>
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
      <Modal open={isConfirmationOpen} onClose={() => setIsConfirmationOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            {approving
              ? "Booking Request Approval Confirmation"
              : "Booking Request Decline Confirmation"}
          </DialogTitle>
          <Divider />
          <DialogContent>
            Are you sure you want to{" "}
            {approving ? "approve this booking request " : "decline this booking request"}
            ?
            <br />
            {/* TODO: Show the overlapping bookings and display how many there are */}
            {approving &&
              "Approving this booking will automatically decline any overlapping bookings."}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleApproveDecline}
              color={approving ? "success" : "danger"}
              loading={isApprovingOrDeclining}
            >
              {approving ? "Approve" : "Decline"}
            </Button>
            <Button variant="plain" color="neutral" onClick={() => setIsConfirmationOpen(false)}>
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
}

export function getInitials(fullname: string): string {
  const names = fullname.split(" ");
  return names[0][0] + names[names.length - 1][0];
}

export default function PendingBookings() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [sort, setSort] = React.useState("soonest");
  const { pendingBookings, total, isLoading } = usePendingBookings(page + 1, rowsPerPage, sort);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: unknown, newValue: number | null) => {
    setRowsPerPage(parseInt(newValue!.toString(), 10));
    setPage(0);
  };

  function labelDisplayedRows(from: number, to: number, count: number) {
    return `${from}–${to} of ${count}`;
  }

  const handleChangeSort = (event: unknown, newValue: string | null) => {
    if (newValue !== null) {
      setSort(newValue);
    }
  };

  const getLabelDisplayedRowsTo = () => {
    return Math.min(total ?? 0, (page + 1) * rowsPerPage);
  };

  const numColumns = 5;

  return (
    <Stack>
      <Stack direction="row" width="100%" my={1} spacing={1}>
        <Box width="150px">
          Sort
          <Select defaultValue="soonest" placeholder="Soonest" onChange={handleChangeSort}>
            <Option value="soonest">Soonest</Option>
            <Option value="latest">Latest</Option>
          </Select>
        </Box>
      </Stack>
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
          hoverRow={!!pendingBookings?.length}
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
              <th style={{ width: 100, padding: "12px 6px" }}>Time</th>
              <th style={{ width: 80, padding: "12px 6px" }}>Location</th>
              <th style={{ width: 140, padding: "12px 6px" }}>User</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Description</th>
              <th style={{ width: 50, padding: "12px 6px" }}></th>
            </tr>
          </thead>
          <tbody>
            {pendingBookings?.length ? (
              pendingBookings.map((row) => (
                <PendingBookingsRow
                  key={row.id}
                  row={row}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  sort={sort}
                />
              ))
            ) : (
              <NoBookingsRow bookingType="Pending" colSpan={numColumns} isLoading={isLoading} />
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={numColumns}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    justifyContent: "flex-end",
                  }}
                >
                  <FormControl orientation="horizontal" size="sm">
                    <FormLabel>Rows per page:</FormLabel>
                    <Select onChange={handleChangeRowsPerPage} placeholder="5" value={rowsPerPage}>
                      <Option value={5}>5</Option>
                      <Option value={10}>10</Option>
                      <Option value={25}>25</Option>
                    </Select>
                  </FormControl>
                  <Typography textAlign="center" sx={{ minWidth: 80 }}>
                    {labelDisplayedRows(
                      pendingBookings ? page * rowsPerPage + 1 : 0,
                      getLabelDisplayedRowsTo(),
                      total ?? 0,
                    )}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      size="sm"
                      color="neutral"
                      variant="outlined"
                      disabled={page === 0}
                      onClick={() => handleChangePage(page - 1)}
                      sx={{ bgcolor: "background.surface" }}
                    >
                      <KeyboardArrowLeftIcon />
                    </IconButton>
                    <IconButton
                      size="sm"
                      color="neutral"
                      variant="outlined"
                      disabled={page >= Math.ceil((total ?? 0) / rowsPerPage) - 1}
                      onClick={() => handleChangePage(page + 1)}
                      sx={{ bgcolor: "background.surface" }}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </Box>
                </Box>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Sheet>
    </Stack>
  );
}
