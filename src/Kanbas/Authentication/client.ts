import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const USERS_API = `${REMOTE_SERVER}/api/users`;
export const updateUser = async (user: any) => {
  const response = await axios.put(`${USERS_API}/update/${user._id}`, user);
  return response.data;
};
export const getUser = async (userId: string) => {
  const response = await axios.get(`${USERS_API}/get/${userId}`);
  return response.data;
};
export const authUser = async (userInput: any) => {
  try {
    const response = await axios.post(`${USERS_API}/signin`, userInput);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const createUser = async (user: any) => {
  try {
    const response = await axios.post(`${USERS_API}/signup`, user);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
