'use client';

import FloorPlanViewer from "@/components/FloorPlanViewer";
import { Tab, TabList, TabPanel, Tabs, Stack, Input, Button, Box, Sheet, Avatar, Modal, ModalClose, ModalDialog, DialogTitle, DialogContent, Typography } from "@mui/joy";
import { deskData } from '@/app/data';
import * as React from 'react';
import { Status } from "@/types";
import useUser from "@/hooks/useUser";

type UserData = {
  name: string,
  image: string | null,
}

const anonymousUser: UserData = {
  name: "anonymous",
  image: null,
}

const exampleStatuses: { [spaceId: string]: Status } = {
  "K-K17-201-1": { status: "available" },
  "K-K17-201-2": { status: "available" },
  "K-K17-201-3": {
    status: "unavailable",
    booking: {
      id: 1,
      zid: 1234567,
      starttime: "3",
      endtime: "4",
      spaceid: "2",
      currentstatus: "checked in",
      description: "Umar is at this table!",
      checkintime: null,
      checkouttime: null
    }
  },
  "K-K17-201-4": { status: "available" },
  "K-K17-301-11": { status: "available" },
  "K-K17-301-12": {
    status: "unavailable",
    booking: {
      id: 1,
      zid: 7654321,
      starttime: "3",
      endtime: "4",
      spaceid: "2",
      currentstatus: "checked in",
      description: "Umar is at this table!",
      checkintime: null,
      checkouttime: null
    }
  },
  "K-K17-301-13": { status: "available" },
  "K-K17-301-14": { status: "available" },
  "K-K17-301-15": { status: "available" },
  "K-K17-301-16": { status: "available" },
};

// will eventually get backend data
const getUser = (zid: number) => {
  return useUser(zid);
}

export default function desks() {
  const [date, setDate] = React.useState(
    new Date().toISOString().split("T")[0].toString()
  );
  const [startTime, setStartTime] = React.useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const [endTime, setEndTime] = React.useState(
    new Date(new Date().getTime() + 60 * 60 * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const [selectedDesk, setSelectedDesk] = React.useState("");
  const [available, setAvailable] = React.useState(false);
  const [user, setUser] = React.useState<null | UserData>(null);
  const [open, setOpen] = React.useState(false); // for confirmation modal

  const statuses = exampleStatuses; // make this function only return desks (ie spaces that have deskdata)

  const users = (() => {
    const users: { [desk: string]: UserData } = {};
    for (const desk in statuses) {
      const status = statuses[desk];
      if (status.status === "unavailable") {
        const u = getUser(status.booking.zid);
        users[desk] = u.user ? { name: u.user.fullname, image: u.user.image } : anonymousUser;
      }
    }
    return users;
  })();

  React.useEffect(() => {
    const status = statuses[selectedDesk];
    if (status) {
      if (status.status === "available") {
        setAvailable(true);
        setUser(null);
      } else {
        setAvailable(false);
        setUser(users[selectedDesk])
      }
    }
  }, [selectedDesk]);

  return (
    <React.Fragment>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Confirm booking</DialogTitle>
          <ModalClose />
          <DialogContent>
            <Typography>
              {date}
            </Typography>
            <Typography>
              {startTime} - {endTime}
            </Typography>
          </DialogContent>
          <Button
            onClick={() => {
              alert("booked!");
              setOpen(false);
            }}
          >
            Book
          </Button>
        </ModalDialog>
      </Modal>
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
          <Stack direction="row" gap={2} flexWrap="wrap" sx={{ marginTop: 1, marginBottom: 1 }}>
            <Input
              sx={{ width: { xs: "100%", sm: "auto" } }}
              type="date"
              defaultValue={date}
              onChange={(event) => {
                const d = new Date(event.target.value)
                  .toISOString()
                  .split("T")[0];
                setDate(d);
              }}
            />
            <Stack direction="row" spacing={1} width={{ xs: "100%", sm: "auto" }}>
              <Input
                sx={{ width: "50%" }}
                type="time"
                defaultValue={startTime}
                size="sm"
                onChange={(event) => {
                  setStartTime(event.target.value);
                }}
              />
              <Input
                sx={{ width: "50%" }}
                type="time"
                defaultValue={endTime}
                size="sm"
                onChange={(event) => {
                  setEndTime(event.target.value);
                }}
              />
            </Stack>
          </Stack>
          <Button sx={{ display: available && selectedDesk ? "block" : "none", marginTop: 1, width: "100%" }} onClick={() => setOpen(true)}>
            Book desk {selectedDesk}
          </Button>
          <Box sx={{ display: available || selectedDesk === "" ? "none" : "flex", flexDirection: { xs: "row", sm: "column" }, justifyContent: "space-around", alignItems: "center", }}>
            <Typography component="h2">
              Desk {selectedDesk}
            </Typography>
            <Avatar
              variant="solid"
              color="primary"
              src={user && user.name && user.name !== "anonymous" ? `data:image/jpeg;base64,${user.image}` : "defaultUser.svg"}
              alt={user ? user.name.split(" ", 2).map((i) => i.charAt(0)).join("").toUpperCase() : "user"}
              sx={{ height: { xs: "70px", sm: "100px" }, width: { xs: "70px", sm: "100px" }, margin: 1 }}
            >
              {user ? user.name.split(" ", 2).map((i) => i.charAt(0)).join("").toUpperCase() : ""}
            </Avatar>
            <Typography>
              {user ? user.name : ""}
            </Typography>
          </Box>
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
              level={level.level}
              statuses={statuses}
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