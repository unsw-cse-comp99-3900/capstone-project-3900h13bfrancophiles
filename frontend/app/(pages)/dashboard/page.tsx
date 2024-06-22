import {Box, Button, Card, CardContent, Stack, Typography} from "@mui/joy";

export default function Dashboard() {
  return (
    <Stack>
      <Typography level="h1">
        My Dashboard
      </Typography>
      <Typography level="h2" mb={2}>
        Current Booking
      </Typography>
      <Card variant='outlined'>
        <CardContent>
          <Stack direction={{xs: 'column', lg: 'row'}} px={2} py={1} width='100%' justifyContent='space-between' alignItems={{ xs: 'flex-start', lg: 'center' }}>
            <Box>
              <Typography level="h2" sx={{ textWrap: 'wrap' }}>
                K17 G02 - Consultation Room
              </Typography>
              <Typography level='body-lg' pb={1} sx={{ textWrap: 'wrap' }}>
                Booked until 7:30 PM
              </Typography>
            </Box>
            <Stack direction='row' spacing={{xs: 1, sm: 4}} height={60} width={{xs: '100%', lg: '50%'}} py='10px'  justifyContent='flex-end'>
              <Button size="md" color="success" sx={{borderRadius: '20px', width: '130px', fontSize: {xs: '11pt', sm: '13pt'}}}>
                Check in
              </Button>
              <Button size="md" color="danger" sx={{borderRadius: '20px', width: '180px', fontSize: {xs: '11pt', sm: '13pt'}}}>
                Contact Support
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}