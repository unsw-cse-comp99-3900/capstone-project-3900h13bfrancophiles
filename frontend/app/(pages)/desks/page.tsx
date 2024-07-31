"use client";

import FloorPlanViewer from "@/components/FloorPlanViewer";
import BookingModal from "@/components/BookingModal/BookingModal";
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Stack,
  Input,
  Sheet,
  Typography,
  FormControl,
} from "@mui/joy";
import * as React from "react";
import { Booking, UserData } from "@/types";
import useTimeRange from "@/hooks/useTimeRange";
import useSpaceStatus from "@/hooks/useSpaceStatus";
import JoyTimePicker from "@/components/JoyTimePicker";
import useDesks from "@/hooks/useDesks";
import Loading from "@/components/Loading";
import DeskInfoPopup from "@/components/DeskInfoPopup";

const floors = ["K17 L2", "K17 L3", "K17 L4", "K17 L5"];

export default function Desks() {
  const { date, start, end, dateInputProps, startTimePickerProps, endTimePickerProps } =
    useTimeRange();

  const [selectedDesk, setSelectedDesk] = React.useState("");
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);
  const [deskName, setDeskName] = React.useState("");
  const [user, setUser] = React.useState<null | UserData>(null);

  const [open, setOpen] = React.useState(false);

  const { desks } = useDesks();
  const { statusResponse, isLoading } = useSpaceStatus(start.toISOString(), end.toISOString());

  React.useEffect(() => {
    setSelectedDesk("");
  }, [date, start, end]);

  if (isLoading) return <Loading page="" />;

  return (
    <React.Fragment>
      {open && (
        <BookingModal
          open={open}
          onClose={() => setOpen(false)}
          space={{ id: selectedDesk, name: deskName, isRoom: false }}
          date={date}
          start={start}
          end={end}
        />
      )}
      <Stack
        direction="column"
        alignItems="flex-end"
        sx={{
          zIndex: 2,
          position: "absolute",
          top: 60,
          right: 0,
          padding: 1,
          margin: 1,
          width: { xs: "calc(100vw - 32px)", sm: "auto" },
        }}
      >
        <Sheet
          variant="plain"
          sx={{
            boxShadow: "md",
            borderRadius: 10,
            padding: 1.5,
            marginBottom: 1.5,
            width: "100%",
          }}
        >
          <Stack direction="column">
            <Typography level="h4">Search for available desks:</Typography>
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
        <DeskInfoPopup
          selectedDesk={selectedDesk}
          booking={selectedBooking}
          user={user}
          deskName={deskName}
          start={start}
          end={end}
          handleClose={() => setSelectedDesk("")}
          openBookingModal={() => setOpen(true)}
        />
      </Stack>
      <Tabs aria-label="level select" defaultValue={"K17 L2"} sx={{ height: "calc(100vh - 60px)" }}>
        {floors.map((floor, index) => (
          <TabPanel
            key={index}
            variant="plain"
            color="neutral"
            value={floor}
            sx={{
              height: "calc(100% - 45px)",
              padding: 0,
            }}
          >
            <FloorPlanViewer
              selectedDesk={selectedDesk}
              setSelectedDesk={setSelectedDesk}
              setSelectedBooking={setSelectedBooking}
              setSelectedUser={setUser}
              setDeskName={setDeskName}
              floor={floor}
              desks={desks?.filter((desk) => desk.floor === floor) || []}
              statuses={statusResponse || {}}
            />
          </TabPanel>
        ))}
        <TabList underlinePlacement="top" sx={{ height: 45 }}>
          {floors.map((floor, index) => (
            <Tab key={index} variant="plain" color="neutral" indicatorPlacement="top" value={floor}>
              {floor}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </React.Fragment>
  );
}
