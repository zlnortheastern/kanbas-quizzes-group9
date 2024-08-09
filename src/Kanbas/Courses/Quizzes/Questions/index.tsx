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
import { GoTrash } from "react-icons/go";
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
    navigate(`Courses/${courseId}/Quizzes/${quizId}/questions`);
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

  const handleChoiceTextChange = (choiceId: string, value: any) => {
    const updatedChoices = choices.map((choice: { _id: string }) =>
      choice._id === choiceId ? { ...choice, choice: value } : choice
    );
    dispatch(setChoices(updatedChoices));
    dispatch(setQuestion({ ...question, choices: updatedChoices }));
  };

  const handleCorrectAnswerChange = (choiceId: string) => {
    const updatedChoices = choices.map((choice: { _id: string }) => ({
      ...choice,
      correct: choice._id === choiceId,
    }));
    dispatch(setChoices(updatedChoices));
    dispatch(setQuestion({ ...question, choices: updatedChoices }));
  };

  const handleDeleteChoice = (choiceId: string) => {
    dispatch(deleteChoice(choiceId));
    const updatedChoices = choices.filter(
      (choice: any) => choice._id !== choiceId
    );
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
    const blankToDelete = blanks[index];
    const updatedBlanks = blanks.filter((blank: any, i: number) => i !== index);
    dispatch(deleteBlank(blankToDelete.value));
    dispatch(setBlanks(updatedBlanks));
    dispatch(setQuestion({ ...question, blank: updatedBlanks }));
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

      {isMultipleChoice && (
        <div className="container">
          <small>
            Enter your question and multiple answers, then select the one
            correct answer.
          </small>

          <br />
          <br />
          <label htmlFor="input-1" className="form-label">
            <b>Question:</b>
          </label>

          <div
            className="d-flex justify-content-between"
            style={{ width: "100%" }}
          >
            <EditorProvider>
              <Editor
                value={question.question}
                onChange={(e) =>
                  dispatch(
                    setQuestion({ ...question, question: e.target.value })
                  )
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
          <p style={{ fontWeight: "bold" }}>Answers: </p>
          <br />
          <div className="container">
            <ul className="list-group">
              {choices.map(
                (choice: { _id: string; choice: string; correct: boolean }) => (
                  <li key={choice._id} className="list-group-item">
                    <div className="row py-5">
                      <div className="col-auto">
                        <input
                          className="form-check-input m-2"
                          type="radio"
                          id={`label-mcq-${choice._id}`}
                          name="mcq"
                          checked={choice.correct}
                          onChange={() => handleCorrectAnswerChange(choice._id)}
                        />
                        <label
                          className="form-check-label pt-1"
                          htmlFor={`label-mcq-${choice._id}`}
                        >
                          {choice.correct ? (
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
                          value={choice.choice}
                          onChange={(e) =>
                            handleChoiceTextChange(choice._id, e.target.value)
                          }
                        />
                      </div>
                      <div className="col-auto ">
                        <button
                          onClick={() => handleDeleteChoice(choice._id)}
                          className="btn btn-link p-0"
                          style={{ color: "inherit" }}
                        >
                          <GoTrash />
                        </button>
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
                  <p className="text-danger">+ Add Another Answer</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
      {isFillInBlank && (
        <div className="container">
          <small>
            Enter your question text, then define all possible correct answers
            for the blank.
          </small>
          <br />
          <small>
            Students will see the question followed by a small text box to type
            their answers.
          </small>
          <br />
          <br />
          <label htmlFor="input-1" className="form-label">
            <b>Question:</b>
          </label>

          <div
            className="d-flex justify-content-between"
            style={{ width: "100%" }}
          >
            <EditorProvider>
              <Editor
                value={question.question}
                onChange={(e) =>
                  dispatch(
                    setQuestion({ ...question, question: e.target.value })
                  )
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
          <p style={{ fontWeight: "bold" }}>Answers: </p>
          <br />
          <div className="container">
            <ul className="list-group">
              {blanks.map(
                (
                  blank: {
                    value: string;
                  },
                  index: number
                ) => (
                  <li key={index} className="list-group-item">
                    <div className="row py-5">
                      <div className="col-auto">
                        <label
                          className="form-check-label pt-1"
                          htmlFor={`label-mcq-${index}`}
                        >
                          Possible Answer:
                        </label>
                      </div>
                      <div className="col-auto">
                        <input
                          type="text"
                          className="form-control w-auto"
                          value={blank.value}
                          onChange={(e) =>
                            handleBlankTextChange(index, e.target.value)
                          }
                        />
                      </div>
                      <div className="col-auto">
                        <button
                          onClick={() => handleDeleteBlank(index)}
                          className="btn btn-link p-0"
                          style={{ color: "inherit" }}
                        >
                          <GoTrash />
                        </button>
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
                  <p className="text-danger">+ Add Another Answer</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
      {isTrueOrFalse && (
        <div className="container">
          <small>
            Enter your question text, then select if True or False is the
            correct answer.
          </small>

          <br />
          <br />
          <label htmlFor="input-1" className="form-label">
            <b>Question:</b>
          </label>

          <div
            className="d-flex justify-content-between"
            style={{ width: "100%" }}
          >
            <EditorProvider>
              <Editor
                value={question.question}
                onChange={(e) =>
                  dispatch(
                    setQuestion({ ...question, question: e.target.value })
                  )
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
          <p style={{ fontWeight: "bold" }}>Answers: </p>
          <br />
          <div className="container">
            <div className="p-2">
              <input
                className="form-check-input m-2"
                type="radio"
                id="label-t"
                name="tf"
                checked={question.true_or_false}
                onChange={(e) =>
                  dispatch(setQuestion({ ...question, true_or_false: true }))
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
                checked={!question.true_or_false}
                onChange={(e) =>
                  dispatch(setQuestion({ ...question, true_or_false: false }))
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

      <Link
        to={`/Kanbas/Courses/${courseId}/Quizzes/${quizId}/Questions`}
        className="btn btn-secondary m-2 "
      >
        Cancel
      </Link>
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
