import * as todoService from "../../services/todo.service.js";
import * as userService from "../../services/user.service.js";

export default {
  createTodo: (_, args) =>
    todoService.createTodo({ ...args, completed: args.completed ?? false }),

  updateTodo: (_, { id, ...rest }) =>
    todoService.updateTodo(id, rest),

  deleteTodo: async (_, { id }) => {
    await todoService.deleteTodo(id);
    return { success: true, message: "Deleted" };
  },

  createUser: (_, args) => userService.createUser(args),
};
