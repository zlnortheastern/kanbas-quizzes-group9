import React from "react";
import {
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnBulletList,
  BtnNumberedList,
  BtnLink,
  BtnStrikeThrough,
  BtnStyles,
  BtnRedo,
  BtnUndo,
  BtnClearFormatting,
  Editor,
  EditorProvider,
  Toolbar,
} from "react-simple-wysiwyg";
import "./index.css";
import { Quiz, ShowAnswerType } from "../interface";

export default function EditDetails({
  quiz,
  changeQuiz,
}: {
  quiz: Quiz;
  changeQuiz: (quiz: Quiz) => void;
}) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (quiz) {
      const updatedQuiz = { ...quiz, [e.target.name]: e.target.value };
      changeQuiz(updatedQuiz);
    }
  };
  return (
    <>
      <br />
      <input
        value={quiz.title}
        name="title"
        className="form-control mb-2"
        onChange={handleInputChange}
      />
      <br />
      <label htmlFor="input-1" className="form-label ">
        Quiz Instructions:
      </label>
      <div className="d-flex justify-content-between" style={{ width: "100%" }}>
        <EditorProvider>
          <Editor
            value={quiz.description}
            onChange={(e) =>
              changeQuiz({ ...quiz, description: e.target.value })
            }
          >
            <Toolbar>
              <BtnUndo />
              <BtnRedo />
              <BtnBold />
              <BtnItalic />
              <BtnUnderline />
              <BtnStrikeThrough />
              <BtnBulletList />
              <BtnNumberedList />
              <BtnLink />
              <BtnClearFormatting />

              <BtnStyles />
            </Toolbar>
          </Editor>
        </EditorProvider>
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
                changeQuiz({ ...quiz, quizType: e.target.value })
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
                changeQuiz({ ...quiz, assignmentGroup: e.target.value })
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
              disabled
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
                  changeQuiz({
                    ...quiz,
                    shuffleAnswers: e.target.checked,
                  })
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
                checked={quiz.timeLimit !== -1}
                onChange={(e) =>
                  changeQuiz({
                    ...quiz,
                    timeLimit: e.target.checked ? quiz.timeLimit || 0 : -1,
                  })
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
                  changeQuiz({
                    ...quiz,
                    timeLimit: Number(e.target.value),
                  })
                }
                style={{ width: "70px", marginRight: "5px", marginTop: "-7px" }}
              />
              <span>Minutes</span>
            </li>
            <li className="list-group-item border-0 d-flex">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={quiz.multipleAttempts}
                onChange={(e) => {
                  changeQuiz({
                    ...quiz,
                    multipleAttempts: e.target.checked,
                  });
                }}
                id="multipleAttempts"
              />
              <label
                htmlFor="multipleAttempts"
                className="form-check-label"
                style={{ marginRight: "50px" }}
              >
                Allow Multiple Attempts
              </label>
              {quiz.multipleAttempts && (
                <>
                  <input
                    type="number"
                    className="form-control"
                    id="multipleAttempts"
                    value={quiz.attemptLimit + 1}
                    onChange={(e) =>
                      changeQuiz({
                        ...quiz!,
                        attemptLimit: Number(e.target.value),
                      })
                    }
                    style={{
                      width: "70px",
                      marginRight: "5px",
                      marginTop: "-7px",
                    }}
                  />
                  <span>Attempts</span>
                </>
              )}
            </li>
            <li className="list-group-item border-0">
              <label htmlFor="showCorrectAnswers">Show Correct Answers</label>
              <select
                id="showCorrectAnswers"
                className="form-select"
                value={quiz.showCorrectAnswers}
                onChange={(e) => {
                  changeQuiz({
                    ...quiz,
                    showCorrectAnswers: e.target.value as ShowAnswerType,
                  });
                }}
              >
                <option value="immediately">Immediately</option>
                <option value="after_due_date">After due date</option>
                <option value="never">Never</option>
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
                  changeQuiz({ ...quiz, accessCode: e.target.value });
                }}
              />
            </li>
            <li className="list-group-item border-0">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={quiz.oneQuestionAtATime}
                onChange={(e) =>
                  changeQuiz({
                    ...quiz,
                    oneQuestionAtATime: e.target.checked,
                  })
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
                  changeQuiz({
                    ...quiz,
                    webcamRequired: e.target.checked,
                  })
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
                onChange={handleInputChange}
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
                name="dueDate"
                value={quiz.dueDate}
                onChange={handleInputChange}
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
                    name="availableDate"
                    value={quiz.availableDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-6">
                  <input
                    type="date"
                    className="form-control"
                    id="input-6"
                    name="availableUntilDate"
                    value={quiz.availableUntilDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <br />
    </>
  );
}
