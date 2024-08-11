import { useDispatch, useSelector } from "react-redux";
import "./index.css";
import { useEffect, useState } from "react";
import { QuestionType, Question } from "../interface";
import { setQuestion } from "./questionsReducer";
import { setChoices, addChoice, deleteChoice } from "./choicesReducer";
import { setBlanks, addBlank, deleteBlank } from "./blanksReducer";
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
  initialQuestion: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

export default function QuestionForm({
  initialQuestion,
  onSave,
  onCancel,
}: QuestionFormProps) {
  const dispatch = useDispatch();
  const choices = useSelector((state: any) => state.choicesReducer.choices);
  const blanks = useSelector((state: any) => state.blanksReducer.blanks);

  const [isMultipleChoice, setIsMultipleChoice] = useState(true);
  const [isFillInBlank, setIsFillInBlank] = useState(false);
  const [isTrueOrFalse, setIsTrueOrFalse] = useState(false);

  const [question, setLocalQuestion] = useState(
    initialQuestion || {
      type: QuestionType.multipleChoice,
      title: "",
      points: 0,
      question: "",
      true_or_false: true,
      choices: [],
      blank: [],
    }
  );

  useEffect(() => {
    if (initialQuestion) {
      setLocalQuestion(initialQuestion);
      dispatch(setChoices(initialQuestion.choices || []));
      dispatch(
        setBlanks(initialQuestion.blank?.map((value) => ({ value })) || [])
      );

      switch (initialQuestion.type) {
        case QuestionType.multipleChoice:
          setIsMultipleChoice(true);
          setIsFillInBlank(false);
          setIsTrueOrFalse(false);
          break;
        case QuestionType.trueOrFalse:
          setIsMultipleChoice(false);
          setIsFillInBlank(false);
          setIsTrueOrFalse(true);
          break;
        case QuestionType.fillInBlank:
          setIsMultipleChoice(false);
          setIsFillInBlank(true);
          setIsTrueOrFalse(false);
          break;
        default:
          console.error("Unknown question type");
      }
    }
  }, [initialQuestion, dispatch]);

  const handleSave = async () => {
    if (onSave) {
      onSave(question);
    }
  };

  const handleAddChoice = () => {
    const newChoice = {
      _id: `${Date.now()}`,
      choice: "",
      correct: false,
    };
    dispatch(addChoice(newChoice));
    const updatedChoices = [...(question.choices || []), newChoice];
    setLocalQuestion({ ...question, choices: updatedChoices });
  };

  const handleChoiceTextChange = (choiceId: string, value: any) => {
    const updatedChoices = choices.map((choice: { _id: string }) =>
      choice._id === choiceId ? { ...choice, choice: value } : choice
    );
    dispatch(setChoices(updatedChoices));
    setLocalQuestion({ ...question, choices: updatedChoices });
  };

  const handleCorrectAnswerChange = (choiceId: string) => {
    const updatedChoices = choices.map((choice: { _id: string }) => ({
      ...choice,
      correct: choice._id === choiceId,
    }));
    dispatch(setChoices(updatedChoices));
    setLocalQuestion({ ...question, choices: updatedChoices });
  };

  const handleDeleteChoice = (choiceId: string) => {
    dispatch(deleteChoice(choiceId));
    const updatedChoices = (question.choices || []).filter(
      (choice: any) => choice._id !== choiceId
    );
    setLocalQuestion({ ...question, choices: updatedChoices });
  };

  const handleAddBlank = () => {
    const newBlank = { value: "" };
    const updatedBlanks = [...blanks, newBlank];
    dispatch(addBlank(newBlank));
    setLocalQuestion({ ...question, blank: updatedBlanks });
  };

  const handleBlankTextChange = (index: number, value: any) => {
    const updatedBlanks = blanks.map((blank: any, i: number) =>
      i === index ? { ...blank, value: value } : blank
    );
    dispatch(setBlanks(updatedBlanks));
    setLocalQuestion({ ...question, blank: updatedBlanks });
  };

  const handleDeleteBlank = (index: number) => {
    const blankToDelete = blanks[index];
    const updatedBlanks = blanks.filter((blank: any, i: number) => i !== index);
    dispatch(deleteBlank(blankToDelete.value));
    setLocalQuestion({ ...question, blank: updatedBlanks });
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
              setLocalQuestion({ ...question, title: e.target.value })
            }
            className="form-control "
            //style={{ width: `${question.title.length || 10}ch` }}
          />
        </div>
        <div className="col-3">
          <select
            className="form-select select-auto-width"
            value={question.type}
            onChange={(e) => {
              const newType = e.target.value as QuestionType;
              setLocalQuestion({ ...question, type: newType });
              if (newType === QuestionType.multipleChoice) {
                setIsMultipleChoice(true);
                setIsTrueOrFalse(false);
                setIsFillInBlank(false);
              } else if (newType === QuestionType.trueOrFalse) {
                setIsMultipleChoice(false);
                setIsTrueOrFalse(true);
                setIsFillInBlank(false);
              } else if (newType === QuestionType.fillInBlank) {
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
                  setLocalQuestion({
                    ...question,
                    points: parseInt(e.target.value),
                  })
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
                  setLocalQuestion({ ...question, question: e.target.value })
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
                  setLocalQuestion({ ...question, question: e.target.value })
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
                  setLocalQuestion({ ...question, question: e.target.value })
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
                  setLocalQuestion({ ...question, true_or_false: true })
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
                  setLocalQuestion({ ...question, true_or_false: false })
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

      <button className="btn btn-secondary m-2" onClick={onCancel}>
        Cancel
      </button>
      <button className="btn btn-danger m-2" onClick={handleSave}>
        {initialQuestion ? "Update Question" : "Save Question"}
      </button>
    </div>
  );
}
