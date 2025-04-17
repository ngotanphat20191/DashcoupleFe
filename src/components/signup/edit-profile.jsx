import {useState,useEffect} from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import "./edit-profile.css";
import EditImage from "./components/editImage.jsx"
import EditInfo from "./components/editInfo.jsx"
import EditInterest from "./components/editInterest.jsx"
import EditProgress from "./components/editProgress.jsx"

export default function editProfile() {
    const [formData, setFormData] = useState({
        images: Array(),
        name: "",
        about: "",
        birthday: "",
        phonenumber: "",
        gender: "",
        height: "",
        city: "",
        interest: Array(),
        Job: "",
        Education: "",
        HaveSon: "",
        relationship: "",
        token: "",
        religion: "",
        imagesList: Array(6).fill(null)
    });
    const steps = [
        {
            label: "Thêm ảnh đại diện",
            description: <EditImage formData={formData} setFormData={setFormData}   />,
            content: "Hãy thêm ít nhất 2 ảnh đại diện của mình để cung cấp thông tin các đối tượng hẹn hò"
        },
        {
            label: "Giới thiệu về bản thân",
            description: <EditInfo formData={formData} setFormData={setFormData}  />,
            content: ""
        },
        {
            label: "Them so thich",
            description: <EditInterest formData={formData} setFormData={setFormData}  />,
            content: ""
        },
    ];
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = steps.length;
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const token = urlParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
        }
        console.log(localStorage.getItem('token'));
    }, []);
    return (
        <div className="editProfilePageContainer">
            <EditProgress activeStep={activeStep}></EditProgress>
            <Box sx={{ maxWidth: 400, flexGrow: 1}} className="EditProfileContainer">
                <Paper
                    square
                    elevation={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        height: 30,
                        pl: 2,
                        borderRadius: '15px',
                        paddingTop:'20px',
                        paddingBottom:'20px',
                        backgroundColor: "rgb(246, 246, 246)",
                }}
                >
                    <Typography sx={{ fontWeight: "bold", fontSize:"18px"}}>{steps[activeStep].label}</Typography>
                </Paper>
                <div className="editProfileContainer">
                    <Box sx={{ height: 450, maxWidth: 400, width: '100%', p: 2 }}>
                        {steps[activeStep].description}
                        <Typography  sx={{
                            fontStyle: "italic",
                            textAlign: "center",
                            lineHeight: "2rem",
                            fontSize: "17px",
                            paddingTop: "20px"
                        }}>{steps[activeStep].content}
                        </Typography>
                    </Box>
                </div>
                <MobileStepper
                    style={{borderRadius: '20px', backgroundColor: 'rgb(236,236,236)'}}
                    variant="dots"
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                        <Button
                            size="small"
                            onClick={handleNext}
                            disabled={activeStep === maxSteps - 1}
                        >
                            Next
                            {theme.direction === 'rtl' ? (
                                <KeyboardArrowLeft />
                            ) : (
                                <KeyboardArrowRight />
                            )}
                        </Button>
                    }
                    backButton={
                        <Button size="small" onClick={handleBack} disabled={activeStep === 0} >
                            {theme.direction === 'rtl' ? (
                                <KeyboardArrowRight />
                            ) : (
                                <KeyboardArrowLeft />
                            )}
                            Back
                        </Button>
                    }
                />
            </Box>
        </div>
    );
}