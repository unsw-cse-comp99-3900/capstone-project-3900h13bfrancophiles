import * as React from "react";
import { Box, Stack, Typography, Button } from "@mui/joy";
import useSpace from "@/hooks/useSpace";
import useAvailabilities from "@/hooks/useAvailabilities";
import { Space, Room, Desk, SpaceType } from "@/types";
import Loading from "@/components/Loading";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import BookingModal from "@/components/BookingModal/BookingModal";
import Error from "@/components/Error";
import { endOfWeek, startOfWeek } from "date-fns";

interface AvailabilitesPageProps {
  spaceId: string;
  spaceType: string;
}

const AvailabilitiesPage: React.FC<AvailabilitesPageProps> = ({ spaceId, spaceType }) => {
  const spaceOutput = useSpace(spaceId);
  const space = spaceOutput.space;
  const spaceLoading = spaceOutput.isLoading;

  const [calendarStart, setCalendarStart] = React.useState<Date>(startOfWeek(new Date()));
  const [calendarEnd, setCalendarEnd] = React.useState<Date>(endOfWeek(new Date()));
  const { mutate } = useAvailabilities(spaceId, calendarStart.toISOString(), calendarEnd.toISOString());
  const room = space as Room;
  const desk = space as Desk;

  const [openModal, setOpenModal] = React.useState<boolean>(false);

  if (spaceType !== spaceOutput.type || spaceOutput.error)
    return <Error page={`${spaceType}s/${spaceId}`} message={`${spaceType} ID not found`} />;

  if (spaceLoading) return <Loading page="" />;

  return (
    <>
      <BookingModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          mutate();
        }}
        space={
          space ? { id: space?.id, name: space?.name, isRoom: spaceType === "room" } : undefined
        }
      />
      <Stack>
        <Stack justifyContent="space-between" alignItems="center" direction="row">
          <Typography level="h1">
            {spaceType === "room" ? `${room!.type} ${room!.name}` : `${desk!.name}`}
          </Typography>
          <Button
            color="success"
            variant="solid"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Book Now
          </Button>
        </Stack>
        {spaceType === "room" ? (
          <Stack
            alignItems="center"
            direction="row"
            flexWrap="wrap"
            gap={5}
            borderRadius="sm"
            mb={3}
          >
            <Box>
              <Typography level="h4" sx={{ color: "gray" }}>
                Room ID
              </Typography>
              <Typography level="h3">{room?.id}</Typography>
            </Box>
            <Box>
              <Typography level="h4" sx={{ color: "gray" }}>
                Usage
              </Typography>
              <Typography level="h3">{room?.type}</Typography>
            </Box>
            <Box>
              <Typography level="h4" sx={{ color: "gray" }}>
                Capacity
              </Typography>
              <Typography level="h3">{room?.capacity}</Typography>
            </Box>
          </Stack>
        ) : null}
        <AvailabilityCalendar
          spaceId={spaceId}
          calendarStart={calendarStart}
          calendarEnd={calendarEnd}
          setCalendarStart={setCalendarStart}
          setCalendarEnd={setCalendarEnd}
        />
      </Stack>
    </>
  );
};

export default AvailabilitiesPage;
