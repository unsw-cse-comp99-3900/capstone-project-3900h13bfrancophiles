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
import {Sheet, Skeleton, Stack} from "@mui/joy";
import {format} from 'date-fns';
import useSpace from "@/hooks/useSpace";
import usePendingBookings from "@/hooks/usePendingBookings";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/joy/Avatar';
import useUser from "@/hooks/useUser";
import {NoBookingsRow} from "@/components/PastBookings";


export interface PendingBookingRowProps {
  row: Row
}

interface Row {
  id: number,
  zid: number,
  startTime: Date,
  endTime: Date,
  space: string,
  description: string
}

function PastBookingsRow({row}: PendingBookingRowProps) {
  const {space, isLoading: spaceIsLoading} = useSpace(row.space);
  const {user, isLoading : userIsLoading} = useUser(row.zid);

  return <tr>
    <td>
      <Typography level="body-sm">
        {format(row.startTime, "dd/MM/yy k:mm")} - {format(row.endTime, "k:mm")}
      </Typography>
    </td>
    <td>
      <Skeleton loading={spaceIsLoading}>
        <Typography level="body-sm">{space?.name}</Typography>
      </Skeleton>
    </td>
    <td>
      <Skeleton loading={userIsLoading}>
        <Stack direction="row" alignItems='center' gap={2}>
          <Avatar color='primary'>
            {user?.fullname === undefined ? "" : getInitials(user?.fullname)}
          </Avatar>
          <Stack direction="column" >
            <Typography level="body-sm" fontWeight='lg'>{user?.fullname}</Typography>
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
        <IconButton variant="plain" color="success">
          <CheckIcon/>
        </IconButton>
        <IconButton variant="plain" color="danger">
          <CloseIcon/>
        </IconButton>
      </Stack>
    </td>
  </tr>;
}

function getInitials(fullname: string): string {
  const names = fullname.split(' ');
  return names[0][0] + names[names.length - 1][0];
}

export default function PendingBookings() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState<Row[]>([]);

  const [sort, setSort] = React.useState('soonest');
  const {pendingBookings, total, isLoading} = usePendingBookings(page + 1, rowsPerPage, sort);

  React.useEffect(() => {
    if (!isLoading && pendingBookings) {
      const rowsData = pendingBookings.map((booking) => ({
        id: booking.id,
        zid: booking.zid,
        startTime: new Date(booking.starttime),
        endTime: new Date(booking.endtime),
        space: booking.spaceid,
        description: booking.description,
      }));
      setRows(rowsData);
    }
  }, [page, rowsPerPage, pendingBookings, isLoading]);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any, newValue: number | null) => {
    setRowsPerPage(parseInt(newValue!.toString(), 10));
    setPage(0);
  };

  function labelDisplayedRows(from: number, to: number, count: number) {
    return `${from}–${to} of ${count}`;
  }

  const handleChangeSort = (event: any, newValue: string | null) => {
    if (newValue !== null) {
      setSort(newValue);
    }
  };

  const getLabelDisplayedRowsTo = () => {
    return Math.min(total ?? 0, (page + 1) * rowsPerPage);
  };

  return (<Stack>
    <Stack direction="row" width="100%" my={1} spacing={1}>
      <Box width="150px" >
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
        display: {xs: "initial"}, width: "100%", borderRadius: "sm", flexShrink: 1, overflow: "auto", minHeight: 0,
      }}
    >
      <Table
        aria-labelledby="tableTitle"
        stickyHeader
        hoverRow={rows.length !== 0}
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
          <th style={{width: 100, padding: "12px 6px"}}>Time</th>
          <th style={{width: 80, padding: "12px 6px"}}>Location</th>
          <th style={{width: 140, padding: "12px 6px"}}>User</th>
          <th style={{width: 140, padding: "12px 6px"}}>Description</th>
          <th style={{width: 50, padding: "12px 6px"}}></th>
        </tr>
        </thead>
        <tbody>
        {rows.length === 0
          ? <NoBookingsRow bookingType='Pending' colSpan={5}/>
          : rows.map((row) => (<PastBookingsRow key={row.id} row={row}/>))}
        </tbody>
        <tfoot>
        <tr>
          <td colSpan={5}>
            <Box
              sx={{
                display: "flex", alignItems: "center", gap: 2, justifyContent: "flex-end",
              }}
            >
              <FormControl orientation="horizontal" size="sm">
                <FormLabel>Rows per page:</FormLabel>
                <Select
                  onChange={handleChangeRowsPerPage}
                  placeholder="5"
                  value={rowsPerPage}
                >
                  <Option value={5}>5</Option>
                  <Option value={10}>10</Option>
                  <Option value={25}>25</Option>
                </Select>
              </FormControl>
              <Typography textAlign="center" sx={{minWidth: 80}}>
                {labelDisplayedRows(
                  rows.length === 0 ? 0 : page * rowsPerPage + 1,
                  getLabelDisplayedRowsTo(),
                  total ?? 0,
                )}
              </Typography>
              <Box sx={{display: "flex", gap: 1}}>
                <IconButton
                  size="sm"
                  color="neutral"
                  variant="outlined"
                  disabled={page === 0}
                  onClick={() => handleChangePage(page - 1)}
                  sx={{bgcolor: "background.surface"}}
                >
                  <KeyboardArrowLeftIcon/>
                </IconButton>
                <IconButton
                  size="sm"
                  color="neutral"
                  variant="outlined"
                  disabled={page >= Math.ceil(total === undefined ? -1 : total / rowsPerPage) - 1}
                  onClick={() => handleChangePage(page + 1)}
                  sx={{bgcolor: "background.surface"}}
                >
                  <KeyboardArrowRightIcon/>
                </IconButton>
              </Box>
            </Box>
          </td>
        </tr>
        </tfoot>
      </Table>
    </Sheet>
  </Stack>);
}
