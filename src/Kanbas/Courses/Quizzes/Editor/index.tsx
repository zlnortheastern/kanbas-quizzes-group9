import React, { useEffect, useState } from "react";
import { Questions, Quiz, ShowAnswerType } from "../interface";
import { useNavigate, useParams } from "react-router";
import * as client from "../client";
import { FaBan } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import EditDetails from "./editDetails";
import EditQuestions from "./editQuestions";
import { Link } from "react-router-dom";
import { calculateQuizPoints } from "../../../util";
import GreenCheckmark from "../../Modules/GreenCheckmark";

const initialQuiz = {
  _id: "",
  title: "",
  description: "",
  quizType: "Graded Quiz",
  points: 0,
  assignmentGroup: "Quizzes",
  shuffleAnswers: true,
  timeLimit: 20,
  multipleAttempts: false,
  attemptLimit: 1,
  showCorrectAnswers: ShowAnswerType.immediately,
  accessCode: "",
  oneQuestionAtATime: true,
  webcamRequired: false,
  lockQuestionsAfterAnswering: false,
  dueDate: "",
  availableDate: "",
  availableUntilDate: "",
  lastModified: "",
  course: "",
  published: false,
};

const initialQuestionSet = {
  _id: "",
  quiz: "",
  questions: [],
};
export default function Editor() {
  const { cid, qid } = useParams();
  const [quiz, setQuiz] = useState<Quiz>(initialQuiz);
  const [questionSet, setQuestionSet] = useState<Questions>(initialQuestionSet);
  const [isDetails, setIsDetail] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchQuiz = async () => {
    if (qid !== "new") {
      const data = qid ? await client.getQuizById(qid) : {};
      setQuiz(data);
    }
  };

  const fetchQuestionSet = async () => {
    if (qid !== "new") {
      const questionSet = qid ? await client.getQuestionsByQuiz(qid) : {};
      setQuestionSet(questionSet);
    }
    setLoading(false);
  };

  const handleSave = async (published: any) => {
    if (qid && cid) {
      if (qid === "new") {
        const data = await client.createQuizAndQuestion(
          cid,
          { ...quiz, published: published },
          questionSet
        );
        navigate(`/Kanbas/Courses/${cid}/Quizzes/${data.createdQuiz._id}`);
      } else {
        await client.updateQuizAndQuestion(
          qid,
          { ...quiz, published: published },
          questionSet
        );
        navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}`);
      }
    }
  };

  const changeQuiz = (updatedQuiz: Quiz) => {
    setQuiz(updatedQuiz);
  };

  const changeQuestionSet = (updatedQuestionSet: Questions) => {
    setQuiz({ ...quiz, points: calculateQuizPoints(updatedQuestionSet) });
    setQuestionSet(updatedQuestionSet);
  };

  useEffect(() => {
    fetchQuiz();
    fetchQuestionSet();
  }, []);

  console.log(questionSet);
  if (loading) return <></>;
  return (
    <div className="me-2">
      <div className="float-end mt-2">
        Points {quiz ? quiz.points : 0} &nbsp; &nbsp;
        {quiz?.published ? (
          <GreenCheckmark aria-hidden="true" />
        ) : (
          <FaBan style={{ color: "grey" }} aria-hidden="true" />
        )}
        &nbsp;
        {quiz?.published ? "Published" : "Not Published"}&nbsp; &nbsp;
        <button type="button" className="btn btn-light ">
          <IoEllipsisVertical />
        </button>
      </div>
      <br />
      <br />
      <hr />
      <div className="nav nav-tabs">
        <button
          className={isDetails ? "nav-link active" : "nav-link"}
          onClick={() => setIsDetail(true)}
        >
          Details
        </button>
        <button
          className={isDetails ? "nav-link" : "nav-link active"}
          onClick={() => setIsDetail(false)}
        >
          Questions
        </button>
      </div>

      {isDetails ? (
        <EditDetails quiz={quiz} changeQuiz={changeQuiz} />
      ) : (
        <EditQuestions
          questionSet={questionSet}
          changeQuestionSet={changeQuestionSet}
        />
      )}

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
          to={`/Kanbas/Courses/${cid}/Quizzes/${qid}`}
          className="btn btn-secondary ms-2 mb-4 float-end"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
