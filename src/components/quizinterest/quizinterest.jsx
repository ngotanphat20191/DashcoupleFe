import { useState, useEffect } from "react";
import "./quizinterest.css";
import { baseAxios } from "../../config/axiosConfig.jsx";

function shuffle(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

const QuizInterest = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [result, setResult] = useState(null);
    const [questionText, setQuestionText] = useState("");
    const [choices, setChoices] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showNextButton, setShowNextButton] = useState(false);
    const [listQuestions, setListQuestions] = useState([]);
    const [questionPage, setQuestionPage] = useState(true);
    const [selectedQuestionsID, setSelectedQuestionsID] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [processing, setProcessing] = useState(false);
    const defaultQuestions = [
        {
            question_id: 39,
            question: "Khi cảm thấy căng thẳng, hoạt động nào giúp bạn thư giãn?",
            choices: [
                { text: "Thiền hoặc thở sâu"},
                { text: "Chạy bộ hoặc tập thể dục"},
                { text: "Thực hiện các hoạt động sáng tạo như vẽ tranh"},
                { text: "Đọc sách hoặc xem những nội dung thư giãn"},
            ],
        },
    ];
    const [progressStage, setProgressStage] = useState(1);
    const [progressPercent, setProgressPercent] = useState(10);

    const showQuestion = (index) => {
        resetState();
        const questionsToUse = listQuestions.length > 0 ? listQuestions : defaultQuestions;
        let currentQuestion = questionsToUse[index];
        let questionNumber = index + 1;
        setQuestionText(`${questionNumber}. ${currentQuestion.question}`);
        const shuffledChoices = shuffle(currentQuestion.choices);
        setChoices(shuffledChoices);
    };

    const resetState = () => {
        setChoices([]);
        setSelectedAnswer(null);
        setShowNextButton(false);
    };

    const selectChoice = (index) => {
        setSelectedAnswer(index);
        setShowNextButton(true);
    };

    const handleNextButton = () => {
        const questionsToUse = listQuestions.length > 0 ? listQuestions : defaultQuestions;
        const currentQuestion = questionsToUse[currentQuestionIndex];

        setSelectedQuestions((prev) => [...prev, currentQuestion.question]);
        setSelectedAnswers((prev) => [...prev, choices[selectedAnswer].text]);
        setSelectedQuestionsID((prev) => [...prev, currentQuestion.question_id]);
        if (currentQuestionIndex < questionsToUse.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            showQuestion(currentQuestionIndex + 1);
        } else {
            showResult();
        }
    };

    const showResult = () => {
        resetState();
        setQuestionPage(false);
        setProcessing(true);

        setProgressStage(1);
        setProgressPercent(10);

        const stage1Timer = setTimeout(() => {
            setProgressStage(2);
            setProgressPercent(45);
        }, 1500);

        const stage2Timer = setTimeout(() => {
            setProgressStage(3);
            setProgressPercent(68);
        }, 3000);

        baseAxios.post('/suggestionInterest/add', {
            questionIDlist: selectedQuestionsID,
            questionlist: selectedQuestions,
            answer: selectedAnswers
        })
            .then((res) => {
                setProgressStage(4);
                setProgressPercent(100);

                setTimeout(() => {
                    setProcessing(false);
                    setResult(res.data);
                }, 800);
            })
            .catch((err) => {
                console.error(err);
                setProcessing(false);
            });

        return () => {
            clearTimeout(stage1Timer);
            clearTimeout(stage2Timer);
        };
    };

    const startQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedQuestions([]);
        setSelectedAnswers([]);
        setShowNextButton(false);
        baseAxios.get('/suggestionInterest')
            .then((res) => {
                const backendQuestions = res.data.map((item) => ({
                    question_id: item.QUESTION_ID,
                    question: item.QUESTION,
                    choices: shuffle([
                        { text: item.OPTION_1 },
                        { text: item.OPTION_2 },
                        { text: item.OPTION_3 },
                        { text: item.OPTION_4 },
                    ]),
                }));
                setListQuestions(backendQuestions);
                showQuestion(0);
            })
            .catch(err => {
                console.error(err);
                showQuestion(0);
            });
    };

    useEffect(() => {
        startQuiz();
    }, []);

    return (
        <div className="quizContainer">
            <div className="quiz">
                { questionPage ? (
                    <>
                        <h2 id="question">{questionText}</h2>
                        <div id="answer-buttons">
                            {choices.map((choice, index) => (
                                <button
                                    key={index}
                                    className={`btnquiz ${selectedAnswer === index ? "correctquiz" : ""}`}
                                    onClick={() => selectChoice(index)}
                                    aria-label={choice.text}
                                    disabled={selectedAnswer !== null}
                                >
                                    {choice.text}
                                </button>
                            ))}
                        </div>
                        { showNextButton && (
                            <button id="next-button" onClick={handleNextButton}>
                                Next
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        { processing ? (
                            <div className="quizProcessingContainer">
                                <div className="quizProgressBarWrapper">
                                    <div className="quizProgressBarTitle">
                                        <span>Đang xử lý dữ liệu sở thích của bạn</span>
                                        <span className="quizProgressPercentage">{progressPercent}%</span>
                                    </div>
                                    <div className="quizProgressBarOuter">
                                        <div
                                            className="quizProgressBarInner"
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="quizProcessingSteps">
                                    <div className={`quizProcessingStep ${progressStage >= 1 ? 'completed' : ''}`}>
                                        <div className="quizStepIcon">
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="10" fill="#ff4081" />
                                                <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div className="quizStepContent">
                                            <div className="quizStepTitle">Thu thập câu trả lời</div>
                                            <div className="quizStepDescription">Đã lưu {selectedAnswers.length} câu trả lời của bạn</div>
                                        </div>
                                    </div>

                                    <div className={`quizProcessingStep ${progressStage >=2 ? 'completed' : ''}`}>
                                        <div className="quizStepIcon">
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="10" fill="#ff4081" />
                                                <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div className="quizStepContent">
                                            <div className="quizStepTitle">Phân tích sở thích</div>
                                            <div className="quizStepDescription">Đang tìm các mẫu và xu hướng trong sở thích của bạn</div>
                                        </div>
                                    </div>

                                    <div className={`quizProcessingStep ${progressStage >= 3 ? 'completed' : ''}`}>
                                        <div className="quizStepIcon">
                                            <div className="quizStepLoader"></div>
                                        </div>
                                        <div className="quizStepContent">
                                            <div className="quizStepTitle">Tìm kiếm đề xuất</div>
                                            <div className="quizStepDescription">Đang tìm những người phù hợp với sở thích của bạn</div>
                                        </div>
                                    </div>

                                    <div className={`quizProcessingStep ${progressStage >= 4 ? 'completed' : ''}`}>
                                        <div className="quizStepIcon">
                                            <span>4</span>
                                        </div>
                                        <div className="quizStepContent">
                                            <div className="quizStepTitle">Hoàn thành</div>
                                            <div className="quizStepDescription">Tạo báo cáo kết quả và cập nhật hồ sơ của bạn</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="quizProcessingTip">
                                    <div className="quizTipIcon">💡</div>
                                    <div className="quizTipText">
                                        Mẹo: Các câu trả lời chân thực sẽ giúp bạn tìm được đối tượng phù hợp nhất!
                                    </div>
                                </div>
                            </div>
                        ) : (
                            result?.checkpercentage == true ? (
                            <div style={{display: 'flex', flexDirection: 'column',alignItems: 'center', marginTop:"10px"}}>
                                <div style={{maxWidth: "100%", display: 'flex', alignItems: 'center', gap: '10px'}}>
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flat_tick_icon.svg/2048px-Flat_tick_icon.svg.png"
                                        alt="Yes Icon"
                                        width="50"
                                        height="50"
                                    /> Hoàn thành bài test
                                </div>
                                <div style={{width: "100%", display: 'flex', alignItems: 'center', gap: '10px'}}>
                                    <img
                                        src="https://th.bing.com/th/id/OIP._diciUJVjavNBdxBe8Ix5QHaHa?rs=1&pid=ImgDetMain"
                                        alt="Thank you Icon"
                                    />
                                </div>
                                <div style={{
                                    width: "100%",
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    fontWeight: "bold",
                                    marginTop: "5px"
                                }}>
                                    Phần trăm sở thích gợi ý phù hợp: {result?.percentage}
                                </div>
                                <div style={{
                                    width: "100%",
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    fontWeight: "bold",
                                    marginTop: "5px"
                                }}>
                                    Sở thích: {result?.interestNameList?.join(', ')}
                                </div>
                                <div style={{width: "100%", alignItems: 'center', textAlign: 'center', marginTop: "5px"}}>Dữ liệu sở
                                    thích gợi ý sẽ được lưu danh sách sở thích của bạn
                                </div>
                            </div>
                                ): (
                                    <div style={{display: 'flex', flexDirection: 'column',alignItems: 'center', marginTop:"10px"}}>
                                        <div style={{maxWidth: "100%", display: 'flex', alignItems: 'center', gap: '10px', marginLeft: "100px"}}>
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flat_tick_icon.svg/2048px-Flat_tick_icon.svg.png"
                                                alt="Yes Icon"
                                                width="50"
                                                height="50"
                                            /> Hoàn thành bài test
                                        </div>
                                        <div style={{width: "100%", display: 'flex', alignItems: 'center', gap: '10px'}}>
                                            <img
                                                src="https://cdn-icons-png.freepik.com/256/5969/5969619.png?semt=ais_hybrid"
                                                alt="Sorry Icon"
                                            />
                                        </div>
                                        <div style={{
                                            width: "100%",
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            fontWeight: "bold",
                                            marginTop: "5px"
                                        }}>
                                            Phần trăm sở thích gợi ý phù hợp: {result?.percentage}
                                        </div>
                                        <div style={{
                                            width: "100%",
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            fontWeight: "bold",
                                            marginTop: "5px"
                                        }}>
                                            Sở thích: {result?.interestNameList?.join(', ')}
                                        </div>
                                        <div style={{width: "100%", alignItems: 'center', textAlign: 'center', marginTop: "5px"}}>
                                            Do tỷ lệ khớp sở thích không vượt qua 70% nên không thể lưu lại thông tin sở thích trên. Hãy thử lại lần sau nha !
                                        </div>
                                    </div>
                                )
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default QuizInterest;
