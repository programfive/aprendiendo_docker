import { useState, useEffect } from 'react';
import { TodoList } from './components/TodoList';
import type { Todo } from './types';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || '';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch todos on load
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_URL}/api/todos`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setTodos(data);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodoTitle })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const newTodo = await response.json();
      setTodos([newTodo, ...todos]);
      setNewTodoTitle('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    // Optimistic UI update
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed } : todo
    ));

    try {
      await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      });
    } catch (error) {
      console.error('Error updating todo:', error);
      // Revert on error (simple reload for now)
      fetchTodos();
    }
  };

  const handleDeleteTodo = async (id: number) => {
    // Optimistic UI update
    setTodos(todos.filter(todo => todo.id !== id));

    try {
      await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      // Revert on error
      fetchTodos();
    }
  };

  return (
    <div className="app-container">
      <h1> Tienda </h1>
      
      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          className="todo-input"
          placeholder="¿Qué necesitas hacer hoy?"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className="btn-add" disabled={isLoading || !newTodoTitle.trim()}>
          Añadir
        </button>
      </form>

      <TodoList 
        todos={todos} 
        onToggle={handleToggleTodo} 
        onDelete={handleDeleteTodo}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
