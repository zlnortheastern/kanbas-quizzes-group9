import React from "react";
import { Quiz } from "../interface";
import { Link } from "react-router-dom";
import { formatDate } from "../../../util";

export default function QuizStudentControls({
  availableTime,
  currentTime,
  untilTime,
  quiz,
  answered,
  canAnswer,
}: {
  availableTime: Date;
  currentTime: Date;
  untilTime: Date;
  quiz: Quiz | undefined;
  answered: boolean;
  canAnswer: boolean;
}) {
  if (availableTime < currentTime && currentTime < untilTime) {
    return (
      <div>
        {quiz?.description && <p className="mb-5">{quiz.description}</p>}
        <div className="text-center">
          {canAnswer && (
            <Link
              to={`preview`}
              className="btn btn-danger font-color-white rounded-1"
            >
              {answered ? "Take the Quiz Again" : "Take the Quiz"}
            </Link>
          )}
        </div>
      </div>
    );
  } else if (availableTime > currentTime) {
    return (
      <div className="my-4">
        This quiz is locked until {formatDate(quiz?.availableDate as string)}.
      </div>
    );
  } else {
    return (
      <div>
        This quiz was locked {formatDate(quiz?.availableUntilDate as string)}.
      </div>
    );
  }
}
