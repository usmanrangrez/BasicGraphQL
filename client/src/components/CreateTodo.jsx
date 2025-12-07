import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_TODO } from '../graphql/mutations';
import { GET_TODOS } from '../graphql/queries';

export default function CreateTodo() {
  const [title, setTitle] = useState('');
  const [createTodo, { loading, error }] = useMutation(CREATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }], // Auto-refresh todo list
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTodo({
        variables: { title, completed: false, userId: '1' },
      });
      setTitle('');
      alert('Todo created!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New todo..."
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Add Todo'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}