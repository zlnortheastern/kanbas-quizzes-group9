import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { addQuiz, setQuiz, updateQuiz } from "../reducer";
import * as client from "../client";
import { FaBan, FaPlus } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import { Questions, Question, QuestionType } from "../interface";
import { useEffect, useState } from "react";
import QuestionForm from "../Questions/questionForm";
import "./index.css";

export default function EditQuestions({
  questionSet,
  changeQuestionSet,
}: {
  questionSet: Questions;
  changeQuestionSet: (questionSet: Questions) => void;
}) {
  const [questionList, setQuestionList] = useState<JSX.Element[]>([]);

  const updateQuestionList = (index: number, updatedQuestion: Question) => {
    const questionList = [...questionSet.questions];
    questionList[index] = updatedQuestion;
    changeQuestionSet({
      ...questionSet,
      questions: questionList,
    });
  };

  const deleteQuestion = (index: number) => {
    const updatedQuestions = questionSet.questions.filter(
      (_, i) => i !== index
    );
    changeQuestionSet({ ...questionSet, questions: updatedQuestions });

    setQuestionList(
      updatedQuestions.map((question, i) => (
        <QuestionForm
          key={i}
          index={i}
          editing={false}
          question={question}
          onQuestionChange={updateQuestionList}
          deleteQuestion={deleteQuestion}
        />
      ))
    );
  };

  useEffect(() => {
    setQuestionList(
      questionSet.questions.map((question, index) => {
        return (
          <QuestionForm
            index={index}
            editing={false}
            question={question}
            onQuestionChange={updateQuestionList}
            deleteQuestion={deleteQuestion}
          />
        );
      })
    );
  }, []);

  const newQuestion = () => {
    const newQuestionSet: Question = {
      type: QuestionType.multipleChoice,
      title: "",
      points: 0,
      question: "",
      choices: [],
      true_or_false: true,
      blank: [],
    };

    const updatedQuestions = [...questionSet.questions, newQuestionSet];
    changeQuestionSet({ ...questionSet, questions: updatedQuestions });

    setQuestionList((prevList) => [
      ...prevList,
      <QuestionForm
        index={updatedQuestions.length - 1}
        editing={true}
        question={newQuestionSet}
        onQuestionChange={updateQuestionList}
        deleteQuestion={deleteQuestion}
      />,
    ]);
  };

  return (
    <div className="mt-5">
      <div style={{ marginLeft: "150px", marginRight: "150px" }}>
        {questionList}
      </div>

      <br />
      <div className="button-container">
        <button
          className="btn border-bottom border-secondary "
          style={{ backgroundColor: "#f5f5f5", margin: "10px 0" }}
          onClick={newQuestion}
        >
          <FaPlus aria-hidden="true" />
          New Question
        </button>
      </div>
      <hr />
    </div>
  );
}
