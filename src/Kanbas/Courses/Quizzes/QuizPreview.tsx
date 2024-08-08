import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Quiz, Question, Answer, Choice, QuestionType } from './interface'; // 引用已定义的接口
import * as client from "./client";
import { useAuth } from '../../Authentication/AuthProvider';
export default function QuizPreview() {
    const { qid } = useParams<{ qid: string }>();
    const { user } = useAuth();
    const userId = user?._id;
    if(userId){
        console.log("userId: " + userId);
    } else {
        console.log("userId not existed: " + userId);
    }

    
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const fetchQuiz = async () => {
      if (qid) {
        const quizData = await client.getQuizById(qid);
        setQuiz(quizData);
      }
    };

    const fetchQuestions = async () => {
      if (qid) {
        const questionsData = await client.getQuestionsByQuizId(qid);
        setQuestions(questionsData.questions);
        const initialAnswers = questionsData.questions.map((question: Question) => ({
          type: question.type,
          score: 0,
          true_or_false: undefined,
          choice: -1,
          blank: "",
        }));
        setAnswers(initialAnswers);
      }
    };
    useEffect(() => {
        if (!qid || !userId) {
            console.error('Quiz ID or User ID is undefined');
            return;
        }

        fetchQuiz();
        fetchQuestions();
      
        const timer = setInterval(() => {
            setTimeElapsed(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [qid, userId]);

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
        if (!qid || !userId) {
            console.error('Quiz ID or User ID is undefined');
            return;
        }
        const answerSet = {
            user: userId,
            quiz: qid,
            answers: answers,
            submit_time: new Date().toISOString(),
            time_used: timeElapsed,
        };
        try {
            await client.submitQuizAnswers(qid, userId, answerSet);
            console.log('Quiz submitted');
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    return (
        <div className="container quiz-preview">
            <div className="row">
                <div className="col-md-8">
                    <h2>{quiz.title}</h2>
                    <div className="alert alert-danger">This is a preview of the published version of the quiz</div>
                    <p>Started: Jul 26 at 11:14pm</p>
                    <h5>Quiz Instructions</h5>
                    {quiz.description && <p>{quiz.description}</p>}
                    <br />
                    {questions.length > 0 && (
                      <div className="question">
                        <h3>Question {currentQuestionIndex + 1}</h3>
                        <p>{currentQuestion.question}</p>
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
                                    <div className="form-check" key={index}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name={`multipleChoice-${currentQuestionIndex}`}
                                            checked={answers[currentQuestionIndex]?.choice === index}
                                            onChange={() => handleAnswerChange(currentQuestionIndex, { type: QuestionType.multipleChoice, choice: index })}
                                        />
                                        <label className="form-check-label">{choice.choice}</label>
                                    </div>
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
                    )}
                    <div className="navigation-buttons mt-3">
                        {currentQuestionIndex > 0 && <button className="btn btn-secondary me-2" onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>Previous</button>}
                        {currentQuestionIndex < questions.length - 1 && <button className="btn btn-primary" onClick={handleNextQuestion}>Next</button>}
                        {currentQuestionIndex === questions.length - 1 && <button className="btn btn-success" onClick={handleSubmitQuiz}>Submit Quiz</button>}
                    </div>
                </div>
                <div className="col-md-4">
                    <button className="btn btn-outline-secondary" onClick={() => window.location.href = `/quiz-editor/${qid}`}>Keep Editing This Quiz</button>
                    <ul className="list-group mt-3">
                        {questions.map((q: Question, index: number) => (
                            <li className={`list-group-item ${currentQuestionIndex === index ? 'active' : ''}`} key={index}>
                                Question {index + 1}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3">Time Elapsed: {timeElapsed} seconds</div>
                </div>
            </div>
        </div>
    );
}


