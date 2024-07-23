'use client';

import FloorPlanViewer from "@/components/FloorPlanViewer";
import BookingModal from "@/components/BookingModal/BookingModal";
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Stack,
  Input,
  Button,
  Box,
  Sheet,
  Avatar,
  Typography,
  Link,
  FormControl,
  IconButton
} from "@mui/joy";
import CloseIcon from '@mui/icons-material/Close';
import * as React from 'react';
import { UserData } from "@/types";
import useTimeRange from "@/hooks/useTimeRange";
import NextLink from "next/link"
import useSpaceStatus from '@/hooks/useSpaceStatus';
import JoyTimePicker from '@/components/JoyTimePicker';
import useDesks from '@/hooks/useDesks';

const floors = ["K17 L2", "K17 L3", "K17 L4", "K17 L5"];

export default function Desks() {
  const {
    date, start, end,
    dateInputProps, startTimePickerProps, endTimePickerProps
  } = useTimeRange();

  const getInitials = (name: string) => {
    const words = name.trim().split(" ", 2);
    const firstLetter = words[0] ? words[0][0] : '';
    const secondLetter = words[1] ? words[1][0] : '';
    return (firstLetter + secondLetter).toUpperCase();
  }

  const [selectedDesk, setSelectedDesk] = React.useState("");
  const [available, setAvailable] = React.useState(false);
  const [user, setUser] = React.useState<null | UserData>(null);
  const [deskName, setDeskName] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const { desks } = useDesks();
  const { statusResponse } = useSpaceStatus(start.toISOString(), end.toISOString());

  React.useEffect(() => {
    setSelectedDesk("");
  }, [date, start, end]);

  return (
    <React.Fragment>
      {open && <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        space={{ id: selectedDesk, name: deskName, isRoom: false }}
        date={date}
        start={start}
        end={end}
      />}
      <Stack direction="column" sx={{
        zIndex: 2,
        position: "absolute",
        top: 60,
        right: 0,
        padding: 1,
        margin: 1,
        width: { xs: "calc(100vw - 32px)", sm: "auto" }
      }}>
        <Sheet variant="plain"
          sx={{
            boxShadow: "md",
            borderRadius: 10,
            padding: 1.5,
            marginBottom: 1.5,
            width: '100%'
          }}>
          <Stack direction="column">
            <Typography level="h4">
              Search for available desks:
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 1, mb: 1 }}>
              <FormControl sx={{ xs: "100%", sm: 150 }}>
                <Input {...dateInputProps} />
              </FormControl>
              <Stack direction="row" spacing={2} width={{ xs: "100%", sm: 270 }}>
                <JoyTimePicker sx={{ pl: 0 }} {...startTimePickerProps} />
                <JoyTimePicker sx={{ pl: 0 }} {...endTimePickerProps} />
              </Stack>
            </Stack>
          </Stack>
        </Sheet>
        <Sheet
          variant="plain"
          sx={{
            display: selectedDesk ? "block" : "none",
            boxShadow: "md",
            borderRadius: 10,
            padding: 1.5,
            width: "100%"
          }}>
          <Stack direction="column">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography component="h2">
                {deskName}
              </Typography>
              <IconButton size="sm" onClick={() => setSelectedDesk("")}>
                <CloseIcon />
              </IconButton>
            </Stack>
            <Button sx={{ display: available ? "block" : "none", marginTop: 1, width: "100%" }} onClick={() => setOpen(true)}>
              Book {deskName}
            </Button>
            <Box sx={{ display: available ? "none" : "flex", flexDirection: { xs: "row", sm: "column" }, justifyContent: "space-around", alignItems: "center", }}>
              <Avatar
                variant="solid"
                color="primary"
                src={user?.name && user.name !== "anonymous" ? `data:image/jpeg;base64,${user.image}` : "defaultUser.svg"}
                alt={user ? user.name : "user"}
                sx={{ height: { xs: "70px", sm: "100px" }, width: { xs: "70px", sm: "100px" }, margin: 1 }}
              >
                {getInitials(user?.name ?? '')}
              </Avatar>
              <Typography>
                {user?.name ?? ""}
              </Typography>
            </Box>
            <Link
              level="body-xs"
              sx={{ display: selectedDesk ? "block" : "none", paddingTop: 1, margin: "auto" }}
              component={NextLink}
              href={`/desks/${selectedDesk}`}
            >
              <Typography> View all availabilities</Typography>
            </Link>
          </Stack>
        </Sheet>
      </Stack>
      <Tabs
        aria-label="level select"
        defaultValue={"K17 L2"}
        sx={{ height: "calc(100vh - 60px)" }}
      >
        {floors.map((floor, index) => (
          <TabPanel
            key={index}
            variant="plain"
            color="neutral"
            value={floor}
            sx={{
              height: "calc(100% - 45px)",
              padding: 0
            }}
          >
            <FloorPlanViewer
              selectedDesk={selectedDesk}
              setSelectedDesk={setSelectedDesk}
              setSelectedUser={setUser}
              setAvailable={setAvailable}
              setDeskName={setDeskName}
              floor={floor}
              desks={desks?.filter((desk) => desk.floor === floor) || []}
              statuses={statusResponse || {}}
            />
          </TabPanel>
        ))}
        <TabList underlinePlacement="top" sx={{ height: 45 }}>
          {floors.map((floor, index) => (
            <Tab
              key={index}
              variant="plain"
              color="neutral"
              indicatorPlacement="top"
              value={floor}
            >
              {floor}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </React.Fragment>
  )
}