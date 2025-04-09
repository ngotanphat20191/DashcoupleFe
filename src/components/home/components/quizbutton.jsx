import "../home.css";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import QuizInterest from "../../quizinterest/quizinterest.jsx"
import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material/styles";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const QuizButton = () => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = React.useState(false);
    const [firstpage, setfirstpage] = React.useState(false);

    const handleClick = () => {
        setfirstpage(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            {firstpage ? (
                <Dialog
                    fullScreen={fullScreen}
                    open={firstpage}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                    PaperProps={{
                        style: { borderRadius: "30px"}
                    }}                >
                    <DialogTitle
                        id="responsive-dialog-title"
                        style={{ display: 'flex', justifyContent: 'center' ,borderBottom:"1px solid black", borderRadius:"10px"}}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                                src="https://img.freepik.com/premium-vector/green-folder-with-checklist-isolated-vector-white-background_349999-919.jpg?w=1380"
                                alt="Education Icon"
                                width="60"
                                height="60"
                            />
                            <span style={{ fontSize: "25px" }}>Bài test sở thích</span>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText style={{ display: 'flex', flexDirection: 'column', marginTop:"10px"}}>
                            <div style={{ maxWidth: "100%", alignItems: 'center', textAlign: 'center'}}>Đây là chức năng bài test gợi ý, thực hiện bài test sẽ giúp bạn tăng cao khả năng tìm đối tượng hẹn hò phù hợp.</div>
                            <div style={{ maxWidth: "100%", display: 'flex', alignItems: 'center', gap: '10px'  }}>
                                <img
                                    src="https://media.istockphoto.com/vectors/in-compliance-icon-set-that-shows-company-passed-inspection-vector-id932071018?k=20&m=932071018&s=612x612&w=0&h=mcZMptoONQeOQV8yNiaNhdA_ZqJDdw2B1mAeS5v9sqQ="
                                    alt="Education Icon"
                                    width="60"
                                    height="60"
                                />Bạn sẽ trả lời 10 câu hỏi liên quan đến sở thích.</div>
                            <div style={{ maxWidth: "100%", display: 'flex', alignItems: 'center', gap: '10px'  }}>
                                <img
                                    src="https://media.istockphoto.com/vectors/in-compliance-icon-set-that-shows-company-passed-inspection-vector-id932071018?k=20&m=932071018&s=612x612&w=0&h=mcZMptoONQeOQV8yNiaNhdA_ZqJDdw2B1mAeS5v9sqQ="
                                    alt="Education Icon"
                                    width="60"
                                    height="60"
                                />Dựa vào câu trả lời, bạn sẽ tìm được đối tượng hẹn hò phù hợp với yêu cầu của bạn hơn.</div>
                            <div style={{ maxWidth: "100%", display: 'flex', alignItems: 'center', gap: '10px'   }}>
                                <img
                                    src="https://media.istockphoto.com/vectors/in-compliance-icon-set-that-shows-company-passed-inspection-vector-id932071018?k=20&m=932071018&s=612x612&w=0&h=mcZMptoONQeOQV8yNiaNhdA_ZqJDdw2B1mAeS5v9sqQ="
                                    alt="Education Icon"
                                    width="60"
                                    height="60"
                                />Bạn có thể thực hiện bài test nhiều lần, càng làm nhiều lần, càng tăng khả năng ghép đôi.</div>
                            <div style={{ maxWidth: "100%", display: 'flex', alignItems: 'center', gap: '10px'   }}>
                                <img
                                    src="https://media.istockphoto.com/vectors/in-compliance-icon-set-that-shows-company-passed-inspection-vector-id932071018?k=20&m=932071018&s=612x612&w=0&h=mcZMptoONQeOQV8yNiaNhdA_ZqJDdw2B1mAeS5v9sqQ="
                                    alt="Education Icon"
                                    width="60"
                                    height="60"
                                />Kết quả của bài test này chỉ sử dụng nhằm mục đích nâng cao khả năng ghép đôi, không có mục đích khác</div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Button
                            autoFocus
                            style={{
                                border: "1px solid #000",
                                padding: "6px 12px",
                                marginTop: "-20px",
                                borderRadius: "20px",
                                color: "white",
                                backgroundColor: "#2f7cd3",
                            }}
                            onClick={() => {
                                setfirstpage(false);
                                setOpen(true);
                            }}
                        >
                            Bắt đầu bài test
                        </Button>
                    </DialogActions>
                </Dialog>
            ) : open ? (
                <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                    PaperProps={{
                        style: { borderRadius: "30px"}
                    }}
                >
                    <DialogTitle
                        id="responsive-dialog-title"
                        style={{ display: 'flex', justifyContent: 'center' ,borderBottom:"1px solid black", borderRadius:"10px"}}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                                src="https://img.freepik.com/premium-vector/green-folder-with-checklist-isolated-vector-white-background_349999-919.jpg?w=1380"
                                alt="Education Icon"
                                width="60"
                                height="60"
                            />
                            <span style={{ fontSize: "25px" }}>Bài test sở thích</span>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <QuizInterest/>
                    </DialogContent>
                </Dialog>
            ) : null}
            <button className="QuizButtonContainer" onClick={handleClick}>
                <img
                src="https://cdn3.iconfinder.com/data/icons/education-248/128/37-512.png"
                alt="Education Icon"
                width="60"
                height="60"
                />
            </button>
        </>
    );
};
export default QuizButton;
