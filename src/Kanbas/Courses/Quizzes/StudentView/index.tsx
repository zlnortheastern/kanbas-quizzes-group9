import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Quiz } from "../interface";

export default function QuizStudent() {
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const { cid, qid } = useParams();
  const quiz = quizzes.find(
    (q: Quiz) => cid === q.course && qid === q._id
  ) as Quiz;

  return <h2>{quiz.title}</h2>;
}
