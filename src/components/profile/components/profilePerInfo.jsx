import { Textarea } from '@mui/joy';
import Typography from '@mui/material/Typography';
import React, { useRef, useState, useEffect } from "react";
import Checkbox from '@mui/joy/Checkbox';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Sheet from '@mui/joy/Sheet';
import Done from '@mui/icons-material/Done';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import { MenuItem, Select, FormControl, Autocomplete, TextField } from "@mui/material";
import ProfileRelationship from './profileRelationship.jsx';
import ProfileBirthday from './profileBirthday.jsx';
import { FcRuler } from "react-icons/fc";
import { FaCity } from "react-icons/fa";
import { FaUserGraduate } from "react-icons/fa";
import {ArrowForward} from "@mui/icons-material";
const gioitinh = ['Nam', 'Nữ', 'Chuyển giới nam', 'Chuyển giới nữ', 'Song tính'];
const thanhpho = [
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
    "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
    "Bình Thuận", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng",
    "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp",
    "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh",
    "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên",
    "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng",
    "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An",
    "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình",
    "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng",
    "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa",
    "Thừa Thiên Huế", "Tiền Giang", "TP. Hồ Chí Minh", "Trà Vinh", "Tuyên Quang",
    "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];
const tongiao = ['Phật giáo', 'Thiên chúa giáo', 'Kito giáo', 'Hindu giáo', 'Hồi giáo'];
const trinhdohocvan = [
    "Cao đẳng", "Đại học", "Đang học đại học", "Trung học phổ thông", "Thạc sĩ", "Tiến sĩ", "Đang học sau đại học", "Trường dạy nghề"
];
const ProfilePerInfo = ({ containerRef, formData, setFormData }) => {
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
                    .then((response) => response.json())
                    .then((data) => {
                        setFormData({ ...formData, city : data.address.city});
                    })
                    .catch((error) => console.error("Error fetching location data:", error));
            },
            (error) => {
                console.error("Error getting location:", error);
            }
        );
    }, []);
    const [value, setValue] = React.useState([]);
    const [state, setState] = React.useState({
        bottom: false,
    });
    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };
    const listHeight = (anchor) => (
        <Box
            sx={{ width:  anchor=anchor.replace("Height", "") === 'bottom' ? 'auto' : 500 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <FormControl fullWidth>
                <Autocomplete
                    options={Array.from({ length: 150 }, (_, i) => i + 100)}
                    getOptionLabel={(option) => String(option)}
                    value={formData.userRecord.height || 'Đơn vị tính (cm)'}
                    onChange={(event, newValue) => {
                        setFormData((prevState) => ({
                            ...prevState,
                            userRecord: {
                                ...prevState.userRecord,
                                height: newValue
                            }
                        }))
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Chọn chiều cao" variant="outlined" />
                    )}
                />
            </FormControl>
        </Box>
    );
    const listCity = (anchor) => (
        <Box
            sx={{ width: anchor=anchor.replace("City", "") === 'bottom' ? 'auto' : 500 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <FormControl fullWidth>
                <Autocomplete
                    options={thanhpho}
                    getOptionLabel={(option) => String(option)}
                    value={formData.userRecord.city || ""}
                    onChange={(event, newValue) => {
                        setFormData((prevState) => ({
                            ...prevState,
                            userRecord: {
                                ...prevState.userRecord,
                                city: newValue
                            }
                        }))
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Chọn thành phố" variant="outlined" />
                    )}
                />
            </FormControl>
        </Box>
    );
    const listReligion = (anchor) => (
        <Box
            sx={{ width: anchor.replace("Religion", "") === 'bottom' ? 'auto' : 500 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <div>
                <Typography sx={{
                    fontStyle: "italic",
                    textAlign: "center",
                    lineHeight: "2rem",
                    fontSize: "15px",
                    paddingBottom: "10px"
                }}>Hãy chọn tôn giáo của bạn</Typography>
                <Sheet variant="outlined" sx={{ width: 290, p: 2, borderRadius: 'sm', marginLeft: "50px" }}>
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
                                    {formData.userRecord.religion === item && (
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
                                        checked={formData.userRecord.religion === item}
                                        variant={formData.userRecord.religion === item ? 'soft' : 'outlined'}
                                        onChange={(event) => {
                                            if (event.target.checked) {
                                                setFormData((prevState) => ({
                                                    ...prevState,
                                                    userRecord: {
                                                        ...prevState.userRecord,
                                                        religion: item,
                                                    },
                                                }));
                                            } else {
                                                setFormData((prevState) => ({
                                                    ...prevState,
                                                    userRecord: {
                                                        ...prevState.userRecord,
                                                        religion: "",
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
            </div>
        </Box>
    );
    return(
        <div>
            <Typography  sx={{
                fontStyle: "italic",
                textAlign: "center",
                lineHeight: "2rem",
                fontSize: "15px",
                paddingBottom:"10px"
            }}>Hãy cung cấp thông tin cần thiết nhằm tạo hoàn thiện thông tin để thực hiện ghép đôi phù hợp
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize:"14px", marginTop:"-5px", marginBottom:"5px"}}>Họ tên</Typography>
            <Textarea  value={formData.userRecord.name || ""}
                       onChange={(e) =>
                           setFormData((prevState) => ({
                           ...prevState,
                           userRecord: {
                               ...prevState.userRecord,
                               name: e.target.value
                           }
                       }))}
                       minRows={1.2} style={{color: "black", fontSize:'16px', marginBottom: '5%',marginLeft: "-5%",
                width: "105%", outline: 'none', borderLeft: '2px solid black', borderRadius:'0px', borderRight: '2px solid black', borderTop: '2px solid white'}}/>
            <Typography sx={{ fontWeight: "bold", fontSize:"14px", marginTop:"-5px", marginBottom:"5px"}}>Ngày sinh</Typography>
            <ProfileBirthday formData={formData} setFormData={setFormData}></ProfileBirthday>
            <Typography sx={{ fontWeight: "bold", fontSize:"14px", marginTop:"-5px", marginBottom:"5px"}}>Lời giới thiệu</Typography>
            <Textarea  value={formData.userRecord.about || ""}
                       onChange={(e) =>
                           setFormData((prevState) => ({
                               ...prevState,
                               userRecord: {
                                   ...prevState.userRecord,
                                   about: e.target.value
                               }
                           }))}
                       minRows={2} style={{fontSize:'15px',  marginLeft: "-5%", width: "105%", outline: 'none', borderLeft: '2px solid black', borderRadius:'0px', borderRight: '2px solid black', borderTop: '2px solid white'}}/>
            <Typography sx={{ fontWeight: "bold", fontSize:"14px", margin:"5px 0px"}}>Giới tính</Typography>
            <Sheet variant="outlined" sx={{ width: 360, p: 2, borderRadius: 'sm' }}>
                <div role="group" aria-labelledby="rank">
                    <List
                        orientation="horizontal"
                        wrap
                        sx={{
                            '--List-gap': '8px',
                            '--ListItem-radius': '20px',
                            '--ListItem-minHeight': '32px',
                            '--ListItem-gap': '4px',
                        }}
                    >
                        {gioitinh.map(
                            (item) => (
                                <ListItem key={item}>
                                    {value.includes(item) && (
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
                                        value={formData.userRecord.gender || ""}
                                        label={item}
                                        checked={formData.userRecord.gender.includes(item)}
                                        variant={formData.userRecord.gender.includes(item) ? 'soft' : 'outlined'}
                                        onChange={(event) => {
                                            if (event.target.checked) {
                                                setValue([item]);
                                                setFormData((prevState) => ({
                                                    ...prevState,
                                                    userRecord: {
                                                        ...prevState.userRecord,
                                                        gender: item
                                                    }
                                                }))
                                            } else {
                                                setValue([]);
                                                setFormData((prevState) => ({
                                                    ...prevState,
                                                    userRecord: {
                                                        ...prevState.userRecord,
                                                        gender: ""
                                                    }
                                                }))
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
                                                        borderColor: 'rgb(165,164,164)  '},
                                            }),
                                        }}
                                    />
                                </ListItem>
                            ),
                        )}
                    </List>
                </div>
            </Sheet>
            <div>
                <Typography sx={{ fontWeight: "bold", fontSize:"14px", margin:"5px 0px"}}>Chiều cao</Typography>
                {['bottomHeight'].map((anchor) => (
                    <React.Fragment key={anchor}>
                        <Button 
                            style={{
                                backgroundColor:'white',
                                color:"rgb(124,124,124)", 
                                fontWeight: "bold",
                                outline: 'none',
                                marginLeft: "-5%",
                                width: "105%",
                                borderBottom: "2px solid rgb(229,232,235)",
                                paddingTop:"10px", 
                                borderTop: "2px solid rgb(229,232,235)",
                                display: "flex",
                                justifyContent: "space-between"
                            }} 
                            onClick={toggleDrawer(anchor, true)}
                        >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <FcRuler style={{ fontSize:'24px'}} />
                                <Typography sx={{ fontWeight: "bold", fontSize:"14px"}}>
                                    {formData?.userRecord.height ? formData.userRecord.height+' cm' : 'Thêm chiều cao'}
                                </Typography>
                            </div>
                            <ArrowForward className="settings-icon-profile" />
                        </Button>
                        <SwipeableDrawer
                            anchor={anchor.replace("Height", "")}
                            open={state[anchor]}
                            onClose={toggleDrawer(anchor, false)}
                            onOpen={toggleDrawer(anchor, true)}
                            container={() => containerRef.current}
                            disablePortal
                            ModalProps={{
                                keepMounted: true,
                            }}
                            sx={{
                                "& .MuiDrawer-paper": {
                                    maxWidth: 400,
                                    borderRadius: "10px",
                                },
                            }}
                        >
                            {listHeight(anchor)}
                        </SwipeableDrawer>
                    </React.Fragment>
                ))}
            </div>
            <ProfileRelationship containerRef={containerRef} formData={formData} setFormData={setFormData}></ProfileRelationship>
            <Typography sx={{ fontWeight: "bold", fontSize:"14px", marginTop:"5px", marginBottom:"5px"}}>Công việc</Typography>
            <Textarea value={formData.userRecord.Job || ""}
                      onChange={(e) =>
                          setFormData((prevState) => ({
                              ...prevState,
                              userRecord: {
                                  ...prevState.userRecord,
                                  Job: e.target.value
                              }
                          }))}
                      minRows={1} style={{fontSize:'15px', outline: 'none', borderLeft: '2px solid black', borderRadius:'0px', borderRight: '2px solid black', borderTop: '2px solid white', marginLeft: "-5%",
                width: "105%"}}/>
            <Typography sx={{ fontWeight: "bold", fontSize:"14px", marginTop:"5px", marginBottom:"5px"}}>Trình độ học vấn</Typography>
            {["bottomEducation"].map((anchor) => (
                <React.Fragment key={anchor}>
                    <Button
                        style={{
                            backgroundColor: "white",
                            color: "rgb(124,124,124)",
                            fontWeight: "bold",
                            outline: "none",
                            paddingLeft: "5px",
                            borderBottom: "2px solid rgb(229,232,235)",
                            paddingTop: "10px",
                            borderTop: "2px solid rgb(229,232,235)",
                            marginLeft: "-5%",
                            width: "105%",
                            display: "flex",
                            justifyContent: "space-between"
                        }}
                        onClick={toggleDrawer(anchor, true)}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <FaUserGraduate style={{ color: "rgb(24,135,145)", fontSize: "25px" }} />
                            <Typography sx={{ fontWeight: "bold", fontSize: "14px", paddingLeft: "5px" }}>
                                {formData.userRecord?.education ? formData.userRecord.education : "Thêm trình độ học vấn"}
                            </Typography>
                        </div>
                        <ArrowForward className="settings-icon-profile" />
                    </Button>
                    <SwipeableDrawer
                        anchor={anchor.replace("Education", "")}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}
                        container={containerRef.current}
                        disablePortal
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{
                            "& .MuiDrawer-paper": {
                                maxWidth: 400,
                                borderRadius: "10px",
                            },
                        }}
                    >
                        <Sheet  sx={{ width: 400, p: 2, borderRadius: 'sm' }}>
                            <div role="group" aria-labelledby="rank">
                                <Typography sx={{ fontWeight: "bold", fontSize:"18px", marginTop:"5px", marginBottom:"5px", textAlign: "center"}}>
                                    <FaUserGraduate style={{ color: "rgb(24,135,145)", fontSize: "25px", marginRight: '5px' }} />
                                    Trình độ học vấn hiện tại của bạn
                                </Typography>
                                <List
                                    orientation="horizontal"
                                    wrap
                                    sx={{
                                        '--List-gap': '5px',
                                        '--ListItem-radius': '20px',
                                        '--ListItem-minHeight': '40px',
                                        '--ListItem-gap': '8px',
                                    }}
                                >
                                    {trinhdohocvan.map(
                                        (item) => (
                                            <ListItem key={item}>
                                                {value.includes(item) && (
                                                    <Done
                                                        fontSize="20"
                                                        color="primary"
                                                        sx={{ ml: -0.5, zIndex: 2, pointerEvents: 'none' }}
                                                    />
                                                )}
                                                <Checkbox
                                                    size="md"
                                                    disableIcon
                                                    overlay
                                                    value={formData.userRecord.education || ""}
                                                    label={item}
                                                    checked={formData.userRecord.education.includes(item)}
                                                    variant={formData.userRecord.education.includes(item) ? 'soft' : 'outlined'}
                                                    onChange={(event) => {
                                                        if (event.target.checked) {
                                                            setValue([item]);
                                                            setFormData((prevState) => ({
                                                                ...prevState,
                                                                userRecord: {
                                                                    ...prevState.userRecord,
                                                                    education: item
                                                                }
                                                            }))
                                                        } else {
                                                            setValue([]);
                                                            setFormData((prevState) => ({
                                                                ...prevState,
                                                                userRecord: {
                                                                    ...prevState.userRecord,
                                                                    education: ""
                                                                }
                                                            }))
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
                                        ),
                                    )}
                                </List>
                            </div>
                        </Sheet>
                    </SwipeableDrawer>
                </React.Fragment>
            ))}
            <div>
            <Typography sx={{ fontWeight: "bold", fontSize:"14px", margin:"5px 0px"}}>Thành phô</Typography>
            {['bottomCity'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <Button 
                        style={{
                            backgroundColor:'white',
                            color:"rgb(124,124,124)", 
                            fontWeight: "bold",
                            outline: 'none', 
                            paddingLeft:"5px", 
                            borderBottom: "2px solid rgb(229,232,235)", 
                            paddingTop:"10px", 
                            borderTop: "2px solid rgb(229,232,235)",
                            marginLeft: "-5%",
                            width: "105%",
                            display: "flex",
                            justifyContent: "space-between"
                        }} 
                        onClick={toggleDrawer(anchor, true)}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <FaCity style={{color:'rgb(24,135,145)', fontSize:'25px'}} />
                            <Typography sx={{ fontWeight: "bold", fontSize:"14px", paddingLeft: "5px"}}>
                                {formData?.userRecord.city ? formData.userRecord.city : 'Thêm thành phố'}
                            </Typography>
                        </div>
                        <ArrowForward className="settings-icon-profile" />
                    </Button>
                    <SwipeableDrawer
                        anchor={anchor.replace("City", "")}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}
                        container={containerRef.current}
                        disablePortal
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{
                            "& .MuiDrawer-paper": {
                                maxWidth: 400,
                                borderRadius: "10px",
                            },
                        }}
                    >
                        {listCity(anchor)}
                    </SwipeableDrawer>
                </React.Fragment>
            ))}
            </div>
            <div>
                <Typography sx={{ fontWeight: "bold", fontSize: "14px", margin: "5px 0px" }}>Tôn giáo</Typography>
                {['bottomReligion'].map((anchor) => (
                    <React.Fragment key={anchor}>
                        <Button 
                            style={{
                                backgroundColor: 'white', 
                                color: "rgb(124,124,124)", 
                                fontWeight: "bold",
                                outline: 'none', 
                                paddingLeft: "5px", 
                                borderBottom: "2px solid rgb(229,232,235)", 
                                paddingTop: "10px", 
                                borderTop: "2px solid rgb(229,232,235)",
                                marginLeft: "-5%",
                                width: "105%",
                                display: "flex",
                                justifyContent: "space-between"
                            }} 
                            onClick={toggleDrawer(anchor, true)}
                        >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <FaCity style={{ color: 'rgb(24,135,145)', fontSize: '25px' }} />
                                <Typography sx={{ fontWeight: "bold", fontSize: "14px", paddingLeft: "5px" }}>
                                    {formData?.userRecord.religion ? formData.userRecord.religion : 'Thêm tôn giáo'}
                                </Typography>
                            </div>
                            <ArrowForward className="settings-icon-profile" />
                        </Button>
                        <SwipeableDrawer
                            anchor={anchor.replace("Religion", "")}
                            open={state[anchor]}
                            onClose={toggleDrawer(anchor, false)}
                            onOpen={toggleDrawer(anchor, true)}
                            container={containerRef.current}
                            ModalProps={{
                                keepMounted: true,
                            }}
                            sx={{
                                "& .MuiDrawer-paper": {
                                    maxWidth: 400,
                                    borderRadius: "10px",
                                },
                            }}
                        >
                            {listReligion(anchor)}
                        </SwipeableDrawer>
                    </React.Fragment>
                ))}
            </div>

        </div>
    )
}
export default ProfilePerInfo;
