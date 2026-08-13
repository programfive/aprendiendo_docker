import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving todos from database' });
  }
});

// Create a new todo
app.post('/api/todos', async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const [result] = await pool.query('INSERT INTO todos (title) VALUES (?)', [title]);
    
    // Fetch the newly created todo
    const [newTodo] = await pool.query('SELECT * FROM todos WHERE id = ?', [result.insertId]);
    
    res.status(201).json(newTodo[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating todo in database' });
  }
});

// Update a todo
app.put('/api/todos/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, completed } = req.body;

  try {
    // Check if it exists
    const [existing] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Update fields conditionally
    const currentTodo = existing[0];
    const newTitle = title !== undefined ? title : currentTodo.title;
    // MySQL maneja booleanos como 1 y 0 (TINYINT)
    const newCompleted = completed !== undefined ? (completed ? 1 : 0) : currentTodo.completed;

    await pool.query(
      'UPDATE todos SET title = ?, completed = ? WHERE id = ?',
      [newTitle, newCompleted, id]
    );

    // Fetch the updated todo
    const [updated] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
    
    res.json(updated[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating todo in database' });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const [result] = await pool.query('DELETE FROM todos WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting todo in database' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port} (connected to MySQL Docker Database!)`);
});
