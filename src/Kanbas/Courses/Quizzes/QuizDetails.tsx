import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getQuizById } from "./client";
import { setQuizzes } from "./reducer";
import { FaPencil } from "react-icons/fa6";
import * as client from "./client";
import AnswerHistory from "./StudentView/AnswerHistory";
import {
  Quiz,
  Question,
  Answer,
  Choice,
  QuestionType,
  Answers,
} from "./interface";
import { useAuth, useUserRole } from "../../Authentication/AuthProvider";

export default function QuizDetails() {
  const navigate = useNavigate();
  const { cid, qid } = useParams();
  const auth = useAuth();
  const userId = auth.token;
  const role = useUserRole();
  const dispatch = useDispatch();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answer, setAnswer] = useState<Answers>();

  const quiz = useSelector((state: any) =>
    state.quizzesReducer.quizzes.find((q: any) => q._id === qid)
  );
  
  useEffect(() => {
    const fetchQuestionsAndAnswers = async () => {
      if (qid) {
        try {
          const questionsData = await client.getQuestionsByQuiz(qid);
          setQuestions(questionsData.questions);
          fetchAnswer();
        } catch (error: any) {
          if (error.response && error.response.status === 404) {
            console.error("questions not found");
            setQuestions([]);
          } else {
            console.error("Failed to fetch questions:", error);
          }
        }
      }
    };

    const fetchAnswer = async () => {
      if (qid && role === "FACULTY") {
        const latestAnswer = await client.getLatestAnswerByUser(qid, userId);
        // console.log('Latest answers fetched for faculty in QUIZ DETAILS page:', latestAnswer);

        setAnswer(latestAnswer || null);
      }
    };

    fetchQuestionsAndAnswers();
  }, [qid, role, userId]);

  const handlePreviewClick = async () => {
    if (!qid || !userId) {
      console.error("Quiz ID or User ID is undefined");
      return;
    }
    navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/preview`);
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuizById(qid as string);
        dispatch(setQuizzes([data]));
      } catch (error) {
        console.error("Failed to fetch quiz", error);
      }
    };

    fetchQuiz();
  }, [qid, dispatch]);

  if (!quiz) {
    return <div>Loading...</div>;
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDate = date.toLocaleString("en-US", options);
    return formattedDate
      .replace(",", " at")
      .replace(":00 ", "")
      .replace("AM", "am")
      .replace("PM", "pm");
  };
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center mb-4">
        <button
          onClick={handlePreviewClick}
          className="btn btn-secondary me-2"
          id="wd-quiz-preview-btn"
        >
          Preview
        </button>
        <Link to={`edit`} className="btn btn-secondary" id="wd-quiz-edit-btn">
          <FaPencil
            className="position-relative me-2"
            style={{ transform: "rotate(270deg)", bottom: "2px" }}
          />
          Edit
        </Link>
      </div>
      <hr />
      <h1 className="text-start pe-3 mt-2">{quiz.title}</h1>
      <div>
        <ul className="row">
          {[
            { label: "Quiz Type", value: quiz.quizType },
            { label: "Points", value: quiz.points },
            { label: "Assignment Group", value: quiz.assignmentGroup },
            {
              label: "Shuffle Answers",
              value: quiz.shuffleAnswers ? "Yes" : "No",
            },
            { label: "Time Limit", value: `${quiz.timeLimit} Minutes` },
            {
              label: "Multiple Attempts",
              value: quiz.multipleAttempts ? "Yes" : "No",
            },
            { label: "Attempt Limit", value: quiz.attemptLimit },
            { label: "Show Correct Answers", value: quiz.showCorrectAnswers },
            { label: "Access Code", value: quiz.accessCode || "None" },
            {
              label: "One Question at a Time",
              value: quiz.oneQuestionAtATime ? "Yes" : "No",
            },
            {
              label: "Webcam Required",
              value: quiz.webcamRequired ? "Yes" : "No",
            },
            {
              label: "Lock Questions After Answering",
              value: quiz.lockQuestionsAfterAnswering ? "Yes" : "No",
            },
          ].map((item, index) => (
            <li
              key={index}
              className="col-12 d-flex justify-content-start py-2"
            >
              <span className="col-3 fw-bold text-end pe-3">{item.label} </span>
              <span className="col-9 text-start">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
      <table className="table mt-4 pe-4 mb-4">
        <thead>
          <tr>
            <th>Due</th>
            <th>For</th>
            <th>Available from</th>
            <th>Until</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formatDate(new Date(quiz.dueDate).toLocaleString())}</td>
            <td>Everyone</td>
            <td>{formatDate(new Date(quiz.availableDate).toLocaleString())}</td>
            <td>
              {formatDate(new Date(quiz.availableUntilDate).toLocaleString())}
            </td>
          </tr>
        </tbody>
      </table>
      {answer && (
        <AnswerHistory
          answer={answer}
          questions={questions}
          showCorrect={true}
        />
      )}
    </div>
  );
}
