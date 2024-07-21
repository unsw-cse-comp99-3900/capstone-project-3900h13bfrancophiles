
import * as React from "react";
import { Stack, Typography, Button, Grid, Item } from "@mui/joy";
import useSpace from '@/hooks/useSpace';
import useAvailabilities from "@/hooks/useAvailabilities";
import { Room, Desk } from "@/types";
import Loading from "@/components/Loading";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import BookingModal from "@/components/BookingModal/BookingModal"
import Error from "@/components/Error";

interface AvailabilitesPageProps {
  spaceId: string;
  spaceType: string;
}

const AvailabilitiesPage : React.FC<AvailabilitesPageProps> = ({
  spaceId,
  spaceType,
}) => {
  const spaceOutput = useSpace(spaceId);
  const space = spaceOutput.space;
  const spaceLoading = spaceOutput.isLoading;
  const { bookings, mutate } = useAvailabilities(spaceId);
  const room = space as Room;
  const desk = space as Desk;

  const [openModal, setOpenModal] = React.useState<boolean>(false);

  if (spaceType !== spaceOutput.type || spaceOutput.error)
    return <Error
      page={`${spaceType}s/${spaceId}`}
      message={`${spaceType} ID not found`}
    />

  if (spaceLoading) return <Loading page=""/>

  return (
    <>
      <BookingModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          mutate();
        }}
        space={space ? { id: space?.id, name: space?.name, isRoom: spaceType === "room" } : undefined}
      />
      <Stack>
        <Stack
          justifyContent="space-between"
          alignItems={{xs: "", sm: "center"}}
          direction={{xs: "column", sm: "row"}}
          mb={{xs: 3, sm: 0}}
          gap={3}
        >
          <Typography level="h1">
            {spaceType === "room" ? `${room!.type} ${room!.name}` : `${desk!.name}`}
          </Typography>
          <Button
            color="success"
            variant="solid"
            onClick={() => {setOpenModal(true)}}
            sx={{
              height: 40,
              minWidth: {sm: 130},
              marginTop: {xs: -4, sm: 0}
            }}
          >
            Book Now
          </Button>
        </Stack>
        {spaceType === "room" &&
          <>
            <Stack
              direction="row"
              justifyContent="flex-start"
              gap={5}
              borderRadius="sm"
              mb={3}
            >
              <Stack>
                <Typography level="h4" sx={{ color: "gray" }}>
                  Room ID
                </Typography>
                <Typography level="h3">
                  {room?.id}
                </Typography>
              </Stack>
              <Stack>
                <Typography level="h4" sx={{ color: "gray" }}>
                  Usage
                </Typography>
                <Typography level="h3">
                  {room?.type}
                </Typography>
              </Stack>
              <Stack>
                <Typography level="h4" sx={{ color: "gray" }}>
                  Capacity
                </Typography>
                <Typography level="h3">
                  {room?.capacity}
                </Typography>
              </Stack>
            </Stack>
            <Grid>
              <Grid xs={6}>
                <Item>hi </Item>
              </Grid>
              <Grid xs={6}>
                hi
              </Grid>
              <Grid xs={6}>
                hi
              </Grid>
              <Grid xs={6}>
                hi
              </Grid>
              <Grid xs={6}>
                hi
              </Grid>
              <Grid xs={6}>
                hi
              </Grid>
            </Grid>
          </>
        }
        <AvailabilityCalendar
          bookings={bookings ?? []}
        />
      </Stack>
    </>
  );
}

export default AvailabilitiesPage