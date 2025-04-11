import { Modal, ModalClose, ModalDialog, Stack } from "@mui/joy";
import { Typography } from "@mui/material";
import Button from "@mui/joy/Button";
import '../user/user.css';
import { useState } from "react";
import { adminAxios } from "../../../config/axiosConfig.jsx";

export default function TableInterestAdd(props) {
    const [isConfirm, setIsConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(true);
    const [interestName, setInterestName] = useState("");

    function handleChange(e) {
        setInterestName(e.target.value);
    }

    function validateForm() {
        if (!interestName || interestName.trim() === '') {
            alert('Vui lòng nhập tên sở thích');
            return false;
        }
        return true;
    }

    function saveChanges() {
        if (!validateForm()) return;
        
        setIsLoading(true);
        adminAxios.post('/interests/add', {
            name: interestName
        })
            .then(r => {
                setIsLoading(false);
                setIsConfirm(false);
                console.log(r);
                alert('Thêm sở thích thành công');
                // Reset form
                setInterestName('');
                // Close modal
                props.setShowModify(false);
                // Refresh data if handler provided
                if (props.handleRefresh) {
                    props.handleRefresh();
                }
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
                alert("Có lỗi xảy ra khi thêm sở thích");
            });
    }
    return (
        <>
            {showModal && (
                <Modal
                    open={props.showModifyPanel}
                    onClose={() => {
                        setIsConfirm(false);
                        props.setShowModify(false);
                    }}
                >
                    <ModalDialog sx={{ paddingBlock: 1, width: '500px', maxWidth: '90vw' }}>
                        <Stack borderBottom="1px solid">
                            <Typography variant="h5">
                                Thêm sở thích mới
                            </Typography>
                            <ModalClose />
                        </Stack>
                        <Stack sx={{ padding: '20px 0' }}>
                            <Stack rowGap={2}>
                                <div className="personal-details-item">
                                    <p className="personal-details-item-title">Tên sở thích</p>
                                    <input
                                        className="personal-details-item-inp"
                                        value={interestName}
                                        onChange={handleChange}
                                        placeholder="Nhập tên sở thích..."
                                    />
                                </div>
                                
                                {isConfirm ? (
                                    <Button variant="solid" onClick={saveChanges}>
                                        {isLoading ? (
                                            <div className="loader2"></div>
                                        ) : "Ấn để xác nhận thêm"}
                                    </Button>
                                ) : (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        columnGap: '0.5rem'
                                    }}>
                                        <Button variant="solid" onClick={() => setIsConfirm(true)}>
                                            Xác nhận thêm
                                        </Button>
                                        <Button variant="soft" onClick={() => props.setShowModify(false)}>
                                            Hủy
                                        </Button>
                                    </div>
                                )}
                            </Stack>
                        </Stack>
                    </ModalDialog>
                </Modal>
            )}
        </>
    );
}