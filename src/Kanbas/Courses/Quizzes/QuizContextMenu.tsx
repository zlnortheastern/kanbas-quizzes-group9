import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { deleteQuiz, togglePublishQuiz } from "./reducer";
import * as client from "./client";
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";

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
            <FaCheck /> {quiz && quiz.published ? "Unpublish" : "Publish"}
          </button>
        </li>
      </ul>
  );
};

export default QuizContextMenu;
