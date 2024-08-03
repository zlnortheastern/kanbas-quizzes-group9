import React from "react";
import { Answer, Answers, Question, QuestionType } from "../interface";
import "./index.css";
import AnswerLabel from "./AnswerLabel";

export default function AnswerByType({
  answer,
  question,
  showCorrect,
}: {
  answer: Answer;
  question: Question;
  showCorrect: boolean;
}) {
  //const correct = false;
  if (question.type === QuestionType.fillInBlank) {
    const correct = question.blank?.includes(answer.blank as string);
    return (
      <div className="p-3" style={{ fontSize: "0.88rem" }}>
        <AnswerLabel
          labelType={correct ? "correct_answer" : "incorrect_answer"}
        />
        <div
          className={`ms-2 ${
            !correct && "border border-2 border-danger rounded-2"
          }`}
        >
          <input
            style={{
              width: "120px",
              maxWidth: "100%",
              minWidth: "120px",
            }}
            className="p-2 mt-2 ms-4"
            type="text"
            disabled
            value={answer.blank}
          />
        </div>
        {showCorrect && (
          <>
            <hr />
            <AnswerLabel labelType="answer" />
            <div style={{ marginTop: "30px", marginLeft: "33px" }}>
              {question.blank?.map((b) => (
                <div>{b}</div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  } else if (question.type === QuestionType.multipleChoice) {
    const correct =
      question.choices && answer.choice && question.choices[answer.choice];
    //const correct = false;
    return (
      <div className="mx-3 mb-4" style={{ fontSize: "0.88rem" }}>
        {question.choices?.map((choice, index) => (
          <div>
            {index === answer.choice && (
              <AnswerLabel
                labelType={correct ? "correct_answer" : "incorrect_answer"}
              />
            )}
            {!correct && choice.correct && <AnswerLabel labelType="answer" />}
            <div
              className={`ms-2 ${
                !correct && index === answer.choice
                  ? "border border-2 border-danger rounded-2"
                  : "border-top"
              }`}
            >
              <input
                type="radio"
                className="my-3 ms-4"
                disabled
                checked={answer.choice === index}
              />
              &nbsp;
              <div className="d-inline-block" style={{ verticalAlign: "1px" }}>
                {choice.choice}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    const correct = answer.true_or_false === question.true_or_false;
    return (
      <div className="mx-3 mb-4" style={{ fontSize: "0.88rem" }}>
        <div>
          {answer.true_or_false && (
            <AnswerLabel
              labelType={correct ? "correct_answer" : "incorrect_answer"}
            />
          )}
          {!correct && !answer.true_or_false && (
            <AnswerLabel labelType="answer" />
          )}
          <div
            className={`ms-2 ${
              !correct && answer.true_or_false
                ? "border border-2 border-danger rounded-2"
                : "border-top"
            }`}
          >
            <input
              type="radio"
              className="my-3 ms-4"
              disabled
              checked={answer.true_or_false}
            />
            &nbsp;
            <div className="d-inline-block" style={{ verticalAlign: "1px" }}>
              True
            </div>
          </div>
        </div>

        <div>
          {!answer.true_or_false && (
            <AnswerLabel
              labelType={correct ? "correct_answer" : "incorrect_answer"}
            />
          )}
          {!correct && answer.true_or_false && (
            <AnswerLabel labelType="answer" />
          )}
          <div
            className={`ms-2 ${
              !correct && !answer.true_or_false
                ? "border border-2 border-danger rounded-2"
                : "border-top"
            }`}
          >
            <input
              type="radio"
              className="my-3 ms-4"
              disabled
              checked={!answer.true_or_false}
            />
            &nbsp;
            <div className="d-inline-block" style={{ verticalAlign: "1px" }}>
              False
            </div>
          </div>
        </div>
      </div>
    );
  }
}
