"use client"

import * as React from "react";
import { Box, Stack, Typography, Button } from "@mui/joy";
import useSpace from '@/hooks/useSpace';
import useTimeRange from "@/hooks/useTimeRange"
import useAvailabilities from "@/hooks/useAvailabilities";
import { Space, Room, Desk } from "@/types";
import Loading from "@/components/Loading";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import BookingModal from "@/components/BookingModal/BookingModal"


export default function SpacePage({ params }: { params: { id: string } }) {
  const { space, isLoading } = useSpace(params.id);
  const { bookings } = useAvailabilities(params.id)
  const isRoom : boolean = space?.capacity && !isLoading ? true : false;
  const room = space as Room
  const desk = space as Desk

  const [openModal, setOpenModal] = React.useState<boolean>(false)

  if (isLoading) return <Loading page=""/>

  return (
    <>
      <BookingModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        space={space ? { id: space?.id, name: space?.name, isRoom: isRoom } : undefined}
      />
      <Stack>
        <Stack
          sx={{ display: "flex" , alignItems: "center", flexDirection: "row"}}
        >
          <Typography level="h1">
            {isRoom ? `${room!.type} ${room!.name}` : `${desk!.name} ${desk!.floor} ${desk!.desknumber}`}
          </Typography>
          <Box sx={{ marginLeft: "auto" }}>
            <Button
              color="success"
              variant="solid"
              onClick={() => setOpenModal(true)}
            >
              Book Now
            </Button>
          </Box>
        </Stack>
        {isRoom ?
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
              <Typography level="h3">
                {room?.id}
              </Typography>
            </Box>
            <Box>
              <Typography level="h4" sx={{ color: "gray" }}>
                Usage
              </Typography>
              <Typography level="h3">
                {room?.type}
              </Typography>
            </Box>
            <Box>
              <Typography level="h4" sx={{ color: "gray" }}>
                Capacity
              </Typography>
              <Typography level="h3">
                {room?.capacity}
              </Typography>
            </Box>
          </Stack>
          : null
        }
        <AvailabilityCalendar
          bookings={bookings ?? []}
        />
      </Stack>
    </>
  );
}
