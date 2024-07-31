import * as React from "react";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import { Link, Skeleton, Stack } from "@mui/joy";
import { format } from "date-fns";
import useSpace from "@/hooks/useSpace";
import CheckIcon from "@mui/icons-material/Check";
import Avatar from "@mui/joy/Avatar";
import useUser from "@/hooks/useUser";
import NextLink from "next/link";
import ApproveDeclineModal from "@/components/ApproveDeclineModal";
import CloseIcon from "@mui/icons-material/Close";
import { getInitials } from "@/utils/icons";
import { Booking } from "@/types";
import ErrorSnackbar from "@/components/ErrorSnackbar";
export interface PendingBookingRowProps {
  row: Booking;
  page: number;
  rowsPerPage: number;
  sort: string;
}

function PendingBookingsRow({ row, page, rowsPerPage, sort }: PendingBookingRowProps) {
  const { space, type, isLoading: spaceIsLoading } = useSpace(row.spaceid);
  const { user, isLoading: userIsLoading } = useUser(row.zid);

  const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);
  const [approving, setApproving] = React.useState(false);
  const [approveDeclineError, setApproveDeclineError] = React.useState<string | null>(null);

  return (
    <>
      <tr>
        <td>
          <Typography level="body-sm">#{row.id}</Typography>
        </td>
        <td>
          <Typography level="body-sm">
            {format(new Date(row.starttime), "dd/MM/yy H:mm")} -{" "}
            {format(new Date(row.endtime), "H:mm")}
          </Typography>
        </td>
        <td>
          <Skeleton loading={spaceIsLoading}>
            <Link
              href={type === "room" ? `/rooms/${row.spaceid}` : `/desks/${row.spaceid}`}
              level="body-sm"
              component={NextLink}
            >
              {space?.name}
            </Link>{" "}
          </Skeleton>
        </td>
        <td>
          <Skeleton loading={userIsLoading}>
            <Stack direction="row" alignItems="center" gap={2}>
              <Avatar variant="solid" color="primary">
                {user?.fullname === undefined ? "" : getInitials(user?.fullname)}
              </Avatar>
              <Stack direction="column">
                <Typography level="body-sm" fontWeight="lg">
                  {user?.fullname}
                </Typography>
                <Typography level="body-sm">z{user?.zid}</Typography>
              </Stack>
            </Stack>
          </Skeleton>
        </td>
        <td>
          <Typography level="body-sm">{row.description}</Typography>
        </td>
        <td>
          <Stack direction="row" justifyContent="flex-end" px={1}>
            <IconButton
              variant="plain"
              color="success"
              onClick={() => {
                setIsConfirmationOpen(true);
                setApproving(true);
              }}
            >
              <CheckIcon />
            </IconButton>
            <IconButton
              variant="plain"
              color="danger"
              onClick={() => {
                setIsConfirmationOpen(true);
                setApproving(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </td>
      </tr>
      {isConfirmationOpen && (
        <ApproveDeclineModal
          key={`${row.id}-${approving ? "approve" : "decline"}`}
          isOpen={isConfirmationOpen}
          onClose={() => setIsConfirmationOpen(false)}
          approving={approving}
          row={row}
          page={page}
          rowsPerPage={rowsPerPage}
          sort={sort}
          setApproveDeclineError={setApproveDeclineError}
        />
      )}
      {approveDeclineError && <ErrorSnackbar errorMessage={approveDeclineError} open={true} />}
    </>
  );
}

export default PendingBookingsRow;
