import { Textarea } from '@mui/joy';
import Typography from '@mui/material/Typography';
import React, { useRef, useEffect, useState } from "react";
import Checkbox from '@mui/joy/Checkbox';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Sheet from '@mui/joy/Sheet';
import Done from '@mui/icons-material/Done';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import { FormControl, Autocomplete, TextField } from "@mui/material";
import EditRelationship from './editRelationship.jsx';
import EditBirthday from './editBirthday.jsx';
import { FcRuler } from "react-icons/fc";
import { FaCity } from "react-icons/fa";
import { FaUserGraduate } from "react-icons/fa";
import { ArrowForward } from "@mui/icons-material";

const EditInfo = ({ formData, setFormData }) => {
    const [value, setValue] = useState([]);
    const containerRef = useRef(null);
    const [state, setState] = useState({
        bottom: false,
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
                    .then((response) => response.json())
                    .then((data) => {
                        setFormData({ ...formData, city: data.address.city });
                    })
                    .catch((error) => console.error("Error fetching location data:", error));
            },
            (error) => {
                console.error("Error getting location:", error);
            }
        );
    }, [setFormData, formData]);

    const tongiao = ['Phật giáo', 'Thiên chúa giáo', 'Kito giáo', 'Hindu giáo', 'Hồi giáo'];
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
    const trinhdohocvan = [
        "Cao đẳng", "Đại học", "Đang học đại học", "Trung học phổ thông", "Thạc sĩ", "Tiến sĩ", "Đang học sau đại học", "Trường dạy nghề"
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
            sx={{ width: anchor.replace("Height", "") === 'bottom' ? 'auto' : 500 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <FormControl fullWidth>
                <Autocomplete
                    options={Array.from({ length: 150 }, (_, i) => i + 100)}
                    getOptionLabel={(option) => String(option + ' cm')}
                    value={formData.height || null}
                    onChange={(event, newValue) => {
                        setFormData({ ...formData, height: newValue });
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
            sx={{ width: anchor.replace("City", "") === 'bottom' ? 'auto' : 500 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <FormControl fullWidth>
                <Autocomplete
                    options={thanhpho}
                    getOptionLabel={(option) => String(option)}
                    value={formData.city || null}
                    onChange={(event, newValue) => {
                        setFormData({ ...formData, city: newValue });
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
            <div className="settings-container" >
                <Typography sx={{
                    fontStyle: "italic",
                    textAlign: "center",
                    lineHeight: "2rem",
                    fontSize: "15px",
                    paddingBottom: "10px"
                }}>Hãy chọn tôn giáo của bạn</Typography>
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
                                    {formData.religion === item && (
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
                                        checked={formData.religion === item}
                                        variant={formData.religion === item ? 'soft' : 'outlined'}
                                        onChange={(event) => {
                                            if (event.target.checked) {
                                                setFormData({ ...formData, religion: item });
                                            } else {
                                                setFormData({ ...formData, religion: "" });
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

    return (
        <div ref={containerRef}>
            <Typography sx={{
                fontStyle: "italic",
                textAlign: "center",
                lineHeight: "2rem",
                fontSize: "15px",
                paddingBottom: "10px"
            }}>Hãy cung cấp thông tin cần thiết nhằm tạo hoàn thiện thông tin để thực hiện ghép đôi phù hợp
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "14px", marginTop: "-5px", marginBottom: "5px" }}>Họ tên</Typography>
            <Textarea value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} minRows={1.2} style={{ color: "black", fontSize: '16px', marginBottom: '5%', marginLeft: '-5%', marginRight: '-5%', outline: 'none', borderLeft: '2px solid black', borderRadius: '0px', borderRight: '2px solid black', borderTop: '2px solid white' }} />
            <Typography sx={{ fontWeight: "bold", fontSize: "14px", marginTop: "-5px", marginBottom: "5px" }}>Ngày sinh</Typography>
            <EditBirthday formData={formData} setFormData={setFormData}></EditBirthday>
            <Typography sx={{ fontWeight: "bold", fontSize: "14px", marginTop: "-5px", marginBottom: "5px" }}>Lời giới thiệu</Typography>
            <Textarea value={formData.about || ""} onChange={(e) => setFormData({ ...formData, about: e.target.value })} minRows={2.5} style={{ color: "black", fontSize: '15px', marginLeft: '-5%', marginRight: '-5%', outline: 'none', borderLeft: '2px solid black', borderRadius: '0px', borderRight: '2px solid black', borderTop: '2px solid white' }} />
            <Typography sx={{ fontWeight: "bold", fontSize: "14px", margin: "5px 0px" }}>Giới tính</Typography>
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
                                    {formData.gender === item && (
                                        <Done
                                            fontSize="md"
                                            color="primary"
                                            sx={{ ml: -0.5, zIndex: 2, pointerEvents: 'none' }}
                                        />
                                    )}
                                    <Checkbox
                                        size="md"
                                        disableIcon
                                        overlay
                                        value={item}
                                        label={item}
                                        checked={formData.gender === item}
                                        variant={formData.gender === item ? 'soft' : 'outlined'}
                                        onChange={(event) => {
                                            if (event.target.checked) {
                                                setFormData({ ...formData, gender: item });
                                            } else {
                                                setFormData({ ...formData, gender: "" });
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
                                                        borderColor: 'rgb(165,164,164)'
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
            <div>
                <Typography sx={{ fontWeight: "bold", fontSize: "14px", margin: "5px 0px" }}>Chiều cao</Typography>
                {['bottomHeight'].map((anchor) => (
                    <React.Fragment key={anchor}>
                        <Button style={{ backgroundColor: 'white', color: "rgb(124,124,124)", fontWeight: "bold", marginLeft: '-5%', marginRight: '-10%', outline: 'none', paddingLeft: "5px", borderBottom: "2px solid rgb(229,232,235)", paddingTop: "10px", borderTop: "2px solid rgb(229,232,235)" }} onClick={toggleDrawer(anchor, true)}>
                            <FcRuler style={{ fontSize: '24px' }}></FcRuler >
                            <Typography sx={{ fontWeight: "bold", fontSize: "14px", paddingLeft: "2px" }}>{formData?.height ? formData.height + ' cm' : 'Thêm chiều cao'}</Typography>
                            <Typography sx={{ fontWeight: "bold", fontSize: "14px", marginLeft: formData?.height ? "303px" : "230px" }}> <ArrowForward className="settings-icon" /> </Typography>
                        </Button>
                        <SwipeableDrawer
                            anchor={anchor.replace("Height", "")}
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
                            {listHeight(anchor)}
                        </SwipeableDrawer>
                    </React.Fragment>
                ))}
            </div>
            <EditRelationship formData={formData} setFormData={setFormData}></EditRelationship>
            <Typography sx={{ fontWeight: "bold", fontSize: "14px", marginTop: "5px", marginBottom: "5px" }}>Công việc</Typography>
            <Textarea value={formData.Job || ""} onChange={(e) => setFormData({ ...formData, Job: e.target.value })} minRows={1} style={{ fontSize: '15px', marginLeft: '-5%', marginRight: '-5%', outline: 'none', borderLeft: '2px solid black', borderRadius: '0px', borderRight: '2px solid black', borderTop: '2px solid white' }} />
            <Typography sx={{ fontWeight: "bold", fontSize: "14px", marginTop: "5px", marginBottom: "5px" }}>Trình độ học vấn</Typography>
            {["bottomEducation"].map((anchor) => (
                <React.Fragment key={anchor}>
                    <Button
                        style={{
                            backgroundColor: "white",
                            color: "rgb(124,124,124)",
                            fontWeight: "bold",
                            marginLeft: "-5%",
                            marginRight: "-10%",
                            outline: "none",
                            paddingLeft: "5px",
                            borderBottom: "2px solid rgb(229,232,235)",
                            paddingTop: "10px",
                            borderTop: "2px solid rgb(229,232,235)",
                        }}
                        onClick={toggleDrawer(anchor, true)}
                    >
                        <FaUserGraduate style={{ color: "rgb(24,135,145)", fontSize: "25px" }} />
                        <Typography sx={{ fontWeight: "bold", fontSize: "14px", paddingLeft: "5px" }}>{formData?.Education ? formData.Education : 'Thêm trình độ học vấn'}
                        </Typography>
                        <Typography sx={{ fontWeight: "bold", fontSize: "14px", marginLeft: "168px" }}>
                            &gt;
                        </Typography>
                    </Button>
                    <SwipeableDrawer
                        anchor={anchor.replace("Education", "")}
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
                        <Sheet sx={{ width: 400, p: 2, borderRadius: 'sm' }}>
                            <div role="group" aria-labelledby="rank">
                                <Typography sx={{ fontWeight: "bold", fontSize: "18px", marginTop: "5px", marginBottom: "5px", textAlign: "center" }}>
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
                                                {formData.Education === item && (
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
                                                    value={item}
                                                    label={item}
                                                    checked={formData.Education === item}
                                                    variant={formData.Education === item ? 'soft' : 'outlined'}
                                                    onChange={(event) => {
                                                        if (event.target.checked) {
                                                            setFormData({ ...formData, Education: item });
                                                        } else {
                                                            setFormData({ ...formData, Education: "" });
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
                <Typography sx={{ fontWeight: "bold", fontSize: "14px", margin: "5px 0px" }}>Thành phố</Typography>
                {['bottomCity'].map((anchor) => (
                    <React.Fragment key={anchor}>
                        <Button style={{ backgroundColor: 'white', color: "rgb(124,124,124)", fontWeight: "bold", marginLeft: '-5%', marginRight: '-10%', outline: 'none', paddingLeft: "5px", borderBottom: "2px solid rgb(229,232,235)", paddingTop: "10px", borderTop: "2px solid rgb(229,232,235)" }} onClick={toggleDrawer(anchor, true)}>
                            <FaCity style={{ color: 'rgb(24,135,145)', fontSize: '25px' }}></FaCity>
                            <Typography sx={{ fontWeight: "bold", fontSize: "14px", paddingLeft: "5px" }}>{formData?.city ? formData.city : 'Thêm thành phố'}</Typography>
                            <Typography sx={{ fontWeight: "bold", fontSize: "14px", marginLeft: formData?.city ? "285px" : "230px" }}> <ArrowForward className="settings-icon" /> </Typography>
                        </Button>
                        <SwipeableDrawer
                            anchor={anchor.replace("City", "")}
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
                            {listCity(anchor)}
                        </SwipeableDrawer>
                    </React.Fragment>
                ))}
            </div>
            <div>
                <Typography sx={{ fontWeight: "bold", fontSize: "14px", margin: "5px 0px" }}>Tôn giáo</Typography>
                {['bottomReligion'].map((anchor) => (
                    <React.Fragment key={anchor}>
                        <Button style={{ backgroundColor: 'white', color: "rgb(124,124,124)", fontWeight: "bold", marginLeft: '-5%', marginRight: '-10%', outline: 'none', paddingLeft: "5px", borderBottom: "2px solid rgb(229,232,235)", paddingTop: "10px", borderTop: "2px solid rgb(229,232,235)" }} onClick={toggleDrawer(anchor, true)}>
                            <FaCity style={{ color: 'rgb(24,135,145)', fontSize: '25px' }}></FaCity>
                            <Typography sx={{ fontWeight: "bold", fontSize: "14px", paddingLeft: "5px" }}>{formData?.religion ? formData.religion : 'Thêm tôn giáo'}</Typography>
                            <Typography sx={{ fontWeight: "bold", fontSize: "14px", marginLeft: formData?.religion ? "285px" : "230px" }}> <ArrowForward className="settings-icon" /> </Typography>
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
export default EditInfo;