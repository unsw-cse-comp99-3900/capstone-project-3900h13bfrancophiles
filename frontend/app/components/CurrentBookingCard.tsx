import {Box, Button, Card, CardContent, Stack, Typography} from "@mui/joy";

interface CurrentBookingProps {
  room: string,
  time: string
}

export default function CurrentBookingCard({room, time}: CurrentBookingProps) {
  return (<Card variant='outlined'>
      <CardContent>
        <Stack direction={{xs: 'column', lg: 'row'}} px={2} py={1} width='100%' justifyContent='space-between'
               alignItems={{xs: 'flex-start', lg: 'center'}}>
          <Box>
            <Typography level="h3" sx={{textWrap: 'wrap'}}>
              {room}
            </Typography>
            <Typography level='body-lg' pb={1} sx={{textWrap: 'wrap'}}>
              Booked until {time}
            </Typography>
          </Box>
          <Stack direction='row' spacing={{xs: 1, sm: 4}} height={60} width={{xs: '100%', lg: '50%'}} py='10px'
                 justifyContent='flex-end'>
            <Button size="sm" color="success"
                    sx={{borderRadius: '20px', width: '100px'}}>
              Check in
            </Button>
            <Button size="sm" color="primary"
                    sx={{borderRadius: '20px', width: '150px'}}>
              Contact Support
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>)
}