import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Quiz, Question, Answer, Choice, QuestionType } from './interface'; // 引用已定义的接口
import { CgDanger } from "react-icons/cg";
import { RiPencilLine } from "react-icons/ri";
export default function preview() {
  const { cid, qid } = useParams();
    const userId = 'currentUser';  // 假设当前用户ID为currentUser
    const [quiz, setQuiz] = useState<Quiz | null>({
        _id: "66a5bff1b1b4289695d366f8",
        title: "Sample Quiz",
        description: "This is a sample quiz description.",
        quizType: "quiz",
        points: 100,
        assignmentGroup: "Sample Group",
        shuffleAnswers: false,
        timeLimit: 60,
        multipleAttempts: true,
        attemptLimit: 3,
        showCorrectAnswers: "Immediately",
        accessCode: "",
        oneQuestionAtATime: false,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false,
        dueDate: "2024-08-15",
        availableDate: "2024-05-16",
        availableUntilDate: "2024-08-15",
        lastModified: "",
        course: "course id",
        published: false
    });
    const [questions, setQuestions] = useState<Question[]>([
        {
            type: QuestionType.trueOrFalse,
            title: "Easy Question 1",
            points: 5,
            question: "T or F: The water is very poisonous.",
            true_or_false: false,
            choices: [],
            blank: []
        },
        {
            type: QuestionType.multipleChoice,
            title: "Easy Question 2",
            points: 6,
            question: "Who is the author of The Three-Body Problem?",
            choices: [
                { _id: "0", choice: "Isaac Asimov", correct: false },
                { _id: "1", choice: "Arthur C. Clarke", correct: false },
                { _id: "2", choice: "Cixin Liu", correct: true },
                { _id: "3", choice: "William Gibson", correct: false }
            ],
            blank: []
        },
        {
            type: QuestionType.fillInBlank,
            title: "Easy Question 3",
            points: 7,
            question: "In The Three-Body Problem, _____ proposed the Dark Forest principle.",
            blank: ["罗辑", "Luo Ji", "Luo"],
            choices: []
        }
    ]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [startTime, setStartTime] = useState<string>('');

    useEffect(() => {
        // 初始化答案数组
        const initialAnswers = questions.map((question) => ({
            type: question.type,
            score: 0,
            true_or_false: undefined,
            choice: -1,
            blank: "",
        }));
        setAnswers(initialAnswers);

        const now = new Date();
        const formattedTime = now.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
        setStartTime(formattedTime);

        // 开始计时器
        const timer = setInterval(() => {
            setTimeElapsed(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [questions]);

    if (!quiz) return <div>Loading...no such quiz</div>;
    if (!questions || questions.length === 0) return <div>Questions is [].</div>;

    // 检查 currentQuestionIndex 是否超出范围
    if (currentQuestionIndex >= questions.length) {
        setCurrentQuestionIndex(questions.length - 1);
        return null;
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return <div>Loading current question...</div>;

    const handleAnswerChange = (questionIndex: number, answer: Partial<Answer>) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = {
            ...newAnswers[questionIndex],
            ...answer
        };
        setAnswers(newAnswers);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleSubmitQuiz = async () => {
        const answerSet = {
            user: userId,
            quiz: qid,
            answers: answers,
            submit_time: new Date().toISOString(),
            time_used: timeElapsed,
        };
        console.log('Quiz submitted', answerSet);
    };

    // 计算分钟和秒数
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;

    return (
        <div className="container quiz-preview">
            <div className="row">
                <div className="col-md-8">
                    <h2 className="fw-bold my-3">{quiz.title}</h2>
                    <div className="alert alert-danger d-flex align-items-center">
                        <CgDanger className="me-3" style={{ fontSize: '1.5em' }} />
                        This is a preview of the published version of the quiz
                    </div>
                    <p>Started: {startTime}</p>
                    <h2 className='fw-bold my-2'>Quiz Instructions</h2>
                    {quiz.description && <p>{quiz.description}</p>}
                    <hr />
                    {questions.length > 0 && (
                      <div className="question card">
                        <div className="card-header d-flex justify-content-between">
                            <h4 className="fw-bold my-1">Question {currentQuestionIndex + 1}</h4>
                            <span className="fw-bold my-1">{currentQuestion.points} pts</span>
                        </div>
                        <div className="card-body">
                          <p>{currentQuestion.question}</p>
                          <hr className="mt-4 mb-2"/>
                          {/* 根据问题类型渲染输入框 */}
                          {currentQuestion.type === 'TRUE_OR_FALSE' && (
                              <div>
                                  <div className="form-check">
                                      <input
                                          className="form-check-input"
                                          type="radio"
                                          name={`trueOrFalse-${currentQuestionIndex}`}
                                          checked={answers[currentQuestionIndex]?.true_or_false === true}
                                          onChange={() => handleAnswerChange(currentQuestionIndex, { type: QuestionType.trueOrFalse, true_or_false: true })}
                                      />
                                      <label className="form-check-label">True</label>
                                  </div>
                                  <hr className="my-2"  />
                                  <div className="form-check">
                                      <input
                                          className="form-check-input"
                                          type="radio"
                                          name={`trueOrFalse-${currentQuestionIndex}`}
                                          checked={answers[currentQuestionIndex]?.true_or_false === false}
                                          onChange={() => handleAnswerChange(currentQuestionIndex, { type: QuestionType.trueOrFalse, true_or_false: false })}
                                      />
                                      <label className="form-check-label">False</label>
                                  </div>
                              </div>
                          )}
                          {currentQuestion.type === 'MULTIPLE_CHOICE' && (
                              <div>
                              {currentQuestion.choices?.map((choice: Choice, index: number) => (
                                  <React.Fragment key={index}>
                                      <div className="form-check">
                                          <input
                                              className="form-check-input"
                                              type="radio"
                                              name={`multipleChoice-${currentQuestionIndex}`}
                                              checked={answers[currentQuestionIndex]?.choice === index}
                                              onChange={() => handleAnswerChange(currentQuestionIndex, { type: QuestionType.multipleChoice, choice: index })}
                                          />
                                          <label className="form-check-label">{choice.choice}</label>
                                      </div>
                                      {currentQuestion.choices && index < currentQuestion.choices.length - 1 && <hr className="my-2" />}
                                  </React.Fragment>
                              ))}
                          </div>
                          
                          )}
                          {currentQuestion.type === 'FILL_IN_BLANK' && (
                            <input
                                className="form-control"
                                type="text"
                                value={answers[currentQuestionIndex]?.blank || ''}
                                onChange={(e) => handleAnswerChange(currentQuestionIndex, { type: QuestionType.fillInBlank, blank: e.target.value })}
                            />
                          )}
                        </div>
                      </div>
                    )}
                    <div className="navigation-buttons mt-3 d-flex justify-content-between">
                        {currentQuestionIndex > 0 && <button className="btn btn-secondary me-2 me-auto" onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>Previous</button>}
                        {currentQuestionIndex < questions.length - 1
                            ? <button className="btn btn-primary ms-auto" onClick={handleNextQuestion}>Next</button>
                            : <button className="btn btn-primary ms-auto" disabled>Next</button>
                        }
                    </div>
                    <div className="submit-section mt-3 p-2 border " style={{ height: '60px' }}>  
                        <button className="btn btn-secondary float-end" onClick={handleSubmitQuiz}>Submit Quiz</button>
                    </div>
                </div>
                <div className="col-md-4">
                    <Link
                        to={`/Kanbas/Courses/${cid}/Quizzes/${qid}/questions`}
                        className="btn btn-secondary text-decoration-none"
                    >
                        <span className='fw-bold'>
                            <RiPencilLine /> Keep Editing This Quiz
                        </span>
                    </Link>
                    <ul className="list-group mt-3">
                        {questions.map((q: Question, index: number) => (
                            <li className={`list-group-item ${currentQuestionIndex === index ? 'active' : ''}`} key={index}>
                                Question {index + 1}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3">Time Elapsed: </div>
                    <div className="mt-1">{minutes} Minutes, {seconds} Seconds</div>
                </div>
            </div>
        </div>
    );
}
