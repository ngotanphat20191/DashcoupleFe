import { Modal, ModalClose, ModalDialog, Stack } from "@mui/joy";
import { Typography } from "@mui/material";
import Button from "@mui/joy/Button";
import React, { useEffect, useState } from "react";
import '../user/user.css';
import { adminAxios } from "../../../config/axiosConfig.jsx";

export default function TableInterestQuestionModify(props) {
    const [isConfirm, setIsConfirm] = useState(false);
    const [isModify, setIsModify] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(true);
    const [currentQuestionData, setCurrentQuestionData] = useState(null);

    useEffect(() => {
        if (props.data) {
            setCurrentQuestionData({
                QUESTION_ID: props.data.QUESTION_ID || '',
                QUESTION: props.data.QUESTION || '',
                OPTION_1: props.data.OPTION_1 || '',
                OPTION_2: props.data.OPTION_2 || '',
                OPTION_3: props.data.OPTION_3 || '',
                OPTION_4: props.data.OPTION_4 || ''
            });
        }
    }, [props.data]);

    function handleChange(e, key) {
        setCurrentQuestionData(prev => ({
            ...prev,
            [key]: e.target.value
        }));
    }

    function saveChanges() {
        setIsLoading(true);
        adminAxios.post('/interestsQuestion/update', { ...currentQuestionData })
            .then(r => {
                setIsLoading(false);
                setIsModify(false);
                setIsConfirm(false);
                console.log(r);
                props.setShowModify(false);
                props.handleRefresh();
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
                alert("Có lỗi xảy ra khi cập nhật câu hỏi");
            });
    }

    return (
        <>
            {showModal && (
                <Modal
                    open={props.showModifyPanel}
                    onClose={() => {
                        setIsModify(false);
                        setIsConfirm(false);
                        props.setShowModify(false);
                    }}
                >
                    <ModalDialog sx={{ paddingBlock: 1, width: '600px', maxWidth: '90vw' }}>
                        <Stack borderBottom="1px solid">
                            <Typography variant="h5">
                                Thông tin câu hỏi sở thích
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
                                        Cập nhật câu hỏi
                                    </Button>
                                    <Button variant="soft" color="danger" onClick={() => {
                                        setIsModify(false);
                                        setIsDeleted(prev => !prev);
                                        if (isDeleted) {
                                            props.handleDelete(currentQuestionData.QUESTION_ID);
                                        }
                                    }}>
                                        {isDeleted ? 'Ấn để xác nhận xóa' : "Xóa câu hỏi"}
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
                            <Stack sx={{ overflowY: 'auto', width: '100%' }}>
                                <Stack rowGap={1} sx={{ overflowY: 'auto' }}>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">ID Câu hỏi</p>
                                        <p className="personal-details-item-content">{currentQuestionData?.QUESTION_ID}</p>
                                    </div>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Câu hỏi</p>
                                        {isModify ? (
                                            <textarea
                                                className="personal-details-item-inp"
                                                value={currentQuestionData?.QUESTION || ''}
                                                onChange={(e) => handleChange(e, 'QUESTION')}
                                                style={{ minHeight: '60px' }}
                                            />
                                        ) : (
                                            <p className="personal-details-item-content">{currentQuestionData?.QUESTION}</p>
                                        )}
                                    </div>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Lựa chọn 1</p>
                                        {isModify ? (
                                            <input
                                                className="personal-details-item-inp"
                                                value={currentQuestionData?.OPTION_1 || ''}
                                                onChange={(e) => handleChange(e, 'OPTION_1')}
                                            />
                                        ) : (
                                            <p className="personal-details-item-content">{currentQuestionData?.OPTION_1}</p>
                                        )}
                                    </div>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Lựa chọn 2</p>
                                        {isModify ? (
                                            <input
                                                className="personal-details-item-inp"
                                                value={currentQuestionData?.OPTION_2 || ''}
                                                onChange={(e) => handleChange(e, 'OPTION_2')}
                                            />
                                        ) : (
                                            <p className="personal-details-item-content">{currentQuestionData?.OPTION_2}</p>
                                        )}
                                    </div>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Lựa chọn 3</p>
                                        {isModify ? (
                                            <input
                                                className="personal-details-item-inp"
                                                value={currentQuestionData?.OPTION_3 || ''}
                                                onChange={(e) => handleChange(e, 'OPTION_3')}
                                            />
                                        ) : (
                                            <p className="personal-details-item-content">{currentQuestionData?.OPTION_3}</p>
                                        )}
                                    </div>
                                    <div className="personal-details-item">
                                        <p className="personal-details-item-title">Lựa chọn 4</p>
                                        {isModify ? (
                                            <input
                                                className="personal-details-item-inp"
                                                value={currentQuestionData?.OPTION_4 || ''}
                                                onChange={(e) => handleChange(e, 'OPTION_4')}
                                            />
                                        ) : (
                                            <p className="personal-details-item-content">{currentQuestionData?.OPTION_4}</p>
                                        )}
                                    </div>
                                </Stack>
                            </Stack>
                        </Stack>
                    </ModalDialog>
                </Modal>
            )}
        </>
    );
};
