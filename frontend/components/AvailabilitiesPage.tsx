import * as React from "react";

import { Box, Stack, Typography, Button, Tooltip, Grid, Sheet } from "@mui/joy";
import useSpace from "@/hooks/useSpace";
import useAvailabilities from "@/hooks/useAvailabilities";
import { Room, Desk } from "@/types";
import Loading from "@/components/Loading";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import BookingModal from "@/components/BookingModal/BookingModal";
import Error from "@/components/Error";

import { styled } from '@mui/joy/styles';
import useRoomCanBook from "@/hooks/useRoomCanBook";

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
  const { canBook } = useRoomCanBook(spaceId);

  if (spaceType !== spaceOutput.type || spaceOutput.error)
    return <Error page={`${spaceType}s/${spaceId}`} message={`${spaceType} ID not found`} />;

  if (spaceLoading) return <Loading page="" />;

  const subheadings = {
    "Room ID": room?.id,
    "Usage": room?.type,
    "Capacity": room?.capacity
  }

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

          <Tooltip
            title={canBook ? "" : "You do not have permission to book this space"}
            variant="solid"
            sx={{
              marginTop: {xs: -4, sm: 0}
            }}
          >
            <Box>
              <Button
                color="primary"
                variant="solid"
                disabled={!canBook}
                onClick={() => {
                  setOpenModal(true)
                }}
                sx={{
                  height: 40,
                  width: {xs: "100%", sm: 130},
                }}
              >
                Book Now
              </Button>
            </Box>
          </Tooltip>
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
              {
                Object.entries(subheadings).map(([heading, value]) => {
                  return (
                    <Stack>
                      <Typography level="h4" sx={{ color: "gray" }}>
                        {heading}
                      </Typography>
                      <Typography level="h3">
                        {value}
                      </Typography>
                    </Stack>
                  )
                })
              }
            </Stack>
            {/* display for mobile */}
            <Grid
              container
              spacing={1}
              sx={{
                flexGrow: 1,
                display: {xs: "flex", sm: "none"}
              }}
              mb={2}
            >
              {
                Object.entries(subheadings).map(([heading, value]) => {
                  return (
                    <>
                      <Grid xs={4}>
                        <Typography level="h4" sx={{ color: "gray" }}>
                          {heading}
                        </Typography>
                      </Grid>
                      <Grid xs={8}>
                        <Typography level="h3">
                          {value}
                        </Typography>
                      </Grid>
                    </>
                  )
                })
              }
            </Grid>
          </>
        }
        <AvailabilityCalendar
          bookings={bookings ?? []}
        />
      </Stack>
    </>
  );
};

export default AvailabilitiesPage;
