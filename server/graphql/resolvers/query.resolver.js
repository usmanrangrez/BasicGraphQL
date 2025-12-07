import * as userService from "../../services/user.service.js";
import * as todoService from "../../services/todo.service.js";

export default {
  getTodos: () => todoService.getTodos(),
  getAllUsers: () => userService.getAllUsers(),
  getUserById: (_, { id }) => userService.getUserById(id),
};
