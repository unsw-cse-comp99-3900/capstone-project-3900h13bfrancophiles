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
import MenuItem from '@mui/joy/MenuItem';
import Checkbox from '@mui/joy/Checkbox';
import Switch from '@mui/joy/Switch';




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
    createData(1, new Date(2021, 4, 1, 17, 23, 42, 11), "K17 G03", "Thesis"),
    createData(2, new Date(2022, 4, 2, 17, 23, 42, 11), "K17 G03", "Gaming"),
    createData(3, new Date(2023, 4, 3, 17, 23, 42, 11), "K17 G02", "Society event"),
    createData(4, new Date(2024, 4, 4, 17, 23, 42, 11), "K17 G02", "Working"),
    createData(5, new Date(2025, 4, 5, 17, 23, 42, 11), "K17 G03", "Assignment"),
    createData(6, new Date(2026, 4, 6, 17, 23, 42, 11), "K17 G03", "Filming a video"),
    createData(7, new Date(2027, 4, 7, 17, 23, 42, 11), "K17 G02", "Class"),
  ];
  const spaces = rows.map((a) => a.space).sort().filter((item, pos, ary) => !pos || item != ary[pos - 1]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedSpaces, setSelectedSpaces] = React.useState(spaces);
  const [filteredRows, setFilteredRows] = React.useState(rows.sort((a, b) => a.time < b.time ? 1 : -1));
  const [sortNewest, setSortNewest] = React.useState(true);

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

  const handleChangeFilter = (event: any) => {
    const value = event.target.value;
    setSelectedSpaces(selectedSpaces.includes(value) ? selectedSpaces.filter(i => i != value) : [...selectedSpaces, value])
  }

  const handleChangeSort = (event: React.SyntheticEvent | null, newValue: string | null,) => {
    setSortNewest(newValue === "newest")
  }

  React.useEffect(() => {
    setFilteredRows(rows.filter(r => selectedSpaces.includes(r.space)).sort((a, b) => a.time < b.time ? (sortNewest ? 1 : -1) : (sortNewest ? -1 : 1)))
  }, [selectedSpaces, sortNewest])

  const getLabelDisplayedRowsTo = () => {
    if (filteredRows.length === -1) {
      return (page + 1) * rowsPerPage;
    }
    return rowsPerPage === -1
      ? filteredRows.length
      : Math.min(filteredRows.length, (page + 1) * rowsPerPage);
  };

  return (
  <Sheet>
    <Box sx={{ width: 400, margin: "10px 0", display: "flex", gap: "5px"}}>
      <Box sx={{ flex: 1 }}>
        Space
        <Select
          sx={{ flex: 1 }}
          placeholder="Filter by space"
          multiple
        >
          {spaces.map((space) => (
            <MenuItem>
              <Checkbox
                checked={selectedSpaces.includes(space)}
                onChange={(event) => handleChangeFilter(event)}
                label={space}
                value={space}
              />
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={{ flex: 1 }}>
        Time
        <Select
          defaultValue="newest"
          onChange={handleChangeSort}
          sx={{ flex: 1 }}
        >
          <Option value="newest">Newest</Option>
          <Option value="oldest">Oldest</Option>
        </Select>
      </Box>
    </Box>
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
        {filteredRows
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row) => (
            <tr key={row.id}>
              <td >
                <Typography level="body-xs" suppressHydrationWarning>{row.time.toLocaleString()}</Typography>
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
                  from: filteredRows.length === 0 ? 0 : page * rowsPerPage + 1,
                  to: getLabelDisplayedRowsTo(),
                  count: filteredRows.length === -1 ? -1 : filteredRows.length,
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
                    filteredRows.length !== -1
                      ? page >= Math.ceil(filteredRows.length / rowsPerPage) - 1
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