import * as todoService from "../../services/todo.service.js";
import * as userService from "../../services/user.service.js";

export default {
  createTodo: (_, args) =>
    todoService.createTodo({ ...args, completed: args.completed ?? false }),

  updateTodo: (_, { id, ...rest }) =>
    todoService.updateTodo(id, rest),

 

  createUser: (_, args) => userService.createUser(args),
};
