import axios from "axios";

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

export const getQuestionsByQuiz = async (qid: string) => {
  const response = await axios.get(`${QUIZZES_API}/${qid}/questions`);
  return response.data;
};
export const getQuestions = async (qid: string) => {
  const response = await axios.get(`${QUESTIONS_API}/${qid}`);
  return response.data;
};
export const getAnswersByUser = async (qid: string, uid: string) => {
  const response = await axios.get(
    `${QUIZZES_API}/${qid}/users/${uid}/answers`
  );
  return response.data;
};

export const deleteQuestion = async (questionId: string) => {
  const response = await axios.delete(`${QUESTIONS_API}/${questionId}`);
  return response.data;
};

export const createQuestion = async (quizId: string, question: any) => {
  const response = await axios.post(
    `${QUIZZES_API}/${quizId}/questions`,
    question
  );
  return response.data;
};

export const updateQuestion = async (quizId: string, question: any) => {
  const response = await axios.put(
    `${QUESTIONS_API}/${question._id}`,
    question
  );
  return response.data;
};
