import axios from "axios";
import { Questions, QuestionType, Quiz } from "./interface";

const REMOTE_SERVER =
  process.env.REACT_APP_REMOTE_SERVER || "http://localhost:4000";
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;
const QUESTIONS_API = `${REMOTE_SERVER}/api/questions`;
const ANSWER_API = `${REMOTE_SERVER}/api/answers`;

export const updateQuiz = async (quiz: any) => {
  const response = await axios.put(`${QUIZZES_API}/${quiz._id}`, quiz);
  return response.data;
};

export const deleteQuiz = async (quizId: string) => {
  const response = await axios.delete(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

export const findQuizzesForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/quizzes`);
  return response.data;
};

export const createQuiz = async (courseId: string, quiz: any) => {
  const response = await axios.post(`${COURSES_API}/${courseId}/quizzes`, quiz);
  return response.data;
};

export const getQuizById = async (id: string) => {
  const response = await axios.get(`${QUIZZES_API}/${id}`);
  return response.data;
};

export const getAnswersByUser = async (qid: string, uid: string) => {
  const response = await axios.get(
    `${QUIZZES_API}/${qid}/users/${uid}/answers`
  );
  return response.data;
};

export const getQuestionsByQuiz = async (qid: string) => {
  const response = await axios.get(`${QUIZZES_API}/${qid}/questions`);
  return response.data;
};

export const createQuizAndQuestion = async (
  cid: string,
  quiz: Quiz,
  questionSet: Questions
) => {
  const response = await axios.post(`${COURSES_API}/${cid}/quizzes/questions`, {
    quiz: quiz,
    questionSet: questionSet,
  });
  return response.data;
};

export const updateQuizAndQuestion = async (
  qid: string,
  quiz: Quiz,
  questionSet: Questions
) => {
  const response = await axios.put(`${QUIZZES_API}/${qid}/questions`, {
    quiz: quiz,
    questionSet: questionSet,
  });
  return response.data;
};

export const getLatestAnswerByUser = async (quizId: string, userId: string) => {
  const response = await axios.get(
    `${QUIZZES_API}/${quizId}/users/${userId}/answers?latest=true`
  );
  return await response.data;
};

export const submitQuizAnswers = async (
  quizId: string,
  userId: string,
  answerSet: any
) => {
  const response = await axios.post(
    `${QUIZZES_API}/${quizId}/users/${userId}/answers`,
    answerSet
  );
  return response.data;
};

export const saveQuizAnswers = async (answerId: string, answerSet: any) => {
  const response = await axios.put(`${ANSWER_API}/${answerId}`, answerSet);
  return response.data;
};
