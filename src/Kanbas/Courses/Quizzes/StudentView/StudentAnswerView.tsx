import React from "react";
import { Answers, Questions } from "../interface";
import { formatTime } from "../../../util";
import { Link } from "react-router-dom";
import AnswerHistory from "./AnswerHistory";

export default function StudentAnswerView({
  answers,
  questions,
  showQuestions,
  showAnswers,
}: {
  answers: Answers[];
  questions: Questions;
  showQuestions: boolean;
  showAnswers: boolean;
}) {
  return (
    <div>
      <div className="fs-4 mb-3">Attempt History</div>
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Attempt</th>
            <th>Time</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((answer, index) => (
            <tr>
              <th>{index === 0 && `LATEST`}</th>
              <td>
                <Link
                  to={`Answer/${answers[index]._id}`}
                  className="text-decoration-none text-danger"
                >
                  Attempt {answers.length - index}
                </Link>
              </td>
              <td>{formatTime(answer.time_used)}</td>
              <td>{`${answer.score} out of ${answer.total}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      {showQuestions ? (
        <AnswerHistory
          answer={answers[0]}
          questions={questions.questions}
          showCorrect={showAnswers}
        />
      ) : (
        <div>
          <div>
            Quiz results are protected for this quiz and are not visible to
            students.
          </div>
          <div
            id="wd-todo-error-messag"
            className="text-center alert alert-danger m-3 p-2"
          >
            Correct answers are hidden.
          </div>
          <div>
            Score for this attempt:{" "}
            <span className="fw-bold">{answers[0].score}</span> out of{" "}
            {answers[0].total}
          </div>
        </div>
      )}
    </div>
  );
}
