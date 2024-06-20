'use client'
import * as React from 'react';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { CheckBox } from '@mui/icons-material';




export default function PastBookings() {
  function createData(
    id: number,
    time: Date,
    space: string,
    description: string,
  ) {
    return { id, time, space, description };
  }

  const rows = [
    createData(1, new Date(2024, 4, 4, 17, 23, 42, 11), "ainsworth", "thesis"),
    createData(2, new Date(2024, 4, 4, 17, 23, 42, 11), "ainsworth", "hanging out"),
    createData(3, new Date(2025, 4, 4, 17, 23, 42, 11), "ainsworth", "giving franco a massage"),
    createData(4, new Date(2024, 4, 4, 17, 23, 42, 11), "farnsworth", "wesis"),
    createData(5, new Date(2024, 4, 4, 17, 23, 42, 11), "ainsworth", "wanging out"),
    createData(6, new Date(2025, 4, 4, 17, 23, 42, 11), "ainsworth", "wiving franco a massage"),
    createData(7, new Date(2024, 4, 4, 17, 23, 42, 11), "ainsworth", "wss"),
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const places = rows.map((a) => a.space).sort().filter((item, pos, ary) => !pos || item != ary[pos - 1]);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any, newValue: number | null) => {
    setRowsPerPage(parseInt(newValue!.toString(), 10));
    setPage(0);
  };

  function labelDisplayedRows({
    from,
    to,
    count,
  }: {
    from: number;
    to: number;
    count: number;
  }) {
    return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
  }

  const getLabelDisplayedRowsTo = () => {
    if (rows.length === -1) {
      return (page + 1) * rowsPerPage;
    }
    return rowsPerPage === -1
      ? rows.length
      : Math.min(rows.length, (page + 1) * rowsPerPage);
  };

  return (
  <Sheet>
    <Table
      aria-labelledby="tableTitle"
      stickyHeader
      hoverRow
      sx={{
        '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
        '--Table-headerUnderlineThickness': '1px',
        '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
        '--TableCell-paddingY': '4px',
        '--TableCell-paddingX': '8px',
      }}
    >
      <thead>
        <tr>
          <th style={{ width: 140, padding: '12px 6px' }}>Time</th>
          <th style={{ width: 140, padding: '12px 6px' }}>Space</th>
          <th style={{ width: 240, padding: '12px 6px' }}>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.sort((a, b) => a.time < b.time ? 1 : -1).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
          <tr key={row.id}>
            <td>
              <Typography level="body-xs">{row.time.toLocaleString()}</Typography>
            </td>
            <td>
              <Typography level="body-xs">{row.space}</Typography>
            </td>
            <td>
              <Typography level="body-xs">{row.description}</Typography>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
            <tr>
              <td colSpan={3}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    justifyContent: 'flex-end',
                  }}
                >
                  <FormControl orientation="horizontal" size="sm">
                    <FormLabel>Rows per page:</FormLabel>
                    <Select onChange={handleChangeRowsPerPage} value={rowsPerPage}>
                      <Option value={5}>5</Option>
                      <Option value={10}>10</Option>
                      <Option value={25}>25</Option>
                    </Select>
                  </FormControl>
                  <Typography textAlign="center" sx={{ minWidth: 80 }}>
                    {labelDisplayedRows({
                      from: rows.length === 0 ? 0 : page * rowsPerPage + 1,
                      to: getLabelDisplayedRowsTo(),
                      count: rows.length === -1 ? -1 : rows.length,
                    })}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="sm"
                      color="neutral"
                      variant="outlined"
                      disabled={page === 0}
                      onClick={() => handleChangePage(page - 1)}
                      sx={{ bgcolor: 'background.surface' }}
                    >
                      <KeyboardArrowLeftIcon />
                    </IconButton>
                    <IconButton
                      size="sm"
                      color="neutral"
                      variant="outlined"
                      disabled={
                        rows.length !== -1
                          ? page >= Math.ceil(rows.length / rowsPerPage) - 1
                          : false
                      }
                      onClick={() => handleChangePage(page + 1)}
                      sx={{ bgcolor: 'background.surface' }}
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
  );
}