'use client';

import FloorPlanViewer from "@/components/FloorPlanViewer";
import { Tab, TabList, TabPanel, Tabs, Stack, Input, Button, Box, Sheet, Avatar, Modal, ModalClose, ModalDialog, DialogTitle, DialogContent, Typography } from "@mui/joy";
import { deskData } from '@/app/data';
import * as React from 'react';
import { Booking } from "@/types";

type Status = { status: "available" }
  | { status: "unavailable", booking: Booking };

type User = { name: string, image: string }

const exampleStatuses: { [spaceId: string]: Status } = {
  "1": { status: "available" },
  "2": {
    status: "unavailable",
    booking: {
      id: 1,
      zid: 1234567,
      starttime: "3",
      endtime: "4",
      spaceid: "2",
      currentstatus: "checked in",
      description: "Franco is at this table!",
      checkintime: null,
      checkouttime: null
    }
  },
  "3": { status: "available" },
  "4": { status: "available" },
  "5": { status: "available" },
  "6": { status: "available" },
  "7": { status: "available" },
  "8": { status: "available" },

};

const exampleUser: User = {
  name: "Franco Reyes",
  image: "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"
}

// will eventually get backend data
const getUser = (zid: number) => {
  return exampleUser;
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
  const [user, setUser] = React.useState<null | User>(null);
  const [open, setOpen] = React.useState(false); // for confirmation modal

  const statuses = exampleStatuses;

  React.useEffect(() => {
    const status = statuses[selectedDesk];
    if (status) {
      if (status.status === "available") {
        setAvailable(true);
        setUser(null);
      } else {
        setAvailable(false);
        const user = getUser(status.booking.zid);
        setUser(user);
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
      <Sheet variant="plain" sx={{ boxShadow: "md", borderRadius: 10, zIndex: 2, position: "absolute", top: 60, right: 0, padding: 1, margin: 2 }}>
        <Stack direction="column">
          <Stack direction="row" gap={2} flexWrap="wrap">
            <Input
              type="date"
              defaultValue={date}
              onChange={(event) => {
                const d = new Date(event.target.value)
                  .toISOString()
                  .split("T")[0];
                setDate(d);
              }}
            />
            <Stack direction="row">
              <Input
                type="time"
                defaultValue={startTime}
                size="sm"
                onChange={(event) => {
                  const d = new Date(event.target.value).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  setStartTime(d);
                }}
              />
              <Input
                type="time"
                defaultValue={endTime}
                size="sm"
                onChange={(event) => {
                  const d = new Date(event.target.value).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  setEndTime(d);
                }}
              />
            </Stack>
          </Stack>
          {
            <Box sx={{ display: selectedDesk == "" ? "none" : "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
              <Button sx={{ display: available ? "block" : "none", marginTop: 1, width: "100%" }} onClick={() => setOpen(true)}>
                Book desk {selectedDesk}
              </Button>
              <Box sx={{ display: available ? "none" : "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", padding: 2 }}>
                <Typography component="h2">
                  Desk {selectedDesk}
                </Typography>
                <Avatar
                  variant="solid"
                  color="primary"
                  src={user ? `data:image/jpeg;base64,${user.image}` : "/DeskIcon1.svg"}
                  alt={user ? user.name.split(" ", 2).map((i) => i.charAt(0)).join("").toUpperCase() : "user"}
                  sx={{ height: "100px", width: "100px", margin: 1 }}
                >
                  {user ? user.name.split(" ", 2).map((i) => i.charAt(0)).join("").toUpperCase() : ""}
                </Avatar>
                <Typography>
                  Franco Reyes
                </Typography>
              </Box>
            </Box>
          }
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