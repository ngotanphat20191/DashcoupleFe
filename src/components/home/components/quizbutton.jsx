import "../home.css";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import QuizInterest from "../../quizinterest/quizinterest.jsx";
import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material/styles";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import QuizIcon from '@mui/icons-material/Quiz';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {Box, Divider, Fade, Typography} from "@mui/material";

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
        setfirstpage(false);
    };

    const dialogStyles = {
        paper: {
            borderRadius: "24px",
            background: "linear-gradient(145deg, #ffffff, #fff8fc)",
            boxShadow: "0 10px 30px rgba(252, 106, 231, 0.25)",
            overflow: "hidden",
            border: "1px solid rgba(252, 106, 231, 0.15)",
            maxWidth: "600px",
            width: "100%"
        }
    };

    const instructionSteps = [
        "Bạn sẽ trả lời 10 câu hỏi liên quan đến sở thích.",
        "Dựa vào câu trả lời, bạn sẽ tìm được đối tượng hẹn hò phù hợp với yêu cầu của bạn hơn.",
        "Bạn có thể thực hiện bài test nhiều lần, càng làm nhiều lần, càng tăng khả năng ghép đôi.",
        "Kết quả của bài test này chỉ sử dụng nhằm mục đích nâng cao khả năng ghép đôi, không có mục đích khác."
    ];

    return (
        <>
            {firstpage ? (
                    <Dialog
                        fullScreen={fullScreen}
                        open={firstpage}
                        onClose={handleClose}
                        aria-labelledby="quiz-intro-dialog"
                        PaperProps={{style: dialogStyles.paper}}
                        TransitionComponent={Fade}
                        transitionDuration={400}
                    >
                        <DialogTitle
                            className="quizDialogTitle"
                        >
                            <div className="quizTitleWrapper">
                                <img
                                    src="https://img.freepik.com/premium-vector/green-folder-with-checklist-isolated-vector-white-background_349999-919.jpg?w=1380"
                                    alt="Quiz Icon"
                                    className="quizTitleIcon"
                                />
                                <Typography variant="h5" className="quizTitleText">
                                    Bài test sở thích
                                </Typography>
                            </div>
                        </DialogTitle>

                        <Divider className="quizDivider"/>

                        <DialogContent className="quizDialogContent">
                            <Typography variant="body1" className="quizIntroText">
                                Đây là chức năng bài test gợi ý, thực hiện bài test sẽ giúp bạn tăng cao khả năng
                                tìm đối tượng hẹn hò phù hợp.
                            </Typography>

                            <Box className="quizInstructionContainer">
                                {instructionSteps.map((step, index) => (
                                    <Box key={index} className="quizInstructionStep">
                                        <CheckCircleOutlineIcon className="quizCheckIcon"/>
                                        <Typography variant="body1">{step}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </DialogContent>

                        <DialogActions className="quizDialogActions">
                            <Button
                                variant="contained"
                                className="quizStartButton"
                                onClick={() => {
                                    setfirstpage(false);
                                    setOpen(true);
                                }}
                            >
                                Bắt đầu bài test
                            </Button>

                            <Button
                                variant="outlined"
                                className="quizCancelButton"
                                onClick={handleClose}
                            >
                                Hủy
                            </Button>
                        </DialogActions>
                    </Dialog>
                ) :
                <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="quiz-content-dialog"
                    PaperProps={{style: dialogStyles.paper}}
                    TransitionComponent={Fade}
                    transitionDuration={400}
                >
                    <DialogTitle
                        className="quizDialogTitle"
                    >
                        <div className="quizTitleWrapper">
                            <img
                                src="https://img.freepik.com/premium-vector/green-folder-with-checklist-isolated-vector-white-background_349999-919.jpg?w=1380"
                                alt="Quiz Icon"
                                className="quizTitleIcon"
                            />
                            <Typography variant="h5" className="quizTitleText">
                                Bài test sở thích
                            </Typography>
                        </div>
                    </DialogTitle>

                    <Divider className="quizDivider"/>

                    <DialogContent className="quizInterestContent">
                        <QuizInterest/>
                    </DialogContent>
                </Dialog>
            }

            <div className="QuizButtonContainer" onClick={handleClick}>
                <div className="QuizButtonWrapper">
                    <div className="QuizButtonImage">
                        <QuizIcon sx={{
                            fontSize: 40,
                            color: '#d81b98',
                            width: '100%',
                            height: '100%',
                            padding: '15px'
                        }}/>
                    </div>
                </div>
                <div className="QuizButtonLabel">Bài test gợi ý</div>
            </div>
        </>
    );
};

export default QuizButton;