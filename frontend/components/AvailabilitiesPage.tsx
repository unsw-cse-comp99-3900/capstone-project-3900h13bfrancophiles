
import * as React from "react";
import { Stack, Typography, Button, Grid, Sheet } from "@mui/joy";
import useSpace from '@/hooks/useSpace';
import useAvailabilities from "@/hooks/useAvailabilities";
import { Room, Desk } from "@/types";
import Loading from "@/components/Loading";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import BookingModal from "@/components/BookingModal/BookingModal"
import Error from "@/components/Error";
import { styled } from '@mui/joy/styles';

interface AvailabilitesPageProps {
  spaceId: string;
  spaceType: string;
}

const Item = styled(Sheet)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.background.level1 : '#fff',
  ...theme.typography['body-sm'],
  padding: theme.spacing(1),
  textAlign: 'center',
  borderRadius: 4,
  color: theme.vars.palette.text.secondary,
}));

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
            {/* display for desktop */}
            <Stack
              direction="row"
              justifyContent="flex-start"
              gap={5}
              borderRadius="sm"
              mb={3}
              sx={{ display: {xs: "none", sm: "flex"}}}
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
            {/* dislplay for mobile */}
            <Grid
              container
              spacing={1}
              sx={{
                flexGrow: 1,
                display: {xs: "flex", sm: "none"}
              }}
              mb={2}
            >
              <Grid xs={4}>
                <Typography level="h4" sx={{ color: "gray" }}>
                  Room ID
                </Typography>
              </Grid>
              <Grid xs={8}>
                <Typography level="h3">
                  {room?.id}
                </Typography>
              </Grid>
              <Grid xs={4}>
                <Typography level="h4" sx={{ color: "gray" }}>
                  Usage
                </Typography>
              </Grid>
              <Grid xs={8}>
                <Typography level="h3">
                  {room?.type}
                </Typography>
              </Grid>
              <Grid xs={4}>
                <Typography level="h4" sx={{ color: "gray" }}>
                  Capacity
                </Typography>
              </Grid>
              <Grid xs={8}>
                <Typography level="h3">
                  {room?.capacity}
                </Typography>
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