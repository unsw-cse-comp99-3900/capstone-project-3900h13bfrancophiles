"use client";

import AvailabilitiesPage from "@/components/availability/AvailabilitiesPage";

export default function RoomsId({ params }: { params: { id: string } }) {
  return <AvailabilitiesPage spaceId={params.id} spaceType={"room"} />;
}
