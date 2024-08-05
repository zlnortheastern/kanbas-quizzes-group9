import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  Link,
  NavLink,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as client from "../client";
import { FaBan } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { PiRainbowBold } from "react-icons/pi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faUnderline,
  faFont,
  faSortDesc,
  faPencilAlt,
  faEllipsisV,
  faKeyboard,
  faCode,
  faExpandArrowsAlt,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
import "./index.css";
import { setQuiz, addQuiz, updateQuiz } from "../reducer";

export default function EditDetails() {
  const quiz = useSelector((state: any) => state.quizzesReducer.quiz);
  const dispatch = useDispatch();
  const { cid, qid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (qid !== "new" && qid !== undefined) {
      client.getQuizById(qid).then((quiz) => {
        dispatch(setQuiz(quiz));
      });
    } else {
      dispatch(setQuiz({ title: "", description: "", points: 0, ...quiz }));
    }
  }, [qid, dispatch]);

  const [quizType, setQuizType] = useState("Graded Quiz");
  const [assignmentGroup, setAssignmentGroup] = useState("Quizzes");
  const [multipleAttempts, setMultipleAttempts] = useState(false);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState("Always");
  const [accessCode, setAccessCode] = useState("");
  /*
  const calculatePoints = (questions: any) => {
    let totalPoints = 0;
    questions.forEach((q: any) => {
      totalPoints += q.points;
    });
    return totalPoints;
  };
  */

  const handleAddQuiz = (published: any) => {
    const newQuiz = {
      ...quiz,
      published: published,
      //points: calculatePoints(quiz.questions),
    };
    dispatch(setQuiz(newQuiz));
    if (published && cid !== undefined) {
      client.createQuiz(cid, newQuiz).then((quiz) => {
        dispatch(addQuiz(quiz));
        dispatch(setQuiz(quiz));
        navigate(`/Kanbas/Courses/${cid}/Quizzes/`);
      });
    } else if (cid !== undefined) {
      client.createQuiz(cid, newQuiz).then((quiz) => {
        dispatch(addQuiz(quiz));
        dispatch(setQuiz(quiz));
        navigate(`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`);
      });
    }
  };
  const handleUpdateQuiz = (published: any) => {
    const newQuiz = {
      ...quiz,
      published: published,
      //points: calculatePoints(quiz.questions),
    };
    dispatch(setQuiz(newQuiz));
    if (published) {
      dispatch(setQuiz(newQuiz));
      client.updateQuiz(newQuiz).then(() => {
        dispatch(updateQuiz(newQuiz));
        navigate(`/Kanbas/Courses/${cid}/Quizzes/`);
      });
    } else {
      client.updateQuiz(newQuiz).then(() => {
        dispatch(updateQuiz(newQuiz));
        dispatch(setQuiz(newQuiz));
        navigate(`/Kanbas/Courses/${cid}/Quizzes/${newQuiz._id}`);
      });
    }
  };
  const handleSave = (published: any) => {
    if (qid === "new") {
      handleAddQuiz(published);
    } else {
      handleUpdateQuiz(published);
    }
  };

  return (
    <div className="me-2">
      <div className="float-end mt-2">
        Points {quiz.points} &nbsp; &nbsp;
        {quiz.isPublished ? (
          <i
            className="fa fa-check-circle"
            style={{ color: "green" }}
            aria-hidden="true"
          ></i>
        ) : (
          <FaBan style={{ color: "grey" }} aria-hidden="true" />
        )}
        &nbsp;
        {quiz.isPublished ? "Published" : "Not Published"}&nbsp; &nbsp;
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
      <input
        value={quiz?.title}
        className="form-control mb-2"
        onChange={(e) => dispatch(setQuiz({ ...quiz, title: e.target.value }))}
      />
      <br />
      <label htmlFor="input-1" className="form-label ">
        Quiz Instructions:
      </label>
      <div className="d-flex justify-content-between" style={{ width: "100%" }}>
        <div className="d-flex">
          <div style={{ marginRight: "23px" }}>
            <p>Edit</p>
          </div>
          <div style={{ marginRight: "23px" }}>
            <p>View</p>
          </div>
          <div style={{ marginRight: "23px" }}>
            <p>Insert</p>
          </div>
          <div style={{ marginRight: "23px" }}>
            <p>Format</p>
          </div>
          <div style={{ marginRight: "23px" }}>
            <p>Tools</p>
          </div>
          <div>
            <p>Table</p>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <p>
            <PiRainbowBold style={{ color: "green", marginRight: "10px" }} />
            100%
          </p>
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <select
            className="form-select border-0"
            style={{ width: "100px", marginTop: "-10px" }}
          >
            <option>12pt</option>
            <option>14pt</option>
            <option>16pt</option>
            <option>18pt</option>
            <option>20pt</option>
          </select>
          <select
            className="form-select border-0"
            style={{ width: "150px", marginRight: "23px", marginTop: "-10px" }}
          >
            <option>Paragraph</option>
            <option>Header</option>
          </select>
          <div style={{ marginRight: "23px", marginTop: "9px", color: "gray" }}>
            <p>|</p>
          </div>
          <div className="p-0 pt-2" style={{ marginRight: "23px" }}>
            <FontAwesomeIcon icon={faBold} aria-hidden="true" />
          </div>
          <div className="p-0 pt-2" style={{ marginRight: "23px" }}>
            <FontAwesomeIcon icon={faItalic} aria-hidden="true" />
          </div>
          <div className="p-0 pt-2" style={{ marginRight: "23px" }}>
            <FontAwesomeIcon icon={faUnderline} aria-hidden="true" />
          </div>
          <div className="p-0 pt-2" style={{ marginRight: "23px" }}>
            <FontAwesomeIcon icon={faFont} aria-hidden="true" />
          </div>
          <div className="p-0 pt-1" style={{ marginRight: "23px" }}>
            <FontAwesomeIcon icon={faSortDesc} aria-hidden="true" />
          </div>
          <div className="p-0 pt-2" style={{ marginRight: "23px" }}>
            <FontAwesomeIcon icon={faPencilAlt} aria-hidden="true" />
          </div>
          <div className="p-0 pt-1" style={{ marginRight: "23px" }}>
            <FontAwesomeIcon icon={faSortDesc} aria-hidden="true" />
          </div>
          <div style={{ marginRight: "23px", marginTop: "9px", color: "gray" }}>
            <p>|</p>
          </div>
          <div className="p-0 pt-2" style={{ marginRight: "23px" }}>
            <FontAwesomeIcon icon={faEllipsisV} aria-hidden="true" />
          </div>
        </div>
      </div>
      <textarea
        className="form-control p-3"
        placeholder="New Description"
        value={quiz.description}
        onChange={(e) => {
          const newValue = e.target.value;
          dispatch(setQuiz({ ...quiz, description: newValue }));
        }}
      />
      <div className="d-flex float-end">
        <div className="col-auto pt-1" style={{ marginRight: "23px" }}>
          <FontAwesomeIcon icon={faKeyboard} className="text-danger" />
        </div>
        <div style={{ marginRight: "23px", marginTop: "3px", color: "gray" }}>
          <p>|</p>
        </div>
        <div className="col-auto pt-1" style={{ marginRight: "23px" }}>
          <p className="text-danger">0 Words</p>
        </div>
        <div style={{ marginRight: "23px", marginTop: "3px", color: "gray" }}>
          <p>|</p>
        </div>
        <div className="col-auto pt-1" style={{ marginRight: "23px" }}>
          <FontAwesomeIcon icon={faCode} className="text-danger" />
        </div>
        <div className="col-auto pt-1" style={{ marginRight: "23px" }}>
          <FontAwesomeIcon icon={faExpandArrowsAlt} className="text-danger" />
        </div>
        <div className="col-auto pt-1">
          <FontAwesomeIcon icon={faGripVertical} />
        </div>
      </div>
      <br />
      <br />
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-2 text-center">
            <label htmlFor="quiz-type">Quiz Type</label>
          </div>
          <div className="col-7">
            <select
              id="quiz-type"
              className="form-select"
              value={quiz.quizType}
              onChange={(e) =>
                dispatch(setQuiz({ ...quiz, quizType: e.target.value }))
              }
            >
              <option value="Graded Quiz">Graded Quiz</option>
              <option value="Practice Quiz">Practice Quiz</option>
              <option value="Graded Survey">Graded Survey</option>
              <option value="Ungraded Survey">Ungraded Survey</option>
            </select>
          </div>
        </div>
        <br />
        <div className="row justify-content-center align-items-center">
          <div className="col-2 text-center">
            <label htmlFor="assignment-Group">Assignment Group</label>
          </div>
          <div className="col-7">
            <select
              id="assignment-Group"
              className="form-select"
              value={quiz.assignmentGroup}
              onChange={(e) =>
                dispatch(setQuiz({ ...quiz, assignmentGroup: e.target.value }))
              }
            >
              <option value="Assignments">Assignments</option>
              <option value="Quizzes">Quizzes</option>
              <option value="Exams">Exams</option>
              <option value="Project">Project</option>
            </select>
          </div>
        </div>
        <br />
        <div className="row justify-content-center align-items-center">
          <div className="col-2 text-center">
            <label htmlFor="input-2">Points</label>
          </div>
          <div className="col-7">
            <input
              className="form-control"
              id="input-2"
              value={quiz.points}
              onChange={(e) =>
                dispatch(setQuiz({ ...quiz, points: e.target.value }))
              }
            />
          </div>
        </div>
        <br />
      </div>
      <br />

      <div className="row justify-content-center align-items-center">
        <div className="col-2 text-center">
          <div>Options</div>
        </div>
        <div className="col-7">
          <ul className="list-group list-group-item wd-kanbas-edit-section">
            <li className="list-group-item border-0">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={quiz.shuffleAnswers}
                onChange={(e) =>
                  dispatch(
                    setQuiz({ ...quiz, shuffleAnswers: e.target.checked })
                  )
                }
                id="shuffleAnswers"
              />
              <label htmlFor="shuffleAnswers" className="form-check-label">
                Shuffle Answers
              </label>
            </li>
            <li className="list-group-item border-0 d-flex">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={quiz.timeLimit}
                onChange={(e) =>
                  dispatch(setQuiz({ ...quiz, timeLimit: e.target.checked }))
                }
                id="timeLimit"
              />
              <label
                className="text-nowrap"
                htmlFor="timeLimit"
                style={{ marginRight: "50px" }}
              >
                Time Limit
              </label>
              <input
                type="number"
                className="form-control"
                id="timeLimit"
                value={quiz.timeLimit}
                onChange={(e) =>
                  dispatch(
                    setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) })
                  )
                }
                style={{ width: "70px", marginRight: "5px", marginTop: "-7px" }}
              />
              <span>Minutes</span>
            </li>
            <li className="list-group-item border-0">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={quiz.multipleAttempts}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setMultipleAttempts(isChecked);
                  dispatch(setQuiz({ ...quiz, multipleAttempts: isChecked }));
                }}
                id="multipleAttempts"
              />
              <label htmlFor="multipleAttempts" className="form-check-label">
                Allow Multiple Attempts
              </label>
            </li>
            <li className="list-group-item border-0">
              <label htmlFor="showCorrectAnswers">Show Correct Answers</label>
              <select
                id="showCorrectAnswers"
                className="form-select"
                value={quiz.showCorrectAnswers}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setShowCorrectAnswers(newValue);
                  dispatch(setQuiz({ ...quiz, showCorrectAnswers: newValue }));
                }}
              >
                <option value="immediately">immediately</option>
                <option value="after_due_date">after_due_date</option>
                <option value="never">never</option>
              </select>
            </li>
            <li className="list-group-item border-0">
              <label htmlFor="accessCode">Access Code</label>
              <input
                type="text"
                className="form-control"
                id="accessCode"
                value={quiz.accessCode}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setAccessCode(newValue);
                  dispatch(setQuiz({ ...quiz, accessCode: newValue }));
                }}
              />
            </li>
            <li className="list-group-item border-0">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={quiz.onQuestionAtATime}
                onChange={(e) =>
                  dispatch(
                    setQuiz({ ...quiz, onQuestionAtATime: e.target.checked })
                  )
                }
                id="onQuestionAtaTime"
              />
              <label htmlFor="onQuestionAtATime" className="form-check-labe">
                One Question at a Time
              </label>
            </li>
            <li className="list-group-item border-0">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={quiz.webcamRequired}
                onChange={(e) =>
                  dispatch(
                    setQuiz({ ...quiz, webcamRequired: e.target.checked })
                  )
                }
                id="webcamRequired"
              />
              <label htmlFor="webcamRequired" className="form-check-label">
                Webcam Required
              </label>
            </li>
            <li className="list-group-item border-0">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={quiz.lockQuestionsAfterAnswering}
                onChange={(e) =>
                  dispatch(
                    setQuiz({
                      ...quiz,
                      lockQuestionsAfterAnswering: e.target.checked,
                    })
                  )
                }
                id="lockQuestionsAfterAnswering"
              />
              <label
                htmlFor="lockQuestionsAfterAnswering"
                className="form-check-label "
              >
                Lock Questions After Answering
              </label>
            </li>
          </ul>
        </div>
      </div>
      <br />

      <div className="row justify-content-center align-items-center">
        <div className="col-2 text-center">
          <div>Assign</div>
        </div>
        <div className="col-7">
          <ul className="list-group list-group-item wd-kanbas-edit-section">
            <li className="list-group-item border-0">
              <b>Assin to</b>
            </li>
            <li className="list-group-item border-0">
              <select id="quiz-type" className="form-control">
                <option value="Everyone">Everyone</option>
              </select>
            </li>
            <li className="list-group-item border-0">
              <b>Due</b>
            </li>
            <li className="list-group-item border-0">
              <input
                type="date"
                className="form-control"
                id="input-4"
                value={quiz.dueDate}
                onChange={(e) =>
                  dispatch(setQuiz({ ...quiz, dueDate: e.target.value }))
                }
              />
            </li>
            <li className="list-group-item border-0">
              <div className="row">
                <div className="col-6 text-start">
                  <b className="wd-kanbas-width-45">Available from</b>
                </div>
                <div className="col-6 text-start">
                  <b className="wd-kanbas-width-45">Until</b>
                </div>
              </div>
            </li>
            <li className="list-group-item border-0">
              <div className="row">
                <div className="col-6">
                  <input
                    type="date"
                    className="form-control"
                    id="input-5"
                    value={quiz.availabilityDate}
                    onChange={(e) =>
                      dispatch(
                        setQuiz({ ...quiz, availabilityDate: e.target.value })
                      )
                    }
                  />
                </div>
                <div className="col-6">
                  <input
                    type="date"
                    className="form-control"
                    id="input-6"
                    value={quiz.untilDate}
                    onChange={(e) =>
                      dispatch(setQuiz({ ...quiz, untilDate: e.target.value }))
                    }
                  />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <br />
      <div className="button-container">
        <button
          onClick={() => handleSave(false)}
          className="btn btn-danger ms-2 mb-4 float-end"
        >
          Save
        </button>
        <button
          onClick={() => handleSave(true)}
          className="btn btn-success ms-2 mb-4 float-end"
        >
          Save & Publish
        </button>
        <Link
          to={`/Kanbas/Courses/${cid}/Quizzes`}
          className="btn btn-secondary ms-2 mb-4 float-end"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
