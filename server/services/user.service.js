import axios from "../utils/axios.js";

export const getAllUsers = async () => {
  const { data } = await axios.get("/users");
  return data;
};

export const getUserById = async (id) => {
  const { data } = await axios.get(`/users/${id}`);
  return data;
};

export const getUserTodos = async (userId) => {
  const { data } = await axios.get(`/todos?userId=${userId}`);
  return data;
};

export const createUser = async (payload) => {
  const { data } = await axios.post("/users", payload);
  return data;
};
