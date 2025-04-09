import React, {useEffect, useState} from 'react';
import { List, ListItem, ListItemText, ListItemIcon, IconButton, Typography, Slider, TextField } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import CheckIcon from "@mui/icons-material/Check";
import SettingHeader from './settingsHeader.jsx';
import '../profile.css';
import Sheet from "@mui/joy/Sheet";
import Done from "@mui/icons-material/Done.js";
import Checkbox from "@mui/joy/Checkbox";
import {baseAxios, paymentAxios} from "../../../config/axiosConfig.jsx";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Settings = ({interests ,formData, setFormData}) => {
    const [value, setValue] = React.useState(null);
    const [ageRange, setageRange] = React.useState([formData.preferenceRecord.preferenceAgeMin,formData.preferenceRecord.preferenceAgeMax]);
    const handleAgeChange = (event, newageRange) => {
        setageRange(newageRange);
    };
    const tongiao = ['Phật giáo', 'Thiên chúa giáo', 'Kito giáo', 'Hindu giáo', 'Hồi giáo'];
    const [toggles, setToggles] = useState({
        main: true,
        email: false,
        matkhau: false,
        tongiao: false,
        sothich: false,
        upgrade: false
    });
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleToggleChange = (name) => {
        setToggles((prev) => ({
            ...Object.keys(prev).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {}),
            [name]: true,
        }));
    };
    const [isEditing, setIsEditing] = useState(false);
    const [bankcode, setBankCode] = useState("NCB");
    const [amount, setAmount] = useState(25000);
    const handleEditClick = () => {
        setIsEditing(true);
    };
    const handleSaveClick = () => {
        setIsEditing(false);
    };
    const settings = [
        { label: 'Email', value: 'email', icon: <ArrowForward className="settings-icon" /> },
        { label: 'Mật khẩu', value: 'matkhau', icon: <ArrowForward className="settings-icon" /> },
    ];
    const preferences = [
        { label: 'Sở thích', value: 'sothich', icon: <ArrowForward className="settings-icon" /> },
        { label: 'Tôn giáo', value: 'tongiao', icon: <ArrowForward className="settings-icon" /> },
    ];
    const myFunction = () => {
        baseAxios.post('/profile/setting/edit', {
            preferenceAgeMin: ageRange[0],
            preferenceAgeMax: ageRange[1],
            preferencePopularityMax: 0,
            preferencePopularityMin: 0,
            preferenceLocation: formData.preferenceRecord.preferenceLocation,
            preferenceInterest: formData.preferenceInterest,
        }).then((res) => {
            console.log(res.data)
        }).catch(err => {
            alert(err.response.data)
        })
    };
    useEffect(() => {
        const handleBeforeUnload = () => {
            myFunction();
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [ageRange, formData])
    useEffect(() => {
        console.log(formData)
    }, [])
    return (
        <div>
            <SettingHeader formData={formData} setFormData={setFormData}></SettingHeader>
            {toggles.main === true ? (
                <div className="settings-container" >
                    <Typography className="settings-title" style={{  fontSize: '16px', paddingTop: '10px', paddingLeft:'10px', cursor: 'pointer', fontWeight: 'bold'}}>
                        Thiết lập tài khoản
                    </Typography>
                    <List className="settings-list">
                        <Button className="upgrade-card" style={{marginLeft: "5px", border: "1px solid #e3e3e3", borderRadius: "20px", backgroundColor: "#f8f8f8"}} onClick={() => handleToggleChange("upgrade")}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"}}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img
                                        src="https://cdn-icons-png.freepik.com/512/14589/14589092.png"
                                        alt="Upgrade Icon"
                                        width="60"
                                        height="60"
                                    />
                                    <div className="upgrade-card-title">Nâng cấp tài khoản của bạn</div>
                                </div>
                                <div className="upgrade-card-subtitle" style={{ marginTop: "8px" }}>
                                    Đăng ký nâng cấp sẽ đem lại cho bạn nhiều lợi thế
                                </div>
                            </div>
                        </Button>
                        {settings.map((setting, index) => (
                            <ListItem key={index} className="settings-list-item"  onClick={() => handleToggleChange(setting.value)}>
                                <ListItemText
                                    primary={<span className="settings-label">{setting.label}</span>}
                                />
                                <ListItemIcon>
                                    <IconButton edge="end">
                                        {setting.icon}
                                    </IconButton>
                                </ListItemIcon>
                            </ListItem>
                        ))}
                    </List>
                    <Typography className="settings-title" style={{  fontSize: '16px', paddingTop: '10px', paddingLeft:'10px',cursor: 'pointer', fontWeight: 'bold'}}>
                        Thiết lập mong muốn ghép đôi
                    </Typography>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "0 15px", paddingTop: '10px' }}>
                        <Typography style={{ fontSize: '14px', color: '#333' }}>Độ tuổi</Typography>
                        <Typography style={{ fontSize: '14px' }}>{ageRange[0]} - {ageRange[1]}</Typography>
                    </div>
                    <Slider
                        className="PreferenceSlider"
                        valueLabelDisplay="auto"
                        value={ageRange}
                        onChange={handleAgeChange}
                        aria-labelledby="range-slider"
                        min={18}
                        max={60}
                        style={{ width: 250, margin: '10px 15px' }}
                    />
                    <List className="settings-list">
                        {preferences.map((preferences, index) => (
                            <ListItem key={index} className="settings-list-item"  onClick={() => handleToggleChange(preferences.value)}>
                                <ListItemText
                                    primary={<span className="settings-label">{preferences.label}</span>}
                                />
                                <ListItemIcon>
                                    <IconButton edge="end">
                                        {preferences.icon}
                                    </IconButton>
                                </ListItemIcon>
                            </ListItem>
                        ))}
                    </List>
                </div>
                ) : (toggles.email === true ? (
                    <div className="settings-container">
                        <Typography className="email-label" style={{  fontSize: '16px', paddingTop: '10px', paddingLeft:'10px',paddingBottom: '10px',cursor: 'pointer', fontWeight: 'bold'}}>Email</Typography>
                        <div className="email-input-wrapper">
                            {isEditing ? (
                                <TextField
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value})}
                                    autoFocus
                                    className="email-input"
                                />
                            ) : (
                                <Typography className="email-text" onClick={handleEditClick}>
                                    {formData.email}
                                </Typography>
                            )}
                            {isEditing && (
                                <IconButton onClick={handleSaveClick} className="check-icon">
                                    <CheckIcon color='primary' />
                                </IconButton>
                            )}
                        </div>
                        <Typography style={{ width: '95%', paddingLeft:'10px', paddingTop: '5px',fontSize: '15px', cursor: 'pointer'}}>Có thể thay đổi email thông qua quá trình xác thực email</Typography>
                        <Typography className="verified-text" style={{ paddingLeft:'10px', paddingTop: '5px',fontSize: '16px', marginTop: '5px', cursor: 'pointer', fontWeight: 'bold'}}>Xác thực</Typography>
                        <Typography className="verified-text" style={{ paddingLeft:'10px', paddingTop: '5px', fontSize: '16px', marginTop: '5px', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => handleToggleChange('main')}>Back</Typography>
                    </div>
                ): toggles.matkhau === true ? (
                    <div className="settings-container">
                        <Typography className="email-label" style={{  fontSize: '16px', paddingTop: '10px', paddingLeft:'10px',paddingBottom: '10px',cursor: 'pointer', fontWeight: 'bold'}}>Mật khẩu</Typography>
                        <div className="email-input-wrapper">
                            {isEditing ? (
                                <TextField
                                    value={formData.matkhau}
                                    onChange={(e) => setFormData({ ...formData, matkhau: e.target.value})}
                                    autoFocus
                                    className="email-input"
                                />
                            ) : (
                                <Typography className="email-text" onClick={handleEditClick}>
                                    {formData.matkhau}
                                </Typography>
                            )}
                            {isEditing && (
                                <IconButton onClick={handleSaveClick} className="check-icon">
                                    <CheckIcon color='primary' />
                                </IconButton>
                            )}
                        </div>
                        <Typography style={{ width: '95%', paddingLeft:'10px', paddingTop: '5px',fontSize: '15px', cursor: 'pointer'}}>Có thể thay đổi mật khẩu thông qua quá trình xác thực email</Typography>
                        <Typography className="verified-text" style={{ paddingLeft:'10px', paddingTop: '5px',fontSize: '16px', marginTop: '5px', cursor: 'pointer', fontWeight: 'bold'}}>Xác thực</Typography>
                        <Typography className="verified-text" style={{ paddingLeft:'10px', paddingTop: '5px', fontSize: '16px', marginTop: '5px', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => handleToggleChange('main')}>Back</Typography>
                    </div>
                ): toggles.sothich === true ? (
                    <div className="settings-container">
                        <Typography  sx={{
                            fontStyle: "italic",
                            textAlign: "center",
                            lineHeight: "2rem",
                            fontSize: "15px",
                            paddingBottom:"10px"
                        }}>Hãy chọn các sở thích mà bạn mong muốn ở đối tượng hẹn hò</Typography>
                        <Sheet variant="outlined" sx={{ width: 290, p: 2, borderRadius: 'sm' }}>
                            <div role="group" aria-labelledby="rank">
                                <List
                                    orientation="horizontal"
                                    wrap
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', // Adjust the column size
                                        gap: '8px',
                                    }}
                                >
                                    {interests && interests.map((item) => (
                                        <ListItem key={item.InterestID}>
                                            {formData.preferenceInterest.includes(item.InterestID) && (
                                                <Done
                                                    fontSize="md"
                                                    color="primary"
                                                    sx={{ ml: -0.5, zIndex: 2, pointerEvents: 'none' }}
                                                />
                                            )}
                                            <Checkbox
                                                size="sm"
                                                disableIcon
                                                overlay
                                                label={item.name}
                                                checked={formData.preferenceInterest.includes(String(item.InterestID))}
                                                variant={formData.preferenceInterest.includes(item.InterestID) ? 'soft' : 'outlined'}
                                                onChange={(event) => {
                                                    if (event.target.checked) {
                                                        setFormData((prevData) => ({
                                                            ...prevData,
                                                            preferenceInterest: [...prevData.preferenceInterest, item.InterestID],
                                                        }));
                                                    } else {

                                                        setFormData((prevData) => ({
                                                            ...prevData,
                                                            preferenceInterest: prevData.preferenceInterest.filter(
                                                                (id) => id !== item.InterestID
                                                            ),
                                                        }));
                                                    }
                                                }}
                                                slotProps={{
                                                    action: ({ checked }) => ({
                                                        sx: checked
                                                            ? {
                                                                border: '1px solid',
                                                                borderColor: 'primary.500',
                                                            }
                                                            : {},
                                                    }),
                                                }}
                                            />
                                        </ListItem>
                                    ))
                                    }
                                </List>
                            </div>
                        </Sheet>
                        <Typography className="verified-text" style={{ paddingLeft:'10px', paddingTop: '5px', fontSize: '16px', marginTop: '5px', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => handleToggleChange('main')}>Back</Typography>

                    </div>
                ) : toggles.tongiao === true ? (
                    <div className="settings-container" >
                        <Typography  sx={{
                            fontStyle: "italic",
                            textAlign: "center",
                            lineHeight: "2rem",
                            fontSize: "15px",
                            paddingBottom:"10px"
                        }}>Hãy chọn tôn giáo bạn muốn tim kiếm ở đối tượng hẹn hò</Typography>
                        <Sheet variant="outlined" sx={{ width: 290, p: 2, borderRadius: 'sm' }}>
                            <div role="group" aria-labelledby="rank">
                                <List
                                    orientation="horizontal"
                                    wrap
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                        gap: '8px',
                                    }}
                                >
                                    {tongiao.map((item) => (
                                        <ListItem key={item}>
                                            {formData.preferenceRecord.preferenceLocation === item && (
                                                <Done
                                                    fontSize="md"
                                                    color="primary"
                                                    sx={{ ml: -0.5, zIndex: 2, pointerEvents: 'none' }}
                                                />
                                            )}
                                            <Checkbox
                                                size="sm"
                                                disableIcon
                                                overlay
                                                value={item}
                                                label={item}
                                                checked={formData.preferenceRecord.preferenceLocation === item}
                                                variant={formData.preferenceRecord.preferenceLocation === item ? 'soft' : 'outlined'}
                                                onChange={(event) => {
                                                    if (event.target.checked) {
                                                        setFormData((prevState) => ({
                                                            ...prevState,
                                                            preferenceRecord: {
                                                                ...prevState.preferenceRecord,
                                                                preferenceLocation: item,
                                                            },
                                                        }));
                                                    } else {
                                                        setFormData((prevState) => ({
                                                            ...prevState,
                                                            preferenceRecord: {
                                                                ...prevState.preferenceRecord,
                                                                preferenceLocation: "",
                                                            },
                                                        }));
                                                    }
                                                }}
                                                slotProps={{
                                                    action: ({ checked }) => ({
                                                        sx: checked
                                                            ? {
                                                                border: '1px solid',
                                                                borderColor: 'primary.500',
                                                            }
                                                            : {
                                                                border: '1px solid',
                                                                borderColor: 'rgb(165,164,164)',
                                                            },
                                                    }),
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                        </Sheet>
                        <Typography className="verified-text" style={{ paddingLeft:'10px', paddingTop: '5px', fontSize: '16px', marginTop: '5px', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => handleToggleChange('main')}>Back</Typography>
                    </div>
                ) : toggles.upgrade === true ? (
                    <Dialog
                        fullScreen={fullScreen}
                        open={true}
                        onClose={handleClose}
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogTitle id="responsive-dialog-title">
                            Các phiên bản nâng cấp
                        </DialogTitle>
                        <DialogActions style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button
                                autoFocus
                                style={{
                                    border: "1px solid #000",
                                    width: "50%",
                                    borderRadius: "20px",
                                    padding: "15px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    gap: "10px" // Ensures spacing between rows
                                }}
                                onClick={() => {
                                    paymentAxios.get('/vn-pay', {
                                        params: {
                                            id: formData.userRecord.userId,
                                            bankcode: bankcode,
                                            amount: amount
                                        }
                                    })
                                        .then((res) => {
                                            if (res.data) {
                                                console.log("Redirecting to:", res.data);
                                                window.open(res.data, "_blank");
                                            }
                                        })
                                        .catch((err) => {
                                            alert(err.response?.data || "An error occurred");
                                        });
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                    <img
                                        src="https://www.freepnglogos.com/uploads/diamond-png/diamond-icon-download-icons-3.png"
                                        alt="Diamond Icon"
                                        width="60"
                                        height="60"
                                    />
                                    <span style={{ fontSize: "18px", fontWeight: "bold" }}>PREMIUM</span>
                                    <img
                                        src="https://www.freepnglogos.com/uploads/diamond-png/diamond-icon-download-icons-3.png"
                                        alt="Diamond Icon"
                                        width="60"
                                        height="60"
                                    />
                                </div>

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                    <img
                                        src="https://static.vecteezy.com/system/resources/previews/019/006/277/original/money-cash-icon-png.png"
                                        alt="Money Icon"
                                        width="60"
                                        height="60"
                                    />
                                    <span style={{ fontSize: "16px", fontWeight: "bold" }}>25.000 đồng/tháng</span>
                                </div>

                                <div style={{ textAlign: "center", fontSize: "14px", maxWidth: "90%", color:"black", textTransform: "none"}}>
                                    Nâng cấp này sẽ cung cấp cho bạn thêm 20% khả năng gợi ý ghép đôi khi đối tượng hẹn hò tìm kiếm
                                </div>
                            </Button>
                        </DialogActions>
                    </Dialog>
                ) : null
             )}
        </div>
    );
};

export default Settings;
