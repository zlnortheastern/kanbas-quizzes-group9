import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as client from "../client";
import React, { useEffect, useState } from "react";
import { setQuiz, updateQuiz } from "../reducer";
import { QuestionType } from "../interface";
import {
  setQuestions,
  setQuestion,
  addQuestion,
  deleteQuestion,
  updateQuestion,
  RootState,
} from "./questionsReducer";
import {
  setChoices,
  setChoice,
  addChoice,
  deleteChoice,
} from "./choicesReducer";
import { setBlanks, setBlank, addBlank, deleteBlank } from "./blanksReducer";
export default function Question() {
  const question = useSelector((state: any) => state.questionsReducer.question);
  const choices = useSelector((state: any) => state.choicesReducer.choices);
  const blanks = useSelector((state: any) => state.blanksReducer.blanks);
  const navigate = useNavigate();
  let newQuestion = false;
  const { courseId, quizId = "", questionsId = "", title = "" } = useParams();
  const decodedTitle = decodeURIComponent(title || "");
  if (decodedTitle == "new") {
    newQuestion = true;
  }

  const [isMultipleChoice, setIsMultipleChoice] = useState(true);
  const [isFillInBlank, setIsFillInBlank] = useState(false);
  const [isTrueOrFalse, setIsTrueOrFalse] = useState(false);
  const [isDisabled, setDisabled] = useState(false);

  const dispatch = useDispatch();

  const intialQuestion = {
    type: QuestionType.multipleChoice,
    title: "",
    points: 0,
    question: "",
    true_or_false: true,
    choices: [],
    blank: [],
  };

  useEffect(() => {
    if (decodedTitle !== "new") {
      const fetchQuestion = async () => {
        const questionSet = await client.getQuestions(questionsId);
        const question = questionSet.questions.find(
          (question: { title: string | undefined }) =>
            question.title === decodedTitle
        );
        dispatch(setQuestion(question));
        dispatch(setChoices(question.choices));
        dispatch(setBlanks(question.blank));
        if (question.type === QuestionType.multipleChoice) {
          setDisabled(true);
          setIsMultipleChoice(true);
          setIsFillInBlank(false);
          setIsTrueOrFalse(false);
        } else if (question.type === QuestionType.trueOrFalse) {
          setDisabled(true);
          setIsMultipleChoice(false);
          setIsFillInBlank(false);
          setIsTrueOrFalse(true);
        } else if (question.type === QuestionType.fillInBlank) {
          setDisabled(true);
          setIsMultipleChoice(false);
          setIsFillInBlank(true);
          setIsTrueOrFalse(false);
        }
      };
      fetchQuestion();
    } else {
      dispatch(setQuestion(intialQuestion));
      dispatch(setChoices(intialQuestion.choices));
      dispatch(setBlanks(intialQuestion.blank));
    }
  }, [decodedTitle, questionsId, dispatch]);

  const handleAddQuestion = async () => {
    if (title === "new") {
      const createdQuestion = await client.addQuestionToQuiz(quizId, question);
      dispatch(addQuestion(createdQuestion));
    } else {
      await client.updateQuestion(quizId, question);
      dispatch(updateQuestion(question));
    }
    navigate(`/courses/${courseId}/quizzes/${quizId}/questions`);
  };

  const handleAddChoice = () => {
    const newChoice = {
      _id: `${Date.now()}`,
      choice: "",
      correct: false,
    };
    dispatch(addChoice(newChoice));
    dispatch(setQuestion({ ...question, choices: [...choices, newChoice] }));
  };

  const handleChoiceTextChange = (index: number, value: any) => {
    const updatedChoices = choices.map((choice: any, i: number) =>
      i === index ? { ...choice, choice: value } : choice
    );
    dispatch(setChoices(updatedChoices));
    dispatch(setQuestion({ ...question, choices: updatedChoices }));
  };

  const handleCorrectAnswerChange = (index: number) => {
    const updatedChoices = choices.map((choice: any, i: number) => ({
      ...choice,
      correct: i === index,
    }));
    dispatch(setChoices(updatedChoices));
    dispatch(setQuestion({ ...question, choices: updatedChoices }));
  };

  const handleDeleteChoice = (index: number) => {
    const updatedChoices = choices.filter(
      (choice: any, i: number) => i !== index
    );
    dispatch(setChoices(updatedChoices));
    dispatch(setQuestion({ ...question, choices: updatedChoices }));
  };

  const handleAddBlank = () => {
    const newBlank = { value: "" };
    const updatedBlanks = [...blanks, newBlank];
    dispatch(addBlank(newBlank));
    dispatch(setQuestion({ ...question, blank: updatedBlanks }));
  };

  const handleBlankTextChange = (index: number, value: any) => {
    const updatedBlanks = blanks.map((blank: any, i: number) =>
      i === index ? { ...blank, value: value } : blank
    );
    dispatch(setBlanks(updatedBlanks));
    dispatch(setQuestion({ ...question, blank: updatedBlanks }));
  };

  const handleDeleteBlank = (index: number) => {
    const updatedBlanks = blanks.filter((blank: any, i: number) => i !== index);
    dispatch(setBlanks(updatedBlanks));
    dispatch(setQuestion({ ...question, blank: updatedBlanks }));
  };

  const handleCancel = () => {
    navigate(`/courses/${courseId}/quizzes/${quizId}/questions`);
  };

  return (
    <div>
      <div className="row ">
        <div className="col-3">
          <input
            placeholder="Question Title"
            type="text"
            value={question.title}
            onChange={(e) =>
              dispatch(setQuestion({ ...question, title: e.target.value }))
            }
            className="form-control"
          />
        </div>
        <div className="col-3">
          <select
            className="form-select"
            value={question.questionType}
            disabled={isDisabled}
            onChange={(e) => {
              dispatch(
                setQuestion({
                  ...question,
                  questionType: e.target.value as QuestionType,
                })
              );
              if (e.target.value === QuestionType.multipleChoice) {
                setIsMultipleChoice(true);
                setIsTrueOrFalse(false);
                setIsFillInBlank(false);
              } else if (e.target.value === QuestionType.trueOrFalse) {
                setIsMultipleChoice(false);
                setIsTrueOrFalse(true);
                setIsFillInBlank(false);
              } else if (e.target.value === QuestionType.fillInBlank) {
                setIsMultipleChoice(false);
                setIsTrueOrFalse(false);
                setIsFillInBlank(true);
              }
            }}
          >
            <option value={QuestionType.multipleChoice}>Multiple Choice</option>
            <option value={QuestionType.trueOrFalse}>True/False</option>
            <option value={QuestionType.fillInBlank}>Fill in the blanks</option>
          </select>
        </div>
        <div className="col">
          <div className="row g-2 float-end">
            <div className="col-2 pt-2">
              <label htmlFor="points">Pts:</label>
            </div>
            <div className="col-4">
              <input
                className="form-control"
                type="number"
                id="points"
                value={question.points}
                onChange={(e) =>
                  dispatch(setQuestion({ ...question, points: e.target.value }))
                }
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <small>
        Enter your question text, then define all possible correct answers for
        the blank.
      </small>
      <br />
      <small>
        Students will see the question followed by a small text box to type
        their answers.
      </small>
      <br />
      <br />
      <label htmlFor="input-1" className="form-label">
        {" "}
        <b>Question:</b>
      </label>
      <div className="row ms-2">
        <div className="p-2 col-auto">
          <p>Edit</p>
        </div>
        <div className="p-2 col-auto">
          <p>View</p>
        </div>
        <div className="p-2 col-auto">
          <p>Insert</p>
        </div>
        <div className="p-2 col-auto">
          <p>Format</p>
        </div>
        <div className="p-2 col-auto">
          <p>Tools</p>
        </div>
        <div className="p-2 col-auto">
          <p>Table</p>
        </div>
        <div className="col">
          <div className="row float-end mx-3">
            <p>100%</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="p-1 col-auto">
          <select className="form-select border-0">
            <option>12pt</option>
            <option>14pt</option>
          </select>
        </div>
        <div className="p-1 col-auto">
          <select className="form-select border-0">
            <option>Paragraph</option>
          </select>
        </div>
        <div className="p-2 col-auto">
          <i className="fa fa-bold" aria-hidden="true"></i>
        </div>
        <div className="p-2 col-auto">
          <i className="fa fa-italic" aria-hidden="true"></i>
        </div>
        <div className="p-2 col-auto">
          <i className="fa fa-underline" aria-hidden="true"></i>
        </div>
        <div className="p-2 col-auto">
          <i className="fa fa-font" aria-hidden="true"></i>
        </div>
        <div className="p-2 col-auto">
          <i className="fa fa-sort-desc" aria-hidden="true"></i>
        </div>
        <div className="p-2 col-auto">
          <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
        </div>
        <div className="p-2 col-auto">
          <i className="fa fa-sort-desc" aria-hidden="true"></i>
        </div>
        <div className="p-2 col-auto">
          <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
        </div>
      </div>
      <br />
      <textarea
        className="form-control p-3"
        placeholder=" 2 + 2 = 4 "
        value={question.questionVal}
        onChange={(e) =>
          dispatch(setQuestion({ ...question, questionVal: e.target.value }))
        }
      ></textarea>
      <div className="row float-end mx-3">
        <div className="col-auto pt-1">
          <i className="fa fa-keyboard-o text-danger" aria-hidden="true"></i>
        </div>
        <div className="col-auto pt-1">
          <p className="text-danger ">6 Words</p>
        </div>
        <div className="col-auto pt-1">
          <i className="fa fa-code text-danger " aria-hidden="true"></i>
        </div>
        <div className="col-auto pt-1">
          <i className="fa fa-expand text-danger " aria-hidden="true"></i>
        </div>
        <div className="col-auto pt-1">
          <i className="fa fa-ellipsis-v " aria-hidden="true"></i>
        </div>
      </div>
      <br />
      <br />
      <p style={{ fontWeight: "bold" }}>Answers: </p>
      <br />
      {isMultipleChoice && (
        <div className="container">
          <div className="container">
            <ul className="list-group">
              {choices.map(
                (
                  choice: {
                    isCorrect: boolean | undefined;
                    text: string | number | readonly string[] | undefined;
                  },
                  index: number
                ) => (
                  <li key={index} className="list-group-item">
                    <div className="row py-5">
                      <div className="col-auto">
                        <input
                          className="form-check-input m-2"
                          type="radio"
                          id={`label-mcq-${index}`}
                          name="mcq"
                          checked={choice.isCorrect}
                          onChange={() => handleCorrectAnswerChange(index)}
                        />
                        <label
                          className="form-check-label pt-1"
                          htmlFor={`label-mcq-${index}`}
                        >
                          {choice.isCorrect ? (
                            <p>Correct Answer</p>
                          ) : (
                            <p>Possible Answer</p>
                          )}
                        </label>
                      </div>
                      <div className="col-auto">
                        <input
                          type="text"
                          className="form-control"
                          value={choice.text}
                          onChange={(e) =>
                            handleChoiceTextChange(index, e.target.value)
                          } // Handle choice text change
                        />
                      </div>
                      <div className="col">
                        <div className="row g-2 float-end">
                          <div className="col-6 pt-2">
                            <i className="fa fa-pencil" aria-hidden="true"></i>
                          </div>
                          <div className="col-3 pt-2">
                            <i
                              className="fa fa-trash-o"
                              aria-hidden="true"
                              onClick={() => handleDeleteChoice(index)}
                            ></i>{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              )}
            </ul>
            <button
              className="btn m-2 float-end border-0"
              onClick={handleAddChoice}
            >
              <div className="row">
                <div className="col-auto">
                  <i className="fa fa-plus text-danger" aria-hidden="true"></i>
                </div>
                <div className="col-auto">
                  <p className="text-danger">Add Another Answer</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
      {isFillInBlank && (
        <div className="container">
          <div className="container">
            <ul className="list-group">
              {blanks.map(
                (
                  blank: {
                    answer: string | number | readonly string[] | undefined;
                  },
                  index: number
                ) => (
                  <li key={index} className="list-group-item">
                    <div className="row py-5">
                      <div className="col-auto"></div>
                      <div className="col-auto">
                        <input
                          type="text"
                          className="form-control"
                          value={blank.answer}
                          onChange={(e) =>
                            handleBlankTextChange(index, e.target.value)
                          }
                        />
                      </div>
                      <div className="col">
                        <div className="row g-2 float-end">
                          <div className="col-6 pt-2">
                            <i className="fa fa-pencil" aria-hidden="true"></i>
                          </div>
                          <div className="col-3 pt-2">
                            <i
                              className="fa fa-trash-o"
                              aria-hidden="true"
                              onClick={() => handleDeleteBlank(index)}
                            ></i>{" "}
                            {/* Handle choice deletion */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              )}
            </ul>
            <button
              className="btn m-2 float-end border-0"
              onClick={handleAddBlank}
            >
              <div className="row">
                <div className="col-auto">
                  <i className="fa fa-plus text-danger" aria-hidden="true"></i>
                </div>
                <div className="col-auto">
                  <p className="text-danger">Add Another Blank</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
      {isTrueOrFalse && (
        <div className="container">
          <div className="container">
            <div className="p-2">
              <input
                className="form-check-input m-2"
                type="radio"
                id="label-t"
                name="tf"
                checked={question.trueFalse}
                onChange={(e) =>
                  dispatch(setQuestion({ ...question, trueFalse: true }))
                }
              ></input>
              <label className="form-check-label pt-1" htmlFor="label-t">
                True
              </label>
            </div>
            <br />
            <div className="p-2">
              <input
                className="form-check-input m-2"
                type="radio"
                id="label-t"
                name="tf"
                checked={!question.trueFalse}
                onChange={(e) =>
                  dispatch(setQuestion({ ...question, trueFalse: false }))
                }
              ></input>
              <label className="form-check-label pt-1" htmlFor="label-f">
                False
              </label>
            </div>
          </div>
        </div>
      )}

      <br />
      <br />
      <hr />
      <button className="btn btn-secondary m-2" onClick={handleCancel}>
        Cancel
      </button>
      {newQuestion && (
        <button className="btn btn-danger m-2" onClick={handleAddQuestion}>
          Save Question
        </button>
      )}
      {!newQuestion && (
        <button className="btn btn-danger m-2" onClick={handleAddQuestion}>
          Update Question
        </button>
      )}
    </div>
  );
}
