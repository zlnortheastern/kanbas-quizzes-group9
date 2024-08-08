import axios from "axios";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER  || "http://localhost:4000";
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;

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

export const getQuestionsByQuizId = async (quizId: string) => {
  const response = await axios.get(`${QUIZZES_API}/${quizId}/questions`);
  return response.data;
};

export const getAnswersByQuizAndUser = async (quizId: string, userId: string) => {
  const response = await axios.get(`${QUIZZES_API}/${quizId}/users/${userId}/answers`);
  return response.data;
};

export const submitQuizAnswers = async (quizId: string, userId: string, answerSet: any) => {
  const response = await axios.post(`${QUIZZES_API}/${quizId}/users/${userId}/answers`, answerSet);
  return response.data;
};