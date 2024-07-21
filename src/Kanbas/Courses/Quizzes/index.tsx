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

export default function Quizzes() {
  const { cid } = useParams();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ isOpen: boolean, quizId: string | null }>({ isOpen: false, quizId: null });

  const handleContextMenuClick = (quizId: string) => {
    setContextMenu((prev) => ({
      isOpen: prev.quizId !== quizId || !prev.isOpen,
      quizId,
    }));
  };

  const handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as Element;
    if (contextMenu.isOpen && !target.closest('.context-menu') && !target.closest('.context-menu-button')) {
      setContextMenu({ isOpen: false, quizId: null });
    }
  };

  const fetchQuizzes = async () => {
    const quizzes = await client.findQuizzesForCourse(cid as string);
    dispatch(setQuizzes(quizzes));
  };

  const removeQuiz = async (quizId: string) => {
    await client.deleteQuiz(quizId);
    dispatch(deleteQuiz(quizId));
  };

  const publishQuiz = async (quizId: string) => {
    const quiz = quizzes.find((q: any) => q._id === quizId);
    quiz.published = !quiz.published;
    await client.updateQuiz(quiz);
    dispatch(togglePublishQuiz(quizId));
  };

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;

    return `${month} ${day} at ${hours}:${minutesStr}${ampm}`;
  };

  const getAvailability = (quiz: any) => {
    const currentDate = new Date();
    const availableDate = new Date(quiz.availableDate);
    const dueDate = new Date(quiz.dueDate);
    const availableUntilDate = new Date(quiz.availableUntilDate);

    if (currentDate > availableUntilDate) {
      return "Closed";
    } else if (currentDate >= availableDate && currentDate <= availableUntilDate) {
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

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [contextMenu]);

  return (
    <div id="wd-quizzes">
      <QuizzesControls />
      <br />
      <br />
      <li className="wd-quizzes list-group-item p-0 mb-5 fs-5 border-gray">
        <div className="wd-quizzes-title p-3 ps-2 bg-secondary dropdown-toggle"
          onClick={handleToggle} aria-expanded={!isCollapsed}>
          <span className="fw-bold ps-3">Assignment Quizzes</span>
        </div>
        <div className={`collapse ${!isCollapsed ? 'show' : ''}`}>
          <ul id="wd-quiz-list" className="wd-quiz-list list-group rounded-0" style={{ borderLeft: '4px solid green' }}>
            {quizzes
              .filter((q: any) => q.course === cid)
              .map((q: any) => (
                <li className="wd-quiz-item list-group-item d-flex align-items-center p-3 ps-1" key={q._id}>
                  <RxRocket className="m-4 fs-5 text-success" />
                  <div>
                    <Link
                      to={`/Kanbas/Courses/${cid}/Quizzes/${q._id}`}
                      className="wd-quiz-link fs-5 fw-bold text-decoration-none text-dark"
                    >
                      {q.title}
                    </Link>
                    <p className="mb-0 text-muted fs-6">
                      <b>{getAvailability(q)}</b> | <b>Due</b> {formatDate(q.dueDate)} | {q.points} pts | ??? Questions
                    </p>
                  </div>
                  <div className="ms-auto position-relative">
                    <span className="p-3">
                      {q.published ? (
                        <span><GreenCheckmark /></span>
                      ) : (
                        <span>🚫</span>
                      )}
                    </span>
                    <IoEllipsisVertical
                      className="fs-4 context-menu-button"
                      onClick={() => handleContextMenuClick(q._id)}
                    />
                    {contextMenu.isOpen && contextMenu.quizId === q._id && (
                      <QuizContextMenu
                        quizId={q._id}
                        onClose={() => setContextMenu({ isOpen: false, quizId: null })}
                      />
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
