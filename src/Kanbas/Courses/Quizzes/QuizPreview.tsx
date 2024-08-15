import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Quiz,
  Question,
  Answer,
  Choice,
  QuestionType,
  Answers,
} from "./interface";
import * as client from "./client";
import { useAuth, useUserRole } from "../../Authentication/AuthProvider";
import { CgDanger } from "react-icons/cg";
import { RiPencilLine } from "react-icons/ri";
import { FaCaretLeft, FaCaretRight, FaCheck } from "react-icons/fa6";
import { LiaQuestionCircle } from "react-icons/lia";
import { formatDate, formatTime } from "../../util";

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const auth = useAuth();
  const userId = auth.token;
  const role = useUserRole();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [answerId, setAnswerId] = useState<string>();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime, setStartTime] = useState<string>("");
  const [isHidden, setIsHidden] = useState(false);
  const [allAnswered, setAllAnswered] = useState(false);

  const toggleVisibility = () => {
    setIsHidden(!isHidden);
  };

  const now = new Date();
  const formattedTime = formatDate(now.toISOString());

  const isQuestionAnswered = (answer: Answer) => {
    if (!answer || !answer.type) {
      // console.warn('Answer is undefined or missing type:', answer); // Debug log
      return false;
    }
    if (answer.type === QuestionType.trueOrFalse) {
      return answer.true_or_false !== undefined;
    }
    if (answer.type === QuestionType.multipleChoice) {
      return answer.choice !== -1;
    }
    if (answer.type === QuestionType.fillInBlank) {
      return answer.blank !== "";
    }
    return false;
  };
  const fetchQuiz = async () => {
    if (qid) {
      const quizData = await client.getQuizById(qid);
      setQuiz(quizData);
    }
  };

  const fetchQuestions = async () => {
    if (qid) {
      try {
        const questionsData = await client.getQuestionsByQuiz(qid);
        setQuestions(questionsData.questions);
        fetchAnswers();
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          console.error("Questions not found");
          setQuestions([]);
        } else {
          console.error("An error occurred while fetching questions:", error);
        }
      }
    }
  };

  const initializeAnswers = (questions: Question[]): Answer[] => {
    return questions.map((question: Question) => ({
      type: question.type,
      score: 0,
      true_or_false: undefined,
      choice: -1,
      blank: "",
    }));
  };

  // Fetch answers based on the user's role
  const fetchAnswers = async () => {
    if (qid) {
      if (role === "FACULTY") {
        const latestAnswer = await client.getLatestAnswerByUser(qid, userId);
        // console.log('Latest answers fetched for faculty in PREVIEW page:', latestAnswer);
        if (latestAnswer) {
          if (
            latestAnswer.answers.length > 0 &&
            latestAnswer.answers.every(isQuestionAnswered)
          )
            setAllAnswered(true);
          // console.log('Latest answers fetched for faculty:', latestAnswer);
          setAnswers(latestAnswer.answers);
          setAnswerId(latestAnswer._id);
        } else {
          const initializedAnswers = initializeAnswers(questions);
          setAnswers(initializedAnswers);
        }
      } else if (role === "STUDENT") {
        const initializedAnswers = initializeAnswers(questions);
        setAnswers(initializedAnswers);
      }
    }
  };

  useEffect(() => {
    if (!qid || !userId) {
      console.error("Quiz ID or User ID is undefined");
      return;
    }

    fetchQuiz();
    fetchQuestions();
    setStartTime(formattedTime);
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [qid, userId, role]);

  if (!quiz) return <div>Loading...no such quiz</div>;
  if (!questions || questions.length === 0)
    return <div>Question set for this quiz is empty.</div>;

  if (currentQuestionIndex >= questions.length) {
    setCurrentQuestionIndex(questions.length - 1);
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return <div>Loading current question...</div>;

  const handleAnswerChange = (
    questionIndex: number,
    answer: Partial<Answer>
  ) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = {
      ...newAnswers[questionIndex],
      ...answer,
    };
    setAnswers(newAnswers);
    if (answers.length > 0 && newAnswers.every(isQuestionAnswered))
      setAllAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!qid || !userId) {
      console.error("Quiz ID or User ID is undefined");
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
      if (role === "STUDENT") {
        await client.submitQuizAnswers(qid, userId, answerSet);
      } else if (!answerId) {
        await client.submitQuizAnswers(qid, userId, answerSet);
      } else {
        await client.saveQuizAnswers(answerId, answerSet);
      }
      // console.log('Quiz submitted');
      navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;

  return (
    <div className="container quiz-preview">
      <div className="row">
        <div className="col-md-8">
          <h2 className="fw-bold my-3">{quiz.title}</h2>

          {role === "FACULTY" && (
            <div className="alert alert-danger d-flex align-items-center">
              <CgDanger className="me-3" style={{ fontSize: "1.5em" }} />
              This is a preview of the published version of the quiz
            </div>
          )}
          <p>Started: {startTime}</p>
          <h2 className="fw-bold my-2">Quiz Instructions</h2>
          {quiz.description && <p>{quiz.description}</p>}
          <hr />
          {questions.length > 0 && (
            <div className="question card">
              <div
                className="card-header d-flex justify-content-between"
                style={{ backgroundColor: "#f5f5f5" }}
              >
                <div className="fw-bold my-1">
                  Question {currentQuestionIndex + 1}
                </div>
                <div className="my-1 font-color-secondary">
                  {currentQuestion.points} pts
                </div>
              </div>
              <div className="card-body">
                <p>{currentQuestion.question}</p>

                {currentQuestion.type === "TRUE_OR_FALSE" && (
                  <div>
                    <div className="form-check border-top py-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`trueOrFalse-${currentQuestionIndex}`}
                        id={`true-${currentQuestionIndex}`}
                        checked={
                          answers[currentQuestionIndex]?.true_or_false === true
                        }
                        onChange={() =>
                          handleAnswerChange(currentQuestionIndex, {
                            type: QuestionType.trueOrFalse,
                            true_or_false: true,
                          })
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`true-${currentQuestionIndex}`}
                      >
                        True
                      </label>
                    </div>
                    <div className="form-check border-top py-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`trueOrFalse-${currentQuestionIndex}`}
                        id={`false-${currentQuestionIndex}`}
                        checked={
                          answers[currentQuestionIndex]?.true_or_false === false
                        }
                        onChange={() =>
                          handleAnswerChange(currentQuestionIndex, {
                            type: QuestionType.trueOrFalse,
                            true_or_false: false,
                          })
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`false-${currentQuestionIndex}`}
                      >
                        False
                      </label>
                    </div>
                  </div>
                )}
                {currentQuestion.type === "MULTIPLE_CHOICE" && (
                  <div>
                    {currentQuestion.choices?.map(
                      (choice: Choice, index: number) => (
                        <div
                          key={index}
                          className={`form-check ${
                            index == 0
                              ? "border-top mt-4 py-2"
                              : "border-top py-2"
                          }`}
                        >
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`multipleChoice-${currentQuestionIndex}`}
                            id={`multipleChoice-${currentQuestionIndex}-${index}`}
                            checked={
                              answers[currentQuestionIndex]?.choice === index
                            }
                            onChange={() =>
                              handleAnswerChange(currentQuestionIndex, {
                                type: QuestionType.multipleChoice,
                                choice: index,
                              })
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`multipleChoice-${currentQuestionIndex}-${index}`}
                          >
                            {choice.choice}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                )}
                {currentQuestion.type === "FILL_IN_BLANK" && (
                  <input
                    className="form-control"
                    type="text"
                    value={answers[currentQuestionIndex]?.blank || ""}
                    onChange={(e) =>
                      handleAnswerChange(currentQuestionIndex, {
                        type: QuestionType.fillInBlank,
                        blank: e.target.value,
                      })
                    }
                  />
                )}
              </div>
            </div>
          )}
          <div className="navigation-buttons mt-3 d-flex justify-content-between">
            {currentQuestionIndex > 0 && (
              <button
                className="btn me-2 me-auto border"
                style={{ backgroundColor: "#f5f5f5", fontSize: "0.8rem" }}
                onClick={() =>
                  setCurrentQuestionIndex(currentQuestionIndex - 1)
                }
              >
                <FaCaretLeft /> Previous
              </button>
            )}
            <button
              className="btn btn-primary ms-auto "
              onClick={handleNextQuestion}
              style={{ fontSize: "0.8rem" }}
              disabled={currentQuestionIndex >= questions.length - 1}
            >
              Next <FaCaretRight />
            </button>
          </div>
          <button
            className="btn float-end border fw-bold mt-4"
            style={{ backgroundColor: "#f5f5f5", fontSize: "0.8rem" }}
            disabled={!allAnswered}
            onClick={handleSubmitQuiz}
          >
            Submit Quiz
          </button>
        </div>
        <div className="col-md-4">
          {role === "FACULTY" && (
            <button className="btn btn-secondary text-decoration-none" disabled>
              <span className="fw-bold">
                <RiPencilLine className="me-2" /> Keep Editing This Quiz
              </span>
            </button>
          )}
          <div className="question-list-group mt-5">
            <h4>Questions</h4>
            <ul className=" mt-3">
              {questions.map((q: Question, index: number) => (
                <li
                  className={`list-group-item ${
                    currentQuestionIndex === index ? "active fw-bold" : ""
                  }`}
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  style={{ cursor: "pointer" }}
                >
                  {isQuestionAnswered(answers[index]) ? (
                    <FaCheck className="me-2 text-secondary" />
                  ) : (
                    <LiaQuestionCircle className="me-2 text-secondary" />
                  )}
                  <span style={{ color: "#0374B5" }}>Question {index + 1}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-3">
            Time Elapsed:
            <span
              className="ms-2 fs-7"
              style={{
                color: "#0374B5",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
              onClick={toggleVisibility}
            >
              {isHidden ? "Show" : "Hide"}
            </span>
          </div>
          {!isHidden && (
            <div className="mt-1">
              {minutes} Minutes, {seconds} Seconds
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
