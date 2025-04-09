import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import './editProgress.css'

const steps = [
    {
        label: 'Thêm ảnh đại diện',
        description: `Ảnh đại diện là thông tin cần thiết nhằm đem lại khả năng ghép đôi cao của các đối tượng hẹn hò với bạn`,
    },
    {
        label: 'Giới thiệu về bản thân',
        description:
            'Đây là thông tin quan trọng nhằm để lại ấn tượng tốt đối với đối tượng hẹn hò"',
    },
    {
        label: 'Thêm sở thích',
        description: `Đây là yếu tố cung cấp cho bạn khả năng ghép đôi phù hợp với mong muốn và các thông tin trong hồ sơ mà bạn cung cấp`,
    },
];

export default function EditProgress({activeStep}) {
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


    return (
        <Box sx={{ maxWidth: 400}} className="editProgressContainer">
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel>
                            <Typography style={{fontSize: '18px', fontWeight:'bold'}}>{step.label}</Typography>                        </StepLabel>
                        <StepContent>
                            <Typography style={{fontSize: '15px'}}>{step.description}</Typography>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                        Reset
                    </Button>
                </Paper>
            )}
        </Box>
    );
}