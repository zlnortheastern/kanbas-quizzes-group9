import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getQuizById } from './client'; 
import { setQuizzes } from './reducer';
import { FaPencil } from "react-icons/fa6";

export default function QuizDetails() {
  const { qid } = useParams<{ qid: string }>();
  console.log("qid: " + qid);
  const dispatch = useDispatch();
  const quiz = useSelector((state: any) =>
    state.quizzesReducer.quizzes.find((q: any) => q._id === qid)
  );
  console.log("quiz: " + quiz);
  
  useEffect(() => {
    if (!quiz) {
      const fetchQuiz = async () => {
        try {
          const data = await getQuizById(qid as string);
          dispatch(setQuizzes([data])); 
        } catch (error) {
          console.error("Failed to fetch quiz", error);
        }
      };

      fetchQuiz();
    }
  }, [qid, quiz, dispatch]);

  if (!quiz) {
    return <div>Loading...</div>;
  }  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    const formattedDate = date.toLocaleString('en-US', options);
    return formattedDate.replace(',', ' at').replace(':00 ', '').replace('AM', "am").replace('PM', 'pm');
  };
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center mb-4">
        <Link to={`preview`} className="btn btn-secondary me-2">Preview</Link>
        <Link  to={`edit`} className="btn btn-secondary"id="wd-quiz-edit-btn" >
          <FaPencil className="position-relative me-2" style={{transform: 'rotate(270deg)', bottom: "2px"}}  />
          Edit
        </Link>
        
      </div>
      <hr/>
      <h1 className="text-start pe-3 mt-2">{quiz.title}</h1>
      <div>
        <ul className="row">
          {[
              { label: 'Quiz Type', value: quiz.quizType },
              { label: 'Points', value: quiz.points },
              { label: 'Assignment Group', value: quiz.assignmentGroup },
              { label: 'Shuffle Answers', value: quiz.shuffleAnswers ? "Yes" : "No" },
              { label: 'Time Limit', value: `${quiz.timeLimit} Minutes` },
              { label: 'Multiple Attempts', value: quiz.multipleAttempts ? "Yes" : "No" },
              { label: 'Attempt Limit', value: quiz.attemptLimit },
              { label: 'Show Correct Answers', value: quiz.showCorrectAnswers },
              { label: 'Access Code', value: quiz.accessCode || "None" },
              { label: 'One Question at a Time', value: quiz.oneQuestionAtATime ? "Yes" : "No" },
              { label: 'Webcam Required', value: quiz.webcamRequired ? "Yes" : "No" },
              { label: 'Lock Questions After Answering', value: quiz.lockQuestionsAfterAnswering ? "Yes" : "No" },
             ].map((item, index) => (
              <li key={index} className="col-12 d-flex justify-content-start py-2">
                <span className="col-3 fw-bold text-end pe-3">{item.label} </span>
                <span className="col-9 text-start" >{item.value}</span>
              </li>
            ))}
        </ul>
      </div>
      <table className="table mt-4 pe-4">
        <thead>
          <tr>
            <th>Due</th>
            <th>For</th>
            <th>Available from</th>
            <th>Until</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formatDate(new Date(quiz.dueDate).toLocaleString())}</td>
            <td>Everyone</td>
            <td>{formatDate(new Date(quiz.availableDate).toLocaleString())}</td>
            <td>{formatDate(new Date(quiz.availableUntilDate).toLocaleString())}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}