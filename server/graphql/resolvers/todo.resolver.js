import { getUserById } from "../../services/user.service.js";

export default {
  user: (parent) => getUserById(parent.userId),
};
