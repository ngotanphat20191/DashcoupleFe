import {Stack, Typography} from "@mui/joy";
import {Button} from "@mui/material";
import './profiles-grid.css'
export default function PaymentSuccess(){
    return (
        <div className={'payment-success'}>
            <Stack rowGap={1} alignItems={'center'} justifyContent={'center'}>
                <Typography level={'h1'} sx={{color: 'greenyellow'}}>Payment Success</Typography>
                <p>Thank you for your payment!</p>
                <Button sx={{marginTop: 2}} variant={'contained'} color={'success'}
                        onClick={() => window.location.href='/'}>Back to Homepage</Button>
            </Stack>
        </div>
    )
}