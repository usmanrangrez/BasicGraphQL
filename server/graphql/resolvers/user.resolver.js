import { getUserTodos } from "../../services/user.service.js";

export default {
  todos: (parent) => getUserTodos(parent.id),
};
