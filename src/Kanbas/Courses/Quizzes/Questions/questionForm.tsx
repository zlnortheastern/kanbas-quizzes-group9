import "./index.css";
import { useState } from "react";
import { QuestionType, Question, Choice } from "../interface";
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

interface QuestionFormProps {
  index: number;
  editing: boolean;
  question: Question;
  onQuestionChange: (index: number, question: Question) => void;
  deleteQuestion: (index: number) => void;
}

export default function QuestionForm({
  index,
  editing,
  question,
  onQuestionChange,
  deleteQuestion,
}: QuestionFormProps) {
  const [current, setCurrent] = useState<Question>(question);
  const [isEditing, setIsEditing] = useState<boolean>(editing);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedCurrent = { ...current, [e.target.name]: e.target.value };
    setCurrent(updatedCurrent);
  };

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedCurrent = { ...current, [e.target.name]: e.target.value };
    setCurrent(updatedCurrent);
  };

  const handleChoiceCorrectChange = (index: number) => {
    const updatedChoices = current.choices?.map((choice, i) =>
      i === index ? { ...choice, correct: true } : { ...choice, correct: false }
    );
    const updatedCurrent = { ...current, choices: updatedChoices };
    setCurrent(updatedCurrent);
  };

  const handleChoiceChange = (index: number, value: string) => {
    const updatedChoices = current.choices?.map((choice, i) =>
      i === index ? { ...choice, choice: value } : choice
    );
    const updatedCurrent = { ...current, choices: updatedChoices };
    setCurrent(updatedCurrent);
  };

  const handleBlankChange = (index: number, value: string) => {
    const updatedBlanks = current.blank?.map((blank, i) =>
      i === index ? value : blank
    );
    const updatedCurrent = { ...current, blank: updatedBlanks };
    setCurrent(updatedCurrent);
  };

  const handleTrueFalseChange = (value: boolean) => {
    const updatedCurrent = { ...current, true_or_false: value };
    setCurrent(updatedCurrent);
  };

  return (
    <div key={index}>
      {isEditing ? (
        <div
          className="mx-3 mb-4 border border-secondary"
          style={{ padding: "0", position: "relative", width: "100%" }}
        >
          {/* Quesiton editor header */}
          <div className="row m-3">
            <div className="col-3">
              <input
                placeholder="Question Title"
                type="text"
                value={current.title}
                name="title"
                onChange={onInputChange}
                className="form-control "
                //style={{ width: `${question.title.length || 10}ch` }}
              />
            </div>
            <div className="col-3">
              <select
                className="form-select select-auto-width"
                value={current.type}
                name="type"
                onChange={onSelectChange}
              >
                <option value={QuestionType.multipleChoice}>
                  Multiple Choice
                </option>
                <option value={QuestionType.trueOrFalse}>True/False</option>
                <option value={QuestionType.fillInBlank}>
                  Fill in the blanks
                </option>
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
                    name="points"
                    value={current.points}
                    onChange={(e) => {
                      setCurrent({
                        ...current,
                        points: parseInt(e.target.value),
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <hr />

          <div className="container">
            {/* Question tips by type */}
            <>
              {current.type === QuestionType.multipleChoice && (
                <>
                  <small>
                    Enter your question and multiple answers, then select the
                    one correct answer.
                  </small>
                </>
              )}
              {current.type === QuestionType.fillInBlank && (
                <>
                  <small>
                    Enter your question text, then define all possible correct
                    answers for the blank.
                  </small>
                  <br />
                  <small>
                    Students will see the question followed by a small text box
                    to type their answers.
                  </small>
                </>
              )}
              {current.type === QuestionType.trueOrFalse && (
                <>
                  <small>
                    Enter your question text, then select if True or False is
                    the correct answer.
                  </small>
                </>
              )}
            </>

            {/* Question description editor */}
            <>
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
                    value={current.question}
                    onChange={(e) => {
                      //console.log(e.target.value);
                      const updatedCurrent = {
                        ...current,
                        question: e.target.value,
                      };
                      //console.log(updatedCurrent);
                      setCurrent(updatedCurrent);
                    }}
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
              <p className="pt-2 border-top" style={{ fontWeight: "bold" }}>
                Answers:{" "}
              </p>
              <br />
            </>

            {/* Question answer by type */}
            {current.type === QuestionType.multipleChoice && (
              <div className="container">
                <ul className="list-group">
                  {current.choices?.map((choice: Choice, i) => (
                    <li key={choice._id} className="list-group-item">
                      <div className="row py-5">
                        <div className="col-auto">
                          <input
                            className="form-check-input m-2"
                            type="radio"
                            id={`label-mcq-${choice._id}`}
                            name="mcq"
                            checked={choice.correct}
                            onChange={() => handleChoiceCorrectChange(i)}
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
                              handleChoiceChange(i, e.target.value)
                            }
                          />
                        </div>
                        <div className="col-auto ">
                          <button
                            onClick={() => {
                              const updatedChoices = current.choices?.filter(
                                (_, id) => id !== i
                              );
                              const updatedCurrent = {
                                ...current,
                                choices: updatedChoices,
                              };
                              setCurrent(updatedCurrent);
                            }}
                            className="btn btn-link p-0"
                            style={{ color: "inherit" }}
                          >
                            <GoTrash />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  className="btn m-2 float-end border-0"
                  onClick={() => {
                    const newChoice: Choice = {
                      _id: `${current.choices?.length}`,
                      choice: "",
                      correct: false,
                    };
                    const updatedChoices = [
                      ...(current.choices || []),
                      newChoice,
                    ];
                    const updatedCurrent = {
                      ...current,
                      choices: updatedChoices,
                    };
                    setCurrent(updatedCurrent);
                  }}
                >
                  <div className="row">
                    <div className="col-auto">
                      <i
                        className="fa fa-plus text-danger"
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div className="col-auto">
                      <p className="text-danger">+ Add Another Answer</p>
                    </div>
                  </div>
                </button>
              </div>
            )}
            {current.type === QuestionType.fillInBlank && (
              <div className="container">
                <ul className="list-group">
                  {current.blank?.map((blank, i) => (
                    <li key={i} className="list-group-item">
                      <div className="row py-5">
                        <div className="col-auto">
                          <label
                            className="form-check-label pt-1"
                            htmlFor={`label-mcq-${i}`}
                          >
                            Possible Answer:
                          </label>
                        </div>
                        <div className="col-auto">
                          <input
                            type="text"
                            className="form-control w-auto"
                            value={blank || ""}
                            onChange={(e) => {
                              handleBlankChange(i, e.target.value);
                            }}
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            onClick={() => {
                              const updatedBlanks = current.blank?.filter(
                                (_, _i) => _i !== i
                              );
                              const updatedCurrent = {
                                ...current,
                                blank: updatedBlanks,
                              };
                              setCurrent(updatedCurrent);
                            }}
                            className="btn btn-link p-0"
                            style={{ color: "inherit" }}
                          >
                            <GoTrash />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  className="btn m-2 float-end border-0"
                  onClick={() => {
                    const updatedBlanks = [...(current.blank || []), ""];
                    const updatedCurrent = { ...current, blank: updatedBlanks };
                    setCurrent(updatedCurrent);
                  }}
                >
                  <div className="row">
                    <div className="col-auto">
                      <i
                        className="fa fa-plus text-danger"
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div className="col-auto">
                      <p className="text-danger">+ Add Another Answer</p>
                    </div>
                  </div>
                </button>
              </div>
            )}
            {current.type === QuestionType.trueOrFalse && (
              <div className="container">
                <div className="p-2">
                  <input
                    className="form-check-input m-2"
                    type="radio"
                    id="label-t"
                    name="tf"
                    checked={current.true_or_false}
                    onChange={() => handleTrueFalseChange(true)}
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
                    checked={!current.true_or_false}
                    onChange={() => handleTrueFalseChange(false)}
                  ></input>
                  <label className="form-check-label pt-1" htmlFor="label-f">
                    False
                  </label>
                </div>
              </div>
            )}
          </div>
          <br />
          <br />
          <div className="border-top">
            <button
              className="btn btn-secondary m-2"
              onClick={() => {
                setCurrent(question);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>

            <button
              className="btn btn-danger m-2"
              onClick={() => {
                setIsEditing(false);
                onQuestionChange(index, current);
              }}
            >
              Update Question
            </button>
          </div>
        </div>
      ) : (
        <div
          className="mx-3 mb-4 border border-secondary"
          style={{ padding: "0", position: "relative", width: "100%" }}
        >
          <div
            className="p-3 border-bottom border-secondary"
            style={{ backgroundColor: "#f5f5f5", width: "100%" }}
          >
            <div className="float-end font-color-secondary">
              {current.points} pts
            </div>
            <div className="fw-bold">Question {index + 1}</div>
          </div>
          <div style={{ width: "100%" }}>
            <div id="question-description" className="p-4 my-3">
              <div className="mb-2">{current.question}</div>
              <button
                className="btn btn-danger btn-sm float-end ms-3"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm float-end"
                onClick={() => deleteQuestion(index)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
