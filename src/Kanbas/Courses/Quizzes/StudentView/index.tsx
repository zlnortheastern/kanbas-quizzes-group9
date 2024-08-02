import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Answers, Questions, Quiz } from "../interface";
import * as client from "../client";
import { formatDate } from "../../../util";
import { useAuth } from "../../../Authentication/AuthProvider";
import QuizStudentControls from "./QuizStudentControls";
import StudentAnswerView from "./StudentAnswerView";
export default function QuizStudent() {
  const [questions, setQuestions] = useState<Questions>();
  const [answers, setAnswers] = useState<Answers[]>();
  const [quiz, setQuiz] = useState<Quiz>();
  const { cid, qid } = useParams();
  const auth = useAuth();

  const fetchQuiz = async () => {
    const data = qid ? await client.getQuizById(qid) : {};
    setQuiz(data);
  };
  const fetchQuestions = async () => {
    const questionSet = qid ? await client.getQuestionsByQuiz(qid) : {};
    setQuestions(questionSet);
  };

  const fetchAnswers = async () => {
    const answers = qid ? await client.getAnswersByUser(qid, auth.token) : [];
    if (answers) {
      answers.sort((a: Answers, b: Answers) => {
        const subTimeA = new Date(a.submit_time);
        const subTimeB = new Date(b.submit_time);
        return subTimeA.getTime() - subTimeB.getTime();
      });
    }
    setAnswers(answers);
  };

  useEffect(() => {
    fetchQuiz();
    fetchQuestions();
    fetchAnswers();
  }, []);

  const questionSet = questions?.questions;
  const availableTime = new Date(quiz?.availableDate as string);
  const untilTime = new Date(quiz?.availableUntilDate as string);
  const currentTime = new Date();

  if (!quiz && !questions) return <></>;
  return (
    <div className="row-fluid">
      <div className="col-9">
        <h2>{quiz?.title}</h2>
        <hr />
        <ul className="p-0">
          <li className="d-inline-block me-5 mb-2">
            <span className="fw-bold">Due</span>{" "}
            {formatDate(quiz?.dueDate as string)}
          </li>
          <li className="d-inline-block me-5 mb-2">
            <span className="fw-bold">Points</span> {quiz?.points}
          </li>
          <li className="d-inline-block me-5 mb-2">
            <span className="fw-bold">Questions</span> {questionSet?.length}
          </li>
          <li className="d-inline-block me-5 mb-2">
            <span className="fw-bold">Available</span>{" "}
            {formatDate(quiz?.availableDate as string)} -{" "}
            {formatDate(quiz?.availableUntilDate as string)}
          </li>
          <li className="d-inline-block me-5 mb-2">
            <span className="fw-bold">Time Limit</span> {quiz?.timeLimit}{" "}
            Minutes
          </li>
          <li className="d-inline-block me-5 mb-2">
            <span className="fw-bold">Allowed Attempts</span>{" "}
            {quiz?.attemptLimit}
          </li>
        </ul>
        <hr />
        <QuizStudentControls
          availableTime={availableTime}
          currentTime={currentTime}
          untilTime={untilTime}
          quiz={quiz}
          answered={!!answers && answers.length > 0}
          canAnswer={!!quiz && !!answers && answers.length < quiz.attemptLimit}
        />
        {answers && <StudentAnswerView answers={answers}/>}
      </div>
    </div>
  );
}
