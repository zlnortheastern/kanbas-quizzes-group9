import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Answer,
  Answers,
  Question,
  Questions,
  Quiz,
  ShowAnswerType,
} from "../interface";
import * as client from "../client";
import { useAuth } from "../../../Authentication/AuthProvider";
import AnswerHistory from "./AnswerHistory";
import { Link } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function ViewAttempt() {
  const [questions, setQuestions] = useState<Questions>();
  const [answers, setAnswers] = useState<Answers[]>();
  const [quiz, setQuiz] = useState<Quiz>();
  const { cid, qid, aid } = useParams();
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

  const dueDateTime = new Date(quiz?.dueDate as string);
  const currentTime = new Date();

  let displayQuestion = true;
  let displayAnswer = true;

  if (
    quiz?.showCorrectAnswers === ShowAnswerType.after_due_date &&
    currentTime < dueDateTime
  ) {
    displayAnswer = false;
  } else if (quiz?.showCorrectAnswers === ShowAnswerType.never) {
    displayQuestion = false;
  }

  if (!quiz && !questions) return <></>;
  return (
    <div className="row">
      <div className="col-9">
        <h2>{quiz?.title}</h2>
        <hr />
        {displayQuestion ? (
          <AnswerHistory
            answer={answers?.find((a) => a._id === aid) as Answers}
            questions={questions?.questions as Question[]}
            showCorrect={displayAnswer}
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
            {answers && (
              <div>
                Score for this attempt:{" "}
                <span className="fw-bold">{answers[0].score}</span> out of{" "}
                {answers[0].total}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="col-3">
        <div className="ms-4">
          <div className="fw-bold">Quiz Submissions</div>
          <hr />
          <div>
            {answers?.map((answer, index) => (
              <div className="ms-4 mb-2">
                <Link
                  to={`../Quizzes/${qid}/Answer/${answer._id}`}
                  className="text-decoration-none text-danger fw-bold"
                >{`Attempt ${index + 1}: ${answer.score}`}</Link>
              </div>
            ))}
          </div>
          <div className="mb-2">
            This quiz has {quiz?.attemptLimit} attempts
          </div>
          <div>
            <Link
              to={`../Quizzes/${qid}`}
              className="text-decoration-none text-danger"
            >
              <IoIosArrowRoundBack fontSize={26} />
              Back to Quiz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
