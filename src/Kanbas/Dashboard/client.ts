import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;
export const getEnrollments = async (userId: string) => {
  const response = await axios.get(`${ENROLLMENTS_API}/${userId}`);
  return response.data;
};
export const getEnrollables = async (userId: string) => {
  const response = await axios.get(`${ENROLLMENTS_API}/${userId}/enrollable`);
  return response.data;
};
export const dropEnrollment = async (userId: string, courseId: string) => {
  const response = await axios.delete(
    `${ENROLLMENTS_API}/${userId}/${courseId}`
  );
  return response.data;
};
export const enrollCourse = async (userId: string, courseId: string) => {
  const response = await axios.post(`ENROLLMENTS_API/${userId}/${courseId}`);
  return response.data;
};
