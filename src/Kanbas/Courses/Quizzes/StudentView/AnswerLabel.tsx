import React from "react";

export default function AnswerLabel({
  labelType,
}: {
  labelType: "correct_answer" | "incorrect_answer" | "answer";
}) {
  const getInnerText = () => {
    switch (labelType) {
      case "correct_answer":
        return "Correct !";
      case "incorrect_answer":
        return "You Answered";
      case "answer":
        return "Correct Answer";
      default:
        return "";
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <span
        className={`answer_arrow ${labelType}`}
        style={{ left: "-128px", top: "10px" }}
      >
        {getInnerText()}
      </span>
    </div>
  );
}
