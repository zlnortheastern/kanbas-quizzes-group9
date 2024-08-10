import { RxRocket } from "react-icons/rx";
import QuizzesControls from "./QuizzesControls";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { deleteQuiz, setQuizzes, togglePublishQuiz } from "./reducer";
import * as client from "./client";
import QuizContextMenu from "./QuizContextMenu";
import { useUserRole } from "../../Authentication/AuthProvider";
import { formatDate } from "../../util";
import { Answers } from "./interface";
import { useAuth } from "../../Authentication/AuthProvider";

export default function Quizzes({ role }: { role: string }) {
  const { cid } = useParams();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [quizData, setQuizData] = useState<{
    [key: string]: {
      questionCount: number;
      score?: number | null;
      total?: number | null;
    };
  }>({});

  const auth = useAuth();
  const userId = auth.token;

  const fetchQuizzes = async () => {
    const quizzes = await client.findQuizzesForCourse(cid as string);
    const quizData: {
      [key: string]: {
        questionCount: number;
        score?: number | null;
        total?: number | null;
      };
    } = {};

    if (role === "FACULTY") {
      // FACULTY: 只获取 questionCount，不需要 fetch score 和 total
      for (let quiz of quizzes) {
        const questionSet = await client.getQuestionsByQuiz(quiz._id);
        quizData[quiz._id] = {
          questionCount: questionSet.questions
            ? questionSet.questions.length
            : -1,
        };
      }
      dispatch(setQuizzes(quizzes));
    } else if (role === "STUDENT") {
      // STUDENT: 只展示 published 的 quizzes，同时获取 questionCount、score 和 total
      const publishedQuizzes = quizzes.filter((q: any) => q.published);

      for (let quiz of publishedQuizzes) {
        const questionSet = await client.getQuestionsByQuiz(quiz._id);
        const questionCount = questionSet.questions
          ? questionSet.questions.length
          : -1;

        let score = null;
        let total = null;

        if (questionCount !== -1) {
          const result = await getLatestAnswerScoreAndTotal(quiz._id, userId);
          if (result) {
            score = result.score;
            total = result.total;
          } else {
            score = -1;
            total = -1;
          }
        }

        quizData[quiz._id] = {
          questionCount,
          score,
          total,
        };
      }

      dispatch(setQuizzes(publishedQuizzes));
    }

    // 保存 quizData
    setQuizData(quizData);
  };

  // Function to get the latest answer score and total
  const getLatestAnswerScoreAndTotal = async (qid: string, userId: string) => {
    if (!qid || !userId) {
      console.error("Quiz ID or User ID is undefined");
      return null;
    }

    try {
      const answers = await client.getAnswersByUser(qid, userId);

      if (answers && answers.length > 0) {
        answers.sort(
          (a: Answers, b: Answers) =>
            +new Date(b.submit_time) - +new Date(a.submit_time)
        );

        const newestAnswer = answers[0];
        const score = newestAnswer.score;
        const total = newestAnswer.total;

        return { score, total };
      } else {
        console.log("No answers found for this quiz.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching answers:", error);
      return null;
    }
  };

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getAvailability = (quiz: any) => {
    const currentDate = new Date();
    const availableDate = new Date(quiz.availableDate);
    const dueDate = new Date(quiz.dueDate);
    const availableUntilDate = new Date(quiz.availableUntilDate);
    if (currentDate > availableUntilDate) {
      return "Closed";
    } else if (
      currentDate >= availableDate &&
      currentDate <= availableUntilDate
    ) {
      return "Available";
    } else if (currentDate < availableDate) {
      return `Not available until ${formatDate(quiz.availableDate)}`;
    } else {
      return "Closed";
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  if (Object.keys(quizData).length < 1) return <div>Loading...</div>;
  return (
    <div id="wd-quizzes">
      <QuizzesControls userRole={role} />
      <br />
      <br />
      <li className="wd-quizzes list-group-item p-0 mb-5 fs-5 border-gray">
        <div
          className="wd-quizzes-title p-3 ps-2 bg-secondary dropdown-toggle"
          onClick={handleToggle}
          aria-expanded={!isCollapsed}
        >
          <span className="fw-bold ps-3">Assignment Quizzes</span>
        </div>
        <div className={`collapse ${!isCollapsed ? "show" : ""}`}>
          <ul
            id="wd-quiz-list"
            className="wd-quiz-list list-group rounded-0"
            style={{ borderLeft: "4px solid green" }}
          >
            {quizzes
              .filter((q: any) => q.course === cid)
              .map((q: any) => (
                <li
                  className="wd-quiz-item list-group-item d-flex align-items-center p-3 ps-1"
                  key={q._id}
                >
                  <RxRocket className="m-4 fs-5 text-success" />
                  <div>
                    <Link
                      to={`/Kanbas/Courses/${cid}/Quizzes/${q._id}`}
                      className="wd-quiz-link fs-5 fw-bold text-decoration-none text-dark"
                    >
                      {q.title}
                    </Link>
                    <p className="mb-0 text-muted fs-6">
                      <b>{getAvailability(q)}</b> | <b>Due</b>{" "}
                      {formatDate(q.dueDate)} | {q.points} pts |{" "}
                      {quizData[q._id]?.questionCount || 0} Questions
                      {role === "STUDENT" &&
                        quizData[q._id]?.score !== -1 &&
                        quizData[q._id]?.total !== -1 && (
                          <>
                            {" "}
                            | <span>Score: </span>
                            {quizData[q._id]?.score} / {quizData[q._id]?.total}
                          </>
                        )}
                    </p>
                  </div>
                  <div className="ms-auto position-relative">
                    {role === "FACULTY" && <QuizContextMenu quizId={q._id} />}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </li>
    </div>
  );
}
