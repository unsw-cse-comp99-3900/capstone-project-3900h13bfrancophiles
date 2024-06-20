import * as React from 'react';
import Table from '@mui/joy/Table';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';

import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';



export default function PastBookings() {
  function createData(
    time: Date,
    space: string,
    description: string,
  ) {
    return { time, space, description };
  }

  const rows = [
    createData(new Date(), "ainsworth", "thesis"),
    createData(new Date(2024, 4, 4, 17, 23, 42, 11), "ainsworth", "hanging out"),
    createData(new Date(2025, 4, 4, 17, 23, 42, 11), "ainsworth", "giving franco a massage"),
  ];

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

  return (
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
      {rows.slice().sort((a, b) => a.time < b.time ? 1 : -1).map((row) => (
        <tr key={row.space}>
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

  </Table>
  );
}