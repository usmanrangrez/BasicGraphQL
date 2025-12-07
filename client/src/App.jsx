import { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

// GraphQL Queries
const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      username
      email
      phone
      website
    }
  }
`;

const GET_TODOS = gql`
  query GetTodos {
    getTodos {
      id
      title
      completed
      userId
      user {
        name
        email
      }
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      name
      email
      username
      phone
      website
      todos {
        id
        title
        completed
      }
    }
  }
`;

// GraphQL Mutations
const CREATE_TODO = gql`
  mutation CreateTodo($title: String!, $completed: Boolean, $userId: ID) {
    createTodo(title: $title, completed: $completed, userId: $userId) {
      id
      title
      completed
      userId
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $title: String, $completed: Boolean) {
    updateTodo(id: $id, title: $title, completed: $completed) {
      id
      title
      completed
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      success
      message
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!, $username: String!) {
    createUser(name: $name, email: $email, username: $username) {
      id
      name
      email
      username
    }
  }
`;

function App() {
  const [activeTab, setActiveTab] = useState('todos');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newTodo, setNewTodo] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', username: '' });

  // Queries
  const { loading: todosLoading, error: todosError, data: todosData } = useQuery(GET_TODOS);
  const { loading: usersLoading, error: usersError, data: usersData } = useQuery(GET_ALL_USERS);
  const { data: userDetailData } = useQuery(GET_USER_BY_ID, {
    variables: { id: selectedUserId },
    skip: !selectedUserId,
  });

  // Mutations
  const [createTodo] = useMutation(CREATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const [updateTodo] = useMutation(UPDATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const [createUser] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_ALL_USERS }],
  });

  // Handlers
  const handleCreateTodo = async () => {
    if (!newTodo.trim()) return;
    
    try {
      await createTodo({
        variables: {
          title: newTodo,
          completed: false,
          userId: '1',
        },
      });
      setNewTodo('');
    } catch (err) {
      console.error('Error creating todo:', err);
    }
  };

  const handleToggleTodo = async (id, completed) => {
    try {
      await updateTodo({
        variables: { id, completed: !completed },
      });
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo({ variables: { id } });
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.username) return;

    try {
      await createUser({
        variables: newUser,
      });
      setNewUser({ name: '', email: '', username: '' });
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>
            <span style={styles.graphqlIcon}>◆</span> GraphQL Manager
          </h1>
          <p style={styles.subtitle}>XD</p>
        </div>
      </header>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('todos')}
          style={{
            ...styles.tab,
            ...(activeTab === 'todos' ? styles.tabActive : {}),
          }}
        >
          📝 Todos
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            ...styles.tab,
            ...(activeTab === 'users' ? styles.tabActive : {}),
          }}
        >
          👥 Users
        </button>
        <button
          onClick={() => setActiveTab('create')}
          style={{
            ...styles.tab,
            ...(activeTab === 'create' ? styles.tabActive : {}),
          }}
        >
          ➕ Create
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* TODOS TAB */}
        {activeTab === 'todos' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>All Todos</h2>
            
            {todosLoading && <div style={styles.loading}>Loading todos...</div>}
            {todosError && <div style={styles.error}>Error: {todosError.message}</div>}
            
            {todosData && (
              <div style={styles.grid}>
                {todosData.getTodos.map((todo) => (
                  <div key={todo.id} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleTodo(todo.id, todo.completed)}
                        style={styles.checkbox}
                      />
                      <span
                        style={{
                          ...styles.todoTitle,
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          opacity: todo.completed ? 0.6 : 1,
                        }}
                      >
                        {todo.title}
                      </span>
                    </div>
                    <div style={styles.cardFooter}>
                      <span style={styles.userBadge}>
                        👤 {todo.user?.name || 'Unknown'}
                      </span>
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        style={styles.deleteBtn}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>All Users</h2>
            
            {usersLoading && <div style={styles.loading}>Loading users...</div>}
            {usersError && <div style={styles.error}>Error: {usersError.message}</div>}
            
            {usersData && (
              <div style={styles.grid}>
                {usersData.getAllUsers.map((user) => (
                  <div
                    key={user.id}
                    style={styles.userCard}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <div style={styles.userAvatar}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 style={styles.userName}>{user.name}</h3>
                    <p style={styles.userDetail}>@{user.username}</p>
                    <p style={styles.userDetail}>📧 {user.email}</p>
                    <p style={styles.userDetail}>📱 {user.phone}</p>
                    {user.website && (
                      <p style={styles.userDetail}>🌐 {user.website}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* User Detail Modal */}
            {selectedUserId && userDetailData && (
              <div style={styles.modal} onClick={() => setSelectedUserId(null)}>
                <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setSelectedUserId(null)}
                    style={styles.closeBtn}
                  >
                    ✕
                  </button>
                  <h2 style={styles.modalTitle}>
                    {userDetailData.getUserById.name}
                  </h2>
                  <div style={styles.modalBody}>
                    <p><strong>Username:</strong> @{userDetailData.getUserById.username}</p>
                    <p><strong>Email:</strong> {userDetailData.getUserById.email}</p>
                    <p><strong>Phone:</strong> {userDetailData.getUserById.phone}</p>
                    <p><strong>Website:</strong> {userDetailData.getUserById.website}</p>
                    
                    <h3 style={styles.modalSubtitle}>User's Todos:</h3>
                    {userDetailData.getUserById.todos.length === 0 ? (
                      <p style={styles.emptyState}>No todos yet</p>
                    ) : (
                      <ul style={styles.todoList}>
                        {userDetailData.getUserById.todos.map((todo) => (
                          <li key={todo.id} style={styles.todoItem}>
                            {todo.completed ? '✅' : '⬜'} {todo.title}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CREATE TAB */}
        {activeTab === 'create' && (
          <div style={styles.section}>
            <div style={styles.formGrid}>
              {/* Create Todo */}
              <div style={styles.formCard}>
                <h2 style={styles.formTitle}>Create New Todo</h2>
                <div style={styles.formContainer}>
                  <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateTodo()}
                    style={styles.input}
                  />
                  <button onClick={handleCreateTodo} style={styles.submitBtn}>
                    ➕ Add Todo
                  </button>
                </div>
              </div>

              {/* Create User */}
              <div style={styles.formCard}>
                <h2 style={styles.formTitle}>Create New User</h2>
                <div style={styles.formContainer}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    style={styles.input}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    style={styles.input}
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    style={styles.input}
                  />
                  <button onClick={handleCreateUser} style={styles.submitBtn}>
                    ➕ Add User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {

  root: {
    margin: 0,
    padding: 0,
  },

  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '40px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
  },
  headerContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: 'white',
    margin: '0 0 10px 0',
    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
  },
  graphqlIcon: {
    color: '#e10098',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255, 255, 255, 0.9)',
    margin: 0,
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '12px 30px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '50px',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '500',
  },
  tabActive: {
    background: 'white',
    color: '#667eea',
    transform: 'scale(1.05)',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  sectionTitle: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '1.2rem',
    color: '#667eea',
  },
  error: {
    padding: '20px',
    background: '#fee',
    color: '#c33',
    borderRadius: '10px',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    padding: '20px',
    background: '#f9f9f9',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '15px',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
  todoTitle: {
    fontSize: '1rem',
    flex: 1,
    color: '#333',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userBadge: {
    fontSize: '0.85rem',
    color: '#667eea',
    background: '#f0f0ff',
    padding: '5px 10px',
    borderRadius: '20px',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    opacity: 0.6,
    transition: 'opacity 0.2s',
  },
  userCard: {
    padding: '30px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '15px',
    color: 'white',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    textAlign: 'center',
  },
  userAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: '0 auto 15px',
  },
  userName: {
    fontSize: '1.5rem',
    margin: '10px 0',
  },
  userDetail: {
    fontSize: '0.9rem',
    margin: '5px 0',
    opacity: 0.9,
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#999',
  },
  modalTitle: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#667eea',
  },
  modalBody: {
    fontSize: '1rem',
    lineHeight: '1.8',
  },
  modalSubtitle: {
    fontSize: '1.3rem',
    marginTop: '25px',
    marginBottom: '15px',
    color: '#333',
  },
  todoList: {
    listStyle: 'none',
    padding: 0,
  },
  todoItem: {
    padding: '10px',
    background: '#f9f9f9',
    marginBottom: '8px',
    borderRadius: '8px',
  },
  emptyState: {
    color: '#999',
    fontStyle: 'italic',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
  },
  formCard: {
    padding: '30px',
    background: '#f9f9f9',
    borderRadius: '15px',
    border: '2px solid #e0e0e0',
  },
  formTitle: {
    fontSize: '1.5rem',
    marginBottom: '20px',
    color: '#667eea',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '15px',
    fontSize: '1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  submitBtn: {
    padding: '15px',
    fontSize: '1rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
};

export default App;