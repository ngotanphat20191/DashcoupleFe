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
    const [resultText, setResultText] = useState("");

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

        baseAxios.post('/suggestionInterest/add', {
            questionIDlist: selectedQuestionsID,
            questionlist: selectedQuestions,
            answer: selectedAnswers
        })
            .then((res) => {
                console.log("Backend response:", res.data);
                setProcessing(false);
                setResultText("Thực hiện bài test thành công");
                setResult(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
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
                            <div style={{ display: 'flex', flexDirection: 'column'}}>
                                <div style={{ maxWidth: "100%", display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img
                                        src="https://media.tenor.com/On7kvXhzml4AAAAC/loading-gif.gif"
                                        alt="Wating Icon"
                                        width="60"
                                        height="60"
                                    />Đang xử lý dữ liệu
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column',alignItems: 'center', marginTop:"10px"}}>
                                <div style={{ maxWidth: "100%", display: 'flex', alignItems: 'center', gap: '10px'  }}>
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flat_tick_icon.svg/2048px-Flat_tick_icon.svg.png"
                                        alt="Yes Icon"
                                        width="50"
                                        height="50"
                                    /> Hoàn thành bài test
                                </div>
                                <div style={{ width: "100%", display: 'flex', alignItems: 'center', gap: '10px'  }}>
                                    <img
                                        src="https://th.bing.com/th/id/OIP._diciUJVjavNBdxBe8Ix5QHaHa?rs=1&pid=ImgDetMain"
                                        alt="Thank you Icon"
                                    />
                                </div>
                                <div style={{ width: "100%", alignItems: 'center', textAlign: 'center', fontWeight: "bold", marginTop: "5px"}}>
                                    Phần trăm sở thích gợi ý phù hợp: {result.percentage}
                                </div>
                                <div style={{ width: "100%", alignItems: 'center', textAlign: 'center', fontWeight: "bold" , marginTop: "5px"}}>
                                    Sở thích: {result.interestNameList?.join(', ')}
                                </div>
                                <div style={{ width: "100%", alignItems: 'center', textAlign: 'center',marginTop: "5px"}}>Dữ liệu sở thích gợi ý sẽ được lưu danh sách sở thích của bạn</div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default QuizInterest;
