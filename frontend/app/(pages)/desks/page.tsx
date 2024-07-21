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
  FormControl
} from "@mui/joy";
import { deskData } from '@/app/data';
import * as React from 'react';
import { UserData } from "@/types";
import useTimeRange from "@/hooks/useTimeRange";
import NextLink from "next/link"
import useSpaceStatus from '@/hooks/useSpaceStatus';
import JoyTimePicker from '@/components/JoyTimePicker';

export default function desks() {
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
      <Sheet variant="plain"
        sx={{
          boxShadow: "md",
          borderRadius: 10,
          zIndex: 2,
          position: "absolute",
          top: 60,
          right: 0,
          padding: 1.5,
          margin: 2,
          width: { xs: "calc(100vw - 32px)", sm: "auto" }
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
              <JoyTimePicker {...startTimePickerProps} />
              <JoyTimePicker {...endTimePickerProps} />
            </Stack>
          </Stack>
          <Button sx={{ display: available && selectedDesk ? "block" : "none", marginTop: 1, width: "100%" }} onClick={() => setOpen(true)}>
            Book {deskName}
          </Button> {
            // TODO PRESSING THIS BUTTON IS RERENDERING
          }
          <Box sx={{ display: available || selectedDesk === "" ? "none" : "flex", flexDirection: { xs: "row", sm: "column" }, justifyContent: "space-around", alignItems: "center", }}>
            <Typography component="h2">
              {deskName}
            </Typography>
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
            sx={{ display: selectedDesk ? "block" : "none", paddingTop: 1, margin: "auto"}}
            component={NextLink}
            href={`/desks/${selectedDesk}`}
          >
            <Typography> View all availabilities</Typography>
          </Link>
        </Stack>
      </Sheet>
      <Tabs
        aria-label="level select"
        defaultValue={"K17L2"}
        sx={{ height: "calc(100vh - 60px)" }}
      >
        {deskData.map((level, index) => (
          <TabPanel
            key={index}
            variant="plain"
            color="neutral"
            value={level.level}
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
              level={level.level}
              statuses={statusResponse || {}}
            />
          </TabPanel>
        ))}
        <TabList underlinePlacement="top" sx={{ height: 45 }}>
          {deskData.map((level, index) => (
            <Tab
              key={index}
              variant="plain"
              color="neutral"
              indicatorPlacement="top"
              value={level.level}
            >
              {level.level}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </React.Fragment>
  )
}