import { useMutation } from '@apollo/client';
import { UPDATE_TODO, DELETE_TODO } from '../graphql/mutations';
import { GET_TODOS } from '../graphql/queries';

export default function TodoItem({ todo }) {
  const [updateTodo] = useMutation(UPDATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const toggleComplete = () => {
    updateTodo({
      variables: { id: todo.id, completed: !todo.completed },
    });
  };

  const handleDelete = () => {
    deleteTodo({ variables: { id: todo.id } });
  };

  return (
    <div>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={toggleComplete}
      />
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.title}
      </span>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}