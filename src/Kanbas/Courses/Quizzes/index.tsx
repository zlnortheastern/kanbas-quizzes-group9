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

export default function Quizzes({ role }: { role: string }) {
  const { cid } = useParams();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [questionCounts, setQuestionCounts] = useState<{ [key: string]: number }>({});

  const fetchQuizzes = async () => {
    const quizzes = await client.findQuizzesForCourse(cid as string);
    if (role === "FACULTY") {
      dispatch(setQuizzes(quizzes));
    } else {
      dispatch(setQuizzes(quizzes.filter((q: any) => q.published)));
    }

    const counts: { [key: string]: number } = {};
    for (let quiz of quizzes) {
      const questionSet = await client.getQuestionsByQuiz(quiz._id);
      counts[quiz._id] = questionSet.questions ? questionSet.questions.length : -1;
    }
    setQuestionCounts(counts);
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
                       {questionCounts[q._id] || 0} Questions
                    </p>
                  </div>
                  <div className="ms-auto position-relative">
                    {role === "FACULTY" && (
                      <QuizContextMenu quizId={q._id} />
                    )}                  
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </li>
    </div>
  );
}
