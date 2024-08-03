import { Link, Skeleton } from "@mui/joy";
import NextLink from "next/link";
import * as React from "react";
import useSpace from "@/hooks/useSpace";

export default function SpaceColumn({ spaceId }: { spaceId: string }) {
  const { space, type, isLoading } = useSpace(spaceId);

  return (
    <Skeleton loading={isLoading}>
      <Link
        href={type === "room" ? `/rooms/${spaceId}` : `/desks/${spaceId}`}
        level="body-sm"
        component={NextLink}
      >
        {space?.name}
      </Link>
    </Skeleton>
  );
}
