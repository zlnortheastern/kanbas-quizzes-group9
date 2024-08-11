// QuizContextMenu.tsx

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { deleteQuiz, togglePublishQuiz } from "./reducer";
import * as client from "./client";
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../Modules/GreenCheckmark";

interface QuizContextMenuProps {
  quizId: string;
}

const QuizContextMenu = ({ quizId }: QuizContextMenuProps) => {
  const { cid } = useParams<{ cid: string }>();
  const dispatch = useDispatch();
  const [quiz, setQuiz] = useState<any>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const fetchedQuiz = await client.getQuizById(quizId);
      setQuiz(fetchedQuiz);
    };

    fetchQuiz();
  }, [quizId]);

  const handleDelete = async () => {
    await client.deleteQuiz(quizId);
    dispatch(deleteQuiz(quizId));
  };

  const handleTogglePublish = async () => {
    if (quiz) {
      quiz.published = !quiz.published;
      await client.updateQuiz(quiz);
      dispatch(togglePublishQuiz(quizId));
    }
  };

  return (
    <div className="ms-auto position-relative">
      {quiz && (
        <>
          <span className="p-3" onClick={handleTogglePublish}>
            {quiz.published ? <GreenCheckmark /> : "🚫"}
          </span>

          <div className="dropdown d-inline me-1 float-end">
            <button
              id="wd-publish-all-btn"
              className="btn p-0 mb-1 btn-transparent"
              type="button"
              data-bs-toggle="dropdown"
            >
              <IoEllipsisVertical className="fs-4 context-menu-button" />
            </button>
            <ul className="dropdown-menu">
              <li>
                <Link
                  to={`/Kanbas/Courses/${cid}/Quizzes/${quizId}/edit`}
                  className="text-decoration-none dropdown-item"
                >
                  <FaEdit /> Edit
                </Link>
              </li>
              <li onClick={handleDelete}>
                <button className="dropdown-item">
                  <FaTrash /> Delete
                </button>
              </li>
              <li onClick={handleTogglePublish}>
                <button className="dropdown-item">
                  <FaCheck /> {quiz.published ? "Unpublish" : "Publish"}
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizContextMenu;
