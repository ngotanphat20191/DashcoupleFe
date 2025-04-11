import { Modal, ModalClose, ModalDialog, Stack } from "@mui/joy";
import { Typography } from "@mui/material";
import Button from "@mui/joy/Button";
import '../user/user.css';
import { useState } from "react";
import { adminAxios } from "../../../config/axiosConfig.jsx";

export default function TableInterestQuestionAdd(props) {
    const [isConfirm, setIsConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(true);
    const [newQuestionData, setNewQuestionData] = useState({
        QUESTION: '',
        OPTION_1: '',
        OPTION_2: '',
        OPTION_3: '',
        OPTION_4: ''
    });

    function handleChange(e, key) {
        setNewQuestionData(prev => ({
            ...prev,
            [key]: e.target.value
        }));
    }

    function validateForm() {
        if (!newQuestionData.QUESTION || newQuestionData.QUESTION.trim() === '') {
            alert('Vui lòng nhập câu hỏi');
            return false;
        }
        if (!newQuestionData.OPTION_1 || newQuestionData.OPTION_1.trim() === '') {
            alert('Vui lòng nhập lựa chọn 1');
            return false;
        }
        if (!newQuestionData.OPTION_2 || newQuestionData.OPTION_2.trim() === '') {
            alert('Vui lòng nhập lựa chọn 2');
            return false;
        }
        if (!newQuestionData.OPTION_3 || newQuestionData.OPTION_3.trim() === '') {
            alert('Vui lòng nhập lựa chọn 3');
            return false;
        }
        if (!newQuestionData.OPTION_4 || newQuestionData.OPTION_4.trim() === '') {
            alert('Vui lòng nhập lựa chọn 4');
            return false;
        }
        return true;
    }

    function saveChanges() {
        if (!validateForm()) return;
        
        setIsLoading(true);
        adminAxios.post('/interestsQuestion/add', newQuestionData)
            .then(r => {
                setIsLoading(false);
                setIsConfirm(false);
                console.log(r);
                alert('Thêm câu hỏi thành công');
                setNewQuestionData({
                    QUESTION: '',
                    OPTION_1: '',
                    OPTION_2: '',
                    OPTION_3: '',
                    OPTION_4: ''
                });
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
                alert("Có lỗi xảy ra khi thêm câu hỏi");
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
                    <ModalDialog sx={{ paddingBlock: 1, width: '600px', maxWidth: '90vw' }}>
                        <Stack borderBottom="1px solid">
                            <Typography variant="h5">
                                Thêm câu hỏi sở thích mới
                            </Typography>
                            <ModalClose />
                        </Stack>
                        <Stack direction="row" columnGap={4} sx={{ overflowY: 'auto' }}>
                            <Stack>
                                <Stack rowGap={1}>
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
                            <Stack sx={{ overflowY: 'auto', width: '100%' }}>
                                <Stack rowGap={1} sx={{ overflowY: 'auto' }}>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Câu hỏi</p>
                                        <textarea
                                            className="personal-details-item-inp"
                                            value={newQuestionData.QUESTION}
                                            onChange={(e) => handleChange(e, 'QUESTION')}
                                            style={{ minHeight: '60px' }}
                                            placeholder="Nhập câu hỏi..."
                                        />
                                    </div>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Lựa chọn 1</p>
                                        <input
                                            className="personal-details-item-inp"
                                            value={newQuestionData.OPTION_1}
                                            onChange={(e) => handleChange(e, 'OPTION_1')}
                                            placeholder="Nhập lựa chọn 1..."
                                        />
                                    </div>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Lựa chọn 2</p>
                                        <input
                                            className="personal-details-item-inp"
                                            value={newQuestionData.OPTION_2}
                                            onChange={(e) => handleChange(e, 'OPTION_2')}
                                            placeholder="Nhập lựa chọn 2..."
                                        />
                                    </div>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Lựa chọn 3</p>
                                        <input
                                            className="personal-details-item-inp"
                                            value={newQuestionData.OPTION_3}
                                            onChange={(e) => handleChange(e, 'OPTION_3')}
                                            placeholder="Nhập lựa chọn 3..."
                                        />
                                    </div>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Lựa chọn 4</p>
                                        <input
                                            className="personal-details-item-inp"
                                            value={newQuestionData.OPTION_4}
                                            onChange={(e) => handleChange(e, 'OPTION_4')}
                                            placeholder="Nhập lựa chọn 4..."
                                        />
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