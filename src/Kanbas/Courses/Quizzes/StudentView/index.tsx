import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Answers, Questions, Quiz, ShowAnswerType } from "../interface";
import * as client from "../client";
import { formatDate, formatTime, getHighestScore } from "../../../util";
import { useAuth } from "../../../Authentication/AuthProvider";
import QuizStudentControls from "./QuizStudentControls";
import StudentAnswerView from "./StudentAnswerView";
import { Link } from "react-router-dom";
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
      answers.sort(
        (a: Answers, b: Answers) =>
          +new Date(b.submit_time) - +new Date(a.submit_time)
      );
      setAnswers(answers);
    }
  };

  useEffect(() => {
    fetchQuiz();
    fetchQuestions();
    fetchAnswers();
  }, []);

  const questionSet = questions?.questions;
  const availableTime = new Date(quiz?.availableDate as string);
  const untilTime = new Date(quiz?.availableUntilDate as string);
  const dueDateTime = new Date(quiz?.dueDate as string);
  const currentTime = new Date();

  if (!quiz && !questions) return <></>;
  return (
    <div className="row">
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
        {answers && questions && answers.length > 0 && (
          <StudentAnswerView
            answers={answers}
            questions={questions}
            showQuestions={quiz?.showCorrectAnswers !== ShowAnswerType.never}
            showAnswers={
              quiz?.showCorrectAnswers !== ShowAnswerType.after_due_date &&
              currentTime > dueDateTime
            }
          />
        )}
      </div>

      {answers && answers.length > 0 && (
        <div className="col-3">
          <div className="ms-4">
            <div className="fw-bold">Last Attempt Details:</div>
            <table className="table">
              <tbody>
                <tr>
                  <th>Time:</th>
                  <td>{formatTime(answers[0].time_used)}</td>
                </tr>
                <tr>
                  <th>Current Score:</th>
                  <td>{`${answers[0].score} out of ${answers[0].total}`}</td>
                </tr>
                <tr>
                  <th>Kept Score:</th>
                  <td>{`${getHighestScore(answers)} out of ${
                    answers[0].total
                  }`}</td>
                </tr>
              </tbody>
            </table>
            <div className="mb-2 ms-4 font-color-secondary">
              {(quiz?.attemptLimit as number) - answers.length} attempts left
            </div>
            {(quiz?.attemptLimit as number) > answers.length && (
              <div>
                <Link
                  to={`../Quizzes/${qid}/preview`}
                  className="text-decoration-none text-danger"
                >
                  Take the Quiz Again
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
