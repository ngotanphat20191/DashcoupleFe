import { Modal, ModalClose, ModalDialog, Stack } from "@mui/joy";
import { Autocomplete, TextField, Typography, Chip } from "@mui/material";
import Button from "@mui/joy/Button";
import React, { useEffect, useRef, useState } from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import './user.css';
import {adminAxios} from "../../../config/axiosConfig.jsx";

export default function TableStaffModify(props) {
    const [isConfirm, setIsConfirm] = useState(false);
    const [isModify, setIsModify] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const dateRangeRef = useRef(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(true);
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
    const [currentStaffData, setCurrentStaffData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(
        currentStaffData?.birthday
            ? new Date(currentStaffData.birthday + "T00:00:00")
            : new Date()
    );

    useEffect(() => {
        if (props.data?.userRecord) {
            setCurrentStaffData({
                userid: props.data.userRecord.User_ID || '',
                name: props.data.userRecord.name || '',
                type: props.data.type || '',
                gender: props.data.userRecord.gender || '',
                Education: props.data.userRecord.education || '',
                city: props.data.userRecord.city || '',
                height: props.data.userRecord.height || '',
                Job: props.data.userRecord.Job || '',
                birthday: props.data.userRecord.date_of_birth || '',
                about: props.data.userRecord.about || '',
                relationship: props.data.userRecord.relationship || '',
                status: props.data.status || '',
                religion: props.data.userRecord.religion || '',
                interests: props.data.interest || [],
                images:[],
                Haveson: '',
                phonenumber: '',
            });
        }
    }, [props.data]);

    useEffect(() => {
        console.log(props.data)
    }, []);
    function handleChange(e, key) {
        setCurrentStaffData(prev => ({
            ...prev,
            [key]: e.target.value
        }));
    }

    function handleSelectChange(type, value) {
        setCurrentStaffData(prev => ({
            ...prev,
            [type]: value
        }));
    }

    const handleDateChange = (item) => {
        const chosenDate = item.selection.startDate;
        const formattedDate = format(chosenDate, "yyyy-MM-dd");
        setSelectedDate(chosenDate);
        setCurrentStaffData({ ...currentStaffData, birthday: formattedDate });
        setShowDatePicker(false);
    };

    function saveChanges() {
        adminAxios.post('/profiles/update', { ...currentStaffData })
            .then(r => {
                setIsLoading(false);
                setIsModify(false);
                setIsConfirm(false);
                console.log(r);
            })
            .catch(err => console.log(err));
    }

    const handleInputClick = () => {
        setShowDatePicker(!showDatePicker);
    }
    return (
        <>
            {props.interestData && showModal && (
                <Modal
                    open={props.showModifyPanel}
                    onClose={() => {
                        setIsModify(false);
                        setIsConfirm(false);
                        props.setShowModify(false);
                    }}
                >
                    <ModalDialog sx={{ paddingBlock: 1 }}>
                        <Stack borderBottom="1px solid">
                            <Typography variant="h5">
                                Thông tin người dùng - {currentStaffData?.name}
                            </Typography>
                            <ModalClose />
                        </Stack>
                        <Stack direction="row" columnGap={4} sx={{ overflowY: 'auto' }}>
                            <Stack>
                                <Stack rowGap={1}>
                                    <Button variant="soft" onClick={() => {
                                        setIsDeleted(false);
                                        setIsModify(true);
                                    }}>
                                        Cập nhật thông tin
                                    </Button>
                                    <Button variant="soft" color="danger" onClick={() => {
                                        setIsModify(false);
                                        if (currentStaffData?.status === 0) {
                                            alert('Người dùng này đã bị xóa');
                                        } else {
                                            setIsDeleted(prev => !prev);
                                            if (isDeleted) {
                                                props.handleDelete(currentStaffData.userid);
                                            }
                                        }
                                    }}>
                                        {isDeleted ? 'Ấn để xác nhận xóa' : "Xóa người dùng"}
                                    </Button>
                                    {isModify && (
                                        isConfirm ? (
                                            <Button variant="solid" onClick={saveChanges}>
                                                {isLoading ? (
                                                    <div className="loader2"></div>
                                                ) : "Ấn để xác nhận thay đổi"}
                                            </Button>
                                        ) : (
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                columnGap: '0.5rem'
                                            }}>
                                                <Button variant="solid" onClick={() => setIsConfirm(true)}>
                                                    Xác nhận thay đổi
                                                </Button>
                                                <Button variant="soft" onClick={() => setIsModify(false)}>
                                                    Hủy
                                                </Button>
                                            </div>
                                        )
                                    )}
                                </Stack>
                            </Stack>
                            <Stack sx={{ overflowY: 'auto' }}>
                                <Stack rowGap={1} sx={{ overflowY: 'auto' }}>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Họ tên</p>
                                        {isModify ? (
                                            <input
                                                className="personal-details-item-inp"
                                                value={currentStaffData?.name || ''}
                                                onChange={(e) => handleChange(e, 'name')}
                                            />
                                        ) : (
                                            <p className="personal-details-item-content">{currentStaffData?.name}</p>
                                        )}
                                    </div>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Loại tài khoản</p>
                                        {isModify ? (
                                            <Select
                                                size="sm"
                                                value={currentStaffData?.type || ''}
                                                style={{ width: '75%', fontSize: '14px' }}
                                                onChange={(e, val) => handleSelectChange('type', val)}
                                            >
                                                <Option value="CLASSIC">CLASSIC</Option>
                                                <Option value="PREMIUM">PREMIUM</Option>
                                                <Option value="ADMIN">ADMIN</Option>
                                            </Select>
                                        ) : (
                                            <p className="personal-details-item-content">{currentStaffData?.type}</p>
                                        )}
                                    </div>
                                    <div className="personal-details-item-select-date">
                                        <p className="personal-details-item-title">Ngày sinh</p>
                                        {isModify ? (
                                            <div ref={dateRangeRef} className={`date-range-wrapper ${!showDatePicker ? "hide-date-range" : ""}`}>
                                            <div className="selected-date" onClick={handleInputClick}>
                                                <p style={{ marginLeft: "6px" }}>{format(selectedDate, "yyyy-MM-dd")}</p>
                                            </div>
                                                {showDatePicker && (
                                                <DateRange
                                                    editableDateInputs={true}
                                                    onChange={handleDateChange}
                                                    moveRangeOnFirstSelection={false}
                                                    ranges={[
                                                        {
                                                            startDate: selectedDate,
                                                            endDate: selectedDate,
                                                            key: "selection",
                                                        },
                                                    ]}
                                                    showMonthAndYearPickers={true}
                                                    showDateDisplay={false}
                                                    rangeColors={["#3f51b5"]}
                                                />
                                            )}
                                            </div>
                                        ) : (
                                            <p className="personal-details-item-content">
                                                {currentStaffData?.birthday}
                                            </p>
                                        )}
                                    </div>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Thành phố</p>
                                        {isModify ? (
                                            <Autocomplete
                                                options={thanhpho}
                                                value={currentStaffData?.city || ''}
                                                onChange={(event, newValue) => {
                                                    setCurrentStaffData({ ...currentStaffData, city: newValue });
                                                }}
                                                getOptionLabel={(option) => option}
                                                sx={{
                                                    width: '75%',
                                                    backgroundColor: 'white',
                                                    '.MuiAutocomplete-tag': {
                                                        fontSize: '14px',
                                                        padding: '2px 6px',
                                                        height: '24px'
                                                    },
                                                    '.MuiInputBase-root': {
                                                        minHeight: '32px',
                                                        fontSize: '14px'
                                                    },
                                                    '.MuiOutlinedInput-root': {
                                                        padding: '4px'
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        placeholder="Thêm thành phố"
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        ) : (
                                            <p className="personal-details-item-content">{currentStaffData?.city}</p>
                                        )}
                                    </div>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Giới tính</p>
                                        {isModify ? (
                                            <Select
                                                size="sm"
                                                value={currentStaffData?.gender || ''}
                                                style={{ width: '75%', fontSize: '14px' }}
                                                onChange={(e, val) => handleSelectChange('gender', val)}
                                            >
                                                <Option value="Nam">Nam</Option>
                                                <Option value="Nữ">Nữ</Option>
                                            </Select>
                                        ) : (
                                            <p className="personal-details-item-content">{currentStaffData?.gender}</p>
                                        )}
                                    </div>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Mối quan hệ</p>
                                        {isModify ? (
                                            <Select
                                                size="sm"
                                                value={currentStaffData?.relationship || ''}
                                                style={{ width: '75%', fontSize: '14px' }}
                                                onChange={(e, val) => handleSelectChange('relationship', val)}
                                            >
                                                <Option value="Người yêu">Người yêu</Option>
                                                <Option value="Bạn bè">Bạn bè</Option>
                                                <Option value="Bạn thân">Bạn thân</Option>
                                                <Option value="Yêu xa">Yêu xa</Option>
                                            </Select>
                                        ) : (
                                            <p className="personal-details-item-content">
                                                {currentStaffData?.relationship}
                                            </p>
                                        )}
                                    </div>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Tôn giáo</p>
                                        {isModify ? (
                                            <Select
                                                size="sm"
                                                value={currentStaffData?.religion || ''}
                                                style={{ width: '75%', fontSize: '14px' }}
                                                onChange={(e, val) => handleSelectChange('religion', val)}
                                            >
                                                <Option value="Phật giáo">Phật giáo</Option>
                                                <Option value="Thiên chúa giáo">Thiên chúa giáo</Option>
                                                <Option value="Kito giáo">Kito giáo</Option>
                                                <Option value="Hindu giáo">Hindu giáo</Option>
                                                <Option value="Hồi giáo">Hồi giáo</Option>
                                            </Select>
                                        ) : (
                                            <p className="personal-details-item-content">
                                                {currentStaffData?.religion}
                                            </p>
                                        )}
                                    </div>
                                </Stack>
                            </Stack>
                            <Stack>
                                <Stack rowGap={1}>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Chiều cao</p>
                                        {isModify ? (
                                            <Autocomplete
                                                sx={{
                                                    width: '100%',
                                                    backgroundColor: 'white',
                                                    '.MuiAutocomplete-tag': {
                                                        fontSize: '14px',
                                                        padding: '2px 6px',
                                                        height: '24px'
                                                    },
                                                    '.MuiInputBase-root': {
                                                        minHeight: '32px',
                                                        fontSize: '14px'
                                                    },
                                                    '.MuiOutlinedInput-root': {
                                                        padding: '4px'
                                                    }
                                                }}
                                                options={Array.from({ length: 150 }, (_, i) => i + 100)}
                                                getOptionLabel={(option) => String(option) + " cm"}
                                                value={currentStaffData?.height || ''}
                                                onChange={(event, newValue) => {
                                                    setCurrentStaffData({ ...currentStaffData, height: newValue });
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        placeholder="Chọn chiều cao"
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        ) : (
                                            <p className="personal-details-item-content">{currentStaffData?.height}</p>
                                        )}
                                    </div>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Lời giới thiệu</p>
                                        {isModify ? (
                                            <input
                                                className="personal-details-item-inp"
                                                style={{ width: '100%' }}
                                                value={currentStaffData?.about || ''}
                                                onChange={(e) => handleChange(e, 'about')}
                                            />
                                        ) : (
                                            <p className="personal-details-item-content">
                                                {currentStaffData?.about}
                                            </p>
                                        )}
                                    </div>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Công việc</p>
                                        {isModify ? (
                                            <input
                                                className="personal-details-item-inp"
                                                style={{ width: '100%' }}
                                                value={currentStaffData?.Job || ''}
                                                onChange={(e) => handleChange(e, 'Job')}
                                            />
                                        ) : (
                                            <p className="personal-details-item-content">
                                                {currentStaffData?.Job}
                                            </p>
                                        )}
                                    </div>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Trình độ học vấn</p>
                                        {isModify ? (
                                            <Autocomplete
                                                options={trinhdohocvan}
                                                value={currentStaffData?.Education || null}
                                                onChange={(event, newValue) => {
                                                    setCurrentStaffData(prev => ({ ...prev, Education: newValue }));
                                                }}
                                                getOptionLabel={(option) => option}
                                                sx={{
                                                    width: '100%',
                                                    backgroundColor: 'white',
                                                    '.MuiAutocomplete-tag': {
                                                        fontSize: '14px',
                                                        padding: '2px 6px',
                                                        height: '24px'
                                                    },
                                                    '.MuiInputBase-root': {
                                                        minHeight: '32px',
                                                        fontSize: '14px'
                                                    },
                                                    '.MuiOutlinedInput-root': {
                                                        padding: '4px'
                                                    }
                                                }}
                                                name="education"
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        placeholder="Chọn trình độ học vấn"
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        ) : (
                                            <p className="personal-details-item-content">
                                                {currentStaffData?.Education}
                                            </p>
                                        )}
                                    </div>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Sở thích</p>
                                        {isModify ? (
                                            <Autocomplete
                                                className="slidersearch"
                                                multiple
                                                options={Array.isArray(props.interestData) ? props.interestData : []}
                                                getOptionLabel={(option) => option?.name || ''}
                                                sx={{
                                                    width: '100%',
                                                    backgroundColor: 'white',
                                                    '.MuiAutocomplete-tag': {
                                                        fontSize: '14px',
                                                        padding: '2px 6px',
                                                        height: '24px'
                                                    },
                                                    '.MuiInputBase-root': {
                                                        minHeight: '32px',
                                                        fontSize: '14px'
                                                    },
                                                    '.MuiOutlinedInput-root': {
                                                        padding: '4px'
                                                    }
                                                }}
                                                value={(() => {
                                                    // Ensure interestData is an array
                                                    const interestDataArray = Array.isArray(props.interestData) 
                                                        ? props.interestData 
                                                        : [];
                                                    
                                                    // Ensure interests is an array
                                                    const interests = Array.isArray(currentStaffData?.interests) 
                                                        ? currentStaffData.interests 
                                                        : [];
                                                    
                                                    return interestDataArray.filter(interest => 
                                                        interest && interests.includes(Number(interest.InterestID))
                                                    );
                                                })()}
                                                onChange={(event, newValue) => {
                                                    const selectedIds = newValue.map(interest => Number(interest.InterestID)); // Store as integer
                                                    setCurrentStaffData({ ...currentStaffData, interests: selectedIds });
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        placeholder="Thêm sở thích"
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        ) : (
                                            <p className="personal-details-item-content">
                                                {(() => {
                                                    const selectedInterests = currentStaffData?.interests?.map(Number) || [];
                                                    if (!selectedInterests.length) return "Không có sở thích được chọn";
                                                    
                                                    // Ensure interestData is an array
                                                    const interestDataArray = Array.isArray(props.interestData) 
                                                        ? props.interestData 
                                                        : (props.interestData?.interests || []);
                                                    
                                                    if (!interestDataArray.length) return "Không có sở thích được chọn";
                                                    
                                                    const interestNames = interestDataArray
                                                        .filter(interest => interest && selectedInterests.includes(Number(interest.InterestID)))
                                                        .map(interest => interest.name)
                                                        .join(", ");
                                                    
                                                    return interestNames || "Không có sở thích được chọn";
                                                })()}
                                            </p>
                                        )}
                                    </div>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Tình trạng tài khoản</p>
                                        <p className="personal-details-item-content">
                                            {currentStaffData?.status === 1 ? "Đang hoạt động" : "Dừng hoạt động"}
                                        </p>
                                    </div>
                                </Stack>
                            </Stack>
                        </Stack>
                    </ModalDialog>
                </Modal>
            )}
        </>
    );
}
