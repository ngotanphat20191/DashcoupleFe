import {Modal, ModalClose, ModalDialog, Stack} from "@mui/joy";
import {Typography} from "@mui/material";
import Button from "@mui/joy/Button";
import '../user/user.css'
import {useEffect, useState} from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

export default function TableInterestAdd(props) {
    const [isConfirm, setIsConfirm] = useState(false)
    const [isModify, setIsModify] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
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
    const [currentStaffData, setCurrentStaffData] = useState({})
    useEffect(() => {
        setCurrentStaffData({
            name: props.data.name,
            type: props.data.type,
            gender: props.data.gender,
            education: props.data.education,
            city: props.data.city,
            relationship: props.data.relationship,
            status: props.data.status
        })
    }, [props.data]);
    function handleChange(e, key){
        setCurrentStaffData(prev => {
            return {...prev, [key]: e.target.value}
        })
    }
    function handleSelectChange(type, value){
        setCurrentStaffData(prev => {
            return {...prev, [type]: value}
        })
    }

    function saveChanges(){
        console.log("Name before send:", currentStaffData.name)
        // adminAxios.patch('/staff/update', {
        //     name: currentStaffData.name,
        //     type: currentStaffData.type,
        //     gender: currentStaffData.gender,
        //     education: currentStaffData.education,
        //     city: currentStaffData.city,
        //     relationship: currentStaffData.relationship,
        //     status: currentStaffData.status
        // })
        //     .then(r => {
        //         setIsLoading(false)
        //         setIsModify(false)
        //         setIsConfirm(false)
        //         console.log(r)
        //     })
        //     .catch(err => console.log(err))
    }
    return (
        <>
            {showModal &&
                <Modal open={props.showModifyPanel} onClose={() => {
                    setIsModify(false)
                    setIsConfirm(false)
                    props.setShowModify(false)
                }}>
                    <ModalDialog sx={{paddingBlock: 1}}>
                        <Stack borderBottom={'1px solid'}>
                            <Typography
                                variant={'h5'}>{currentStaffData.name} - {currentStaffData.name}</Typography>
                            <ModalClose/>
                        </Stack>
                        <Stack direction={'row'} columnGap={4} sx={{overflowY: 'auto'}}>
                            <Stack>
                                <Stack rowGap={1}>
                                    <Button variant={'soft'} onClick={() => {
                                        setIsDeleted(false)
                                        setIsModify(true)
                                    }}>
                                        Update profile
                                    </Button>
                                    <Button variant={'soft'} color={"danger"} onClick={() => {
                                        setIsModify(false)
                                        if(currentStaffData.status === 'inactive') {
                                            alert('This staff is already deleted')
                                        }
                                        else {
                                            setIsDeleted(prev => !prev)
                                            if (isDeleted) {
                                                props.handleDelete()
                                            }
                                        }
                                    }}>
                                        {isDeleted ? 'Click to confirm changes' : "Delete profile"}
                                    </Button>
                                    {isModify && (
                                        isConfirm ? (
                                            <Button variant="solid" onClick={saveChanges}>
                                                {isLoading ?
                                                    <div className={'loader2'}></div>
                                                    :
                                                    "Click to confirm changes"
                                                }
                                            </Button>
                                        ) : (
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                columnGap: '0.5rem'
                                            }}>
                                                <Button variant="solid" onClick={() => setIsConfirm(true)}>
                                                    Save changes
                                                </Button>
                                                <Button variant="soft" onClick={() => setIsModify(false)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        )
                                    )}
                                </Stack>
                            </Stack>
                            <Stack sx={{overflowY: 'auto'}}>
                                <p className={'staff-detail-section-title'}>PERSONAL DETAILS</p>
                                <Stack rowGap={1}>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>Họ tên</p>
                                        {isModify ?
                                            <input className={'personal-details-item-inp'}
                                                   value={currentStaffData.name}
                                                   onChange={(e) => handleChange(e, 'name')}
                                            /> :
                                            <p className={'personal-details-item-content'}>{currentStaffData.name}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>Trình độ học vấn</p>
                                        {isModify ?
                                            <input className={'personal-details-item-inp'}
                                                   value={currentStaffData.education}
                                                   onChange={(e) => handleChange(e, 'education')}
                                            /> :
                                            <p className={'personal-details-item-content'}>{currentStaffData.education}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>Thành phố</p>
                                        {isModify ?
                                            <input className={'personal-details-item-inp'}
                                                   value={currentStaffData.city}
                                                   onChange={(e) => handleChange(e, 'city')}
                                            /> :
                                            <p className={'personal-details-item-content'}>{currentStaffData.city}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>Giới tính</p>
                                        {isModify ?
                                            <Select size={"sm"} value={currentStaffData.gender}
                                                    onChange={(e, val) => handleSelectChange('gender', val)}>
                                                <Option value={'Male'}>Male</Option>
                                                <Option value={'Female'}>Female</Option>
                                            </Select>
                                            :
                                            <p className={'personal-details-item-content'}>{currentStaffData.gender}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>Mối quan hệ</p>
                                        {isModify ?
                                            <input className={'personal-details-item-inp'}
                                                   value={currentStaffData.relationship}
                                                   onChange={(e) => handleChange(e, 'relationship')}
                                            /> :
                                            <p className={'personal-details-item-content'}>
                                                {currentStaffData.relationship}
                                            </p>
                                        }
                                    </div>
                                </Stack>
                            </Stack>
                            <Stack>
                                <Stack rowGap={1}>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>Thành phố</p>
                                        {isModify ?
                                            <Select size={"sm"} onChange={handleSelectChange}
                                                    value={currentStaffData.city}>
                                                <Option select-type={'city'} value=""
                                                        onClick={() => handleSelectChange('city', '')}
                                                >{""}</Option>
                                                {thanhpho.map((thanhpho, index) => (
                                                    <Option select-type={'city'} value={thanhpho}
                                                            key={index}
                                                            onClick={() => handleSelectChange('city', thanhpho)}
                                                    >
                                                        {thanhpho}</Option>
                                                ))}
                                            </Select> :
                                            <p className={'personal-details-item-content'}>{currentStaffData.city}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>Trình độ học vấn</p>
                                        {isModify ?
                                            <Select size={"sm"} onChange={handleSelectChange}
                                                    value={currentStaffData.education}>
                                                <Option value=""
                                                        onClick={() => handleSelectChange('education', '')}
                                                >{""}</Option>
                                                {trinhdohocvan.map((trinhdohocvan, index) => (
                                                    <Option value={trinhdohocvan} key={index}
                                                            onClick={() => handleSelectChange('education', trinhdohocvan)}
                                                    >
                                                        {trinhdohocvan}</Option>
                                                ))}
                                            </Select> :
                                            <p className={'personal-details-item-content'}>{currentStaffData.education}</p>
                                        }
                                    </div>
                                    <div className={'personal-details-item'}>
                                        <p className={'personal-details-item-title'}>Tình trạng tài khoản</p>
                                        <p className={'personal-details-item-content'}>{currentStaffData.status}</p>
                                    </div>
                                </Stack>
                            </Stack>
                        </Stack>
                    </ModalDialog>
                </Modal>
            }
        </>
    )
}