import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { deleteQuiz, togglePublishQuiz } from './reducer';
import * as client from './client';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';

interface QuizContextMenuProps {
  quizId: string;
  onClose: () => void;
}

const QuizContextMenu = ({ quizId, onClose }: QuizContextMenuProps) => {
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
    onClose();
  };

  const handleTogglePublish = async () => {
    if (quiz) {
      quiz.published = !quiz.published;
      await client.updateQuiz(quiz);
      dispatch(togglePublishQuiz(quizId));
      onClose();
    }
  };

  return (
    <div className="context-menu">
      <ul className="list-group">
        <li className="list-group-item">
          <Link to={`/Kanbas/Courses/${cid}/Quizzes/${quizId}/edit`} className="text-decoration-none">
            <FaEdit /> Edit
          </Link>
        </li>
        <li className="list-group-item" onClick={handleDelete}>
          <FaTrash /> Delete
        </li>
        <li className="list-group-item" onClick={handleTogglePublish}>
          <FaCheck /> {quiz && quiz.published ? 'Unpublish' : 'Publish'}
        </li>
      </ul>
    </div>
  );
};

export default QuizContextMenu;
