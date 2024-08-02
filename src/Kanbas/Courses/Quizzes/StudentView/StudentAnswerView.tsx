import React from "react";
import { Answers } from "../interface";
import { formatTime } from "../../../util";

export default function StudentAnswerView({ answers }: { answers: Answers[] }) {
  return (
    <div>
      <div className="fs-3">Attempt History</div>
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
              <td>Attempt{index + 1}</td>
              <td>{formatTime(answer.time_used)}</td>
              <td>{`${answer.score} out of ${answer.total}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
    </div>
  );
}
