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

export default function EditQuestions() {
  const quiz = useSelector((state: any) => state.quizzesReducer.quiz);

  const dispatch = useDispatch();
  const { cid, qid } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<
    number | null
  >(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (qid !== "new" && qid !== undefined) {
      client
        .getQuizById(qid)
        .then((quiz) => {
          dispatch(setQuiz(quiz));

          client
            .getQuestionsByQuiz(qid)
            .then((fetchedQuestions: Questions | null) => {
              if (
                fetchedQuestions &&
                Array.isArray(fetchedQuestions.questions)
              ) {
                setQuestions(fetchedQuestions.questions);
              } else {
                console.error("Fetched questions is null or not an array");

                setQuestions([]);
              }
            })
            .catch((error) => {
              console.error("Error fetching questions:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching quiz:", error);
        });
    } else {
      dispatch(setQuiz({ title: "", description: "", points: 0, ...quiz }));
    }
  }, [qid, dispatch]);

  const calculatePoints = (questions: any) => {
    let totalPoints = 0;
    questions.forEach((q: any) => {
      totalPoints += q.points;
    });
    return totalPoints;
  };

  const handleAddQuiz = (published: any) => {
    const newQuiz = {
      ...quiz,
      published: published,
      points: calculatePoints(questions),
    };
    dispatch(setQuiz(newQuiz));
    if (published && cid !== undefined) {
      client.createQuiz(cid, newQuiz).then((quiz) => {
        dispatch(addQuiz(quiz));
        dispatch(setQuiz(quiz));
      });
    } else if (cid !== undefined) {
      client.createQuiz(cid, newQuiz).then((quiz) => {
        dispatch(addQuiz(quiz));
        dispatch(setQuiz(quiz));
      });
    }
  };

  const handleUpdateQuiz = (published: any) => {
    const newQuiz = {
      ...quiz,
      published: published,
      points: calculatePoints(questions),
    };
    dispatch(setQuiz(newQuiz));
    client.updateQuiz(newQuiz).then(() => {
      dispatch(updateQuiz(newQuiz));
    });
  };

  const handleSave = (published: any) => {
    if (qid === "new") {
      handleAddQuiz(published);
    } else {
      handleUpdateQuiz(published);
    }
  };

  const handleEditQuestion = (index: number) => {
    setEditingQuestionIndex(index);
    setIsEditing(true);
  };

  const handleAddNewQuestion = () => {
    setEditingQuestionIndex(null);
    setIsEditing(true);
  };

  const handleSaveQuestion = (savedQuestion: Question) => {
    const updatedQuestions = [...questions];
    if (editingQuestionIndex !== null) {
      updatedQuestions[editingQuestionIndex] = savedQuestion;
    } else {
      updatedQuestions.push(savedQuestion);
    }
    setQuestions(updatedQuestions);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="me-2">
      <div className="float-end mt-2">
        Points {quiz.points} &nbsp; &nbsp;
        {quiz.published ? (
          <FaBan style={{ color: "green" }} aria-hidden="true" />
        ) : (
          <FaBan style={{ color: "grey" }} aria-hidden="true" />
        )}
        &nbsp;
        {quiz.published ? "Published" : "Not Published"}&nbsp; &nbsp;
        <button type="button" className="btn btn-light ">
          <IoEllipsisVertical />
        </button>
      </div>
      <br />
      <br />
      <hr />
      <div className="nav nav-tabs">
        <NavLink
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
          to={`/Kanbas/Courses/${cid}/Quizzes/${qid}/edit`}
        >
          Details
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
          to={`/Kanbas/Courses/${cid}/Quizzes/${qid}/questions`}
        >
          Questions
        </NavLink>
      </div>
      <br />

      {!isEditing && (
        <div style={{ marginLeft: "150px", marginRight: "150px" }}>
          {questions.map((question, index) => (
            <div
              key={index}
              className="mx-3 mb-4 border border-secondary"
              style={{ padding: "0", position: "relative", width: "100%" }}
            >
              <div
                className="p-3 border-bottom border-secondary"
                style={{ backgroundColor: "#f5f5f5", width: "100%" }}
              >
                <div className="float-end font-color-secondary">
                  {question.points} pts
                </div>
                <div className="fw-bold">Question {index + 1}</div>
              </div>

              <div style={{ width: "100%" }}>
                <div id="question-description" className="p-3 my-3">
                  {question.question}
                  <button
                    className="btn btn-danger btn-sm float-end"
                    onClick={() => handleEditQuestion(index)}
                    style={{
                      position: "absolute",
                      right: "20px",
                      bottom: "15px",
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <div style={{ marginLeft: "150px", marginRight: "150px" }}>
          <QuestionForm
            initialQuestion={
              editingQuestionIndex !== null
                ? questions[editingQuestionIndex]
                : {
                    type: QuestionType.multipleChoice,
                    title: "",
                    points: 0,
                    question: "",
                    true_or_false: true,
                    choices: [],
                    blank: [],
                  }
            }
            onSave={handleSaveQuestion}
            onCancel={handleCancelEdit}
          />
        </div>
      )}

      <br />
      {!isEditing && (
        <div className="button-container">
          <button
            className="btn border-bottom border-secondary "
            style={{ backgroundColor: "#f5f5f5", margin: "10px 0" }}
            onClick={handleAddNewQuestion}
          >
            <FaPlus aria-hidden="true" />
            New Question
          </button>
        </div>
      )}

      <br />
      <hr />
      <br />
      <div className="button-container">
        <button
          onClick={() => handleSave(false)}
          className="btn btn-danger ms-2 float-end"
        >
          Save
        </button>
        <button
          onClick={() => handleSave(true)}
          className="btn btn-success ms-2 float-end"
        >
          Save & Publish
        </button>
        <Link
          to={`/Kanbas/Courses/${cid}/Quizzes`}
          className="btn btn-secondary  ms-2 float-end"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
