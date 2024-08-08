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

export const getQuestions = async (qid: string) => {
  const response = await axios.get(`${QUESTIONS_API}/${qid}`);
  return response.data;
};

export const getQuestionByTitle = async (
  quizId: string,
  questionTitle: string
) => {
  const response = await axios.get(
    `${QUESTIONS_API}/${quizId}/question/${questionTitle}`
  );
  return response.data;
};

export const addQuestionToQuiz = async (quizId: string, newQuestion: any) => {
  const response = await axios.post(
    `${QUESTIONS_API}/${quizId}/add`,
    newQuestion
  );
  return response.data;
};

export const updateQuestion = async (quizId: string, question: any) => {
  const response = await axios.put(
    `${QUESTIONS_API}/${quizId}/update/${question.title}`,
    question
  );
  return response.data;
};

export const deleteQuestion = async (quizId: string, questionTitle: string) => {
  const response = await axios.delete(
    `${QUESTIONS_API}/${quizId}/delete/${questionTitle}`
  );
  return response.data;
};

export const addChoiceToQuestion = async (
  quizId: any,
  questionTitle: any,
  newChoice: any
) => {
  const response = await axios.post(
    `${QUESTIONS_API}/${quizId}/question/${questionTitle}/choices`,
    newChoice
  );
  return response.data;
};

export const deleteChoiceFromQuestion = async (
  quizId: any,
  questionTitle: any,
  choiceId: any
) => {
  const response = await axios.delete(
    `${QUESTIONS_API}/${quizId}/question/${questionTitle}/choices/${choiceId}`
  );
  return response.data;
};

export const addBlankToQuestion = async (
  quizId: any,
  questionTitle: any,
  newAnswer: any
) => {
  const response = await axios.post(
    `${QUESTIONS_API}/${quizId}/question/${questionTitle}/blank`,
    { answer: newAnswer }
  );
  return response.data;
};

export const deleteBlankFromQuestion = async (
  quizId: any,
  questionTitle: any,
  answer: any
) => {
  const response = await axios.delete(
    `${QUESTIONS_API}/${quizId}/question/${questionTitle}/blank/${answer}`
  );
  return response.data;
};
