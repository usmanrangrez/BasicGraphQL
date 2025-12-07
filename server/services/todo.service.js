import axios from "../utils/axios.js";

export const getTodos = async () => {
  const { data } = await axios.get("/todos");
  return data;
};

export const createTodo = async (payload) => {
  const { data } = await axios.post("/todos", payload);
  return data;
};

export const updateTodo = async (id, payload) => {
  const { data } = await axios.patch(`/todos/${id}`, payload);
  return data;
};

export const deleteTodo = async (id) => {
  await axios.delete(`/todos/${id}`);
  return true;
};
