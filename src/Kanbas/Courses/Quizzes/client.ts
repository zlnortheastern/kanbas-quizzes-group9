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

export const getQuestionByIndex = async (
  quizId: string,
  questionIndex: number
) => {
  const response = await axios.get(
    `${QUESTIONS_API}/${quizId}/question/${questionIndex}`
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

export const updateQuestion = async (
  quizId: string,
  question: any,
  index: number
) => {
  const response = await axios.put(
    `${QUESTIONS_API}/${quizId}/update/${index}`,
    question
  );
  return response.data;
};

export const deleteQuestion = async (quizId: string, questionIndex: number) => {
  const response = await axios.delete(
    `${QUESTIONS_API}/${quizId}/delete/${questionIndex}`
  );
  return response.data;
};

export const addChoiceToQuestion = async (
  quizId: string,
  questionIndex: number,
  newChoice: any
) => {
  const response = await axios.post(
    `${QUESTIONS_API}/${quizId}/question/${questionIndex}/choices`,
    newChoice
  );
  return response.data;
};

export const deleteChoiceFromQuestion = async (
  quizId: string,
  questionIndex: number,
  choiceId: any
) => {
  const response = await axios.delete(
    `${QUESTIONS_API}/${quizId}/question/${questionIndex}/choices/${choiceId}`
  );
  return response.data;
};

export const addBlankToQuestion = async (
  quizId: string,
  questionIndex: number,
  newAnswer: any
) => {
  const response = await axios.post(
    `${QUESTIONS_API}/${quizId}/question/${questionIndex}/blank`,
    { answer: newAnswer }
  );
  return response.data;
};

export const deleteBlankFromQuestion = async (
  quizId: string,
  questionIndex: number,
  answer: any
) => {
  const response = await axios.delete(
    `${QUESTIONS_API}/${quizId}/question/${questionIndex}/blank/${answer}`
  );
  return response.data;
};

export const getLatestAnswerByUser = async (quizId: string, userId: string) => {
  const response = await axios.get(`${QUIZZES_API}/${quizId}/users/${userId}/answers?latest=true`);
  return await response.data;
};


export const submitQuizAnswers = async (quizId: string, userId: string, answerSet: any) => {
  const response = await axios.post(`${QUIZZES_API}/${quizId}/users/${userId}/answers`, answerSet);
  return response.data;
};
