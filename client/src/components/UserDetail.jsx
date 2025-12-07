import { useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../graphql/queries';

export default function UserDetail({ userId }) {
  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { id: userId },
  });

  if (loading) return <p>Loading user...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const user = data.getUserById;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <h3>Todos:</h3>
      <ul>
        {user.todos.map((todo) => (
          <li key={todo.id}>
            {todo.title} - {todo.completed ? '✅' : '❌'}
          </li>
        ))}
      </ul>
    </div>
  );
}