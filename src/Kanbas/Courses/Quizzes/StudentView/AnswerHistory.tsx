import React from "react";
import { Answers, Question, Questions } from "../interface";
import { formatDate, formatTime } from "../../../util";
import AnswerByType from "./AnswerByType";

export default function AnswerHistory({
  answer,
  questions,
  showCorrect,
}: {
  answer: Answers;
  questions: Question[];
  showCorrect: boolean;
}) {
  return (
    <div>
      <div id="answer-information">
        <div>
          Score for this quiz: <span className="fw-bold">{answer.score}</span>{" "}
          out of {answer.total}
        </div>
        <div>Submitted {formatDate(answer.submit_time)}</div>
        <div className="mb-3">
          This attempt took {formatTime(answer.time_used)}.
        </div>
      </div>
      <div id="answer-board" style={{ marginLeft: "110px", marginRight:"110px" }}>
        {questions.map((question, index) => (
          <div key={index} className="mx-3 mb-4 border border-secondary">
            <div
              className="p-3 border-bottom border-secondary"
              style={{ backgroundColor: "#f5f5f5" }}
            >
              <div className="float-end font-color-secondary">
                {answer.answers[index].score}/ {question.points} pts
              </div>
              <div className="fw-bold">Question {index + 1}</div>
            </div>

            <div>
              <div id="question-description" className="p-3 my-3">
                {question.question}
              </div>
              <div>
                <AnswerByType
                  question={question}
                  answer={answer.answers[index]}
                  showCorrect={showCorrect}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
