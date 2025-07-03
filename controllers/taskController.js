const taskModel = require('../models/taskModel');

const getTasks = (req, res) => {
  taskModel.getTasksByUser(req.user.id, (err, tasks) => {
    if (err) return res.status(500).json({ message: 'Error fetching tasks' });
    res.json(tasks);
  });
};

const createTask = (req, res) => {
  const { title, description = '', status = 'todo' } = req.body;
  if (!title) return res.status(400).json({ message: 'Title required' });
  taskModel.createTask(title, description, status, req.user.id, (err, taskId) => {
    if (err) return res.status(500).json({ message: 'Error creating task' });
    res.status(201).json({ id: taskId, title, description, status });
  });
};

const updateTask = (req, res) => {
  const { title, description, status } = req.body;
  const { id } = req.params;
  taskModel.getTaskById(id, req.user.id, (err, task) => {
    if (!task) return res.status(404).json({ message: 'Task not found' });
    taskModel.updateTask(
      id,
      title || task.title,
      typeof description !== 'undefined' ? description : task.description,
      status || task.status,
      req.user.id,
      (err, changes) => {
        if (err) return res.status(500).json({ message: 'Error updating task' });
        res.json({ message: 'Task updated' });
      }
    );
  });
};

const deleteTask = (req, res) => {
  const { id } = req.params;
  taskModel.deleteTask(id, req.user.id, (err, changes) => {
    if (err) return res.status(500).json({ message: 'Error deleting task' });
    if (!changes) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  });
};

module.exports = { getTasks, createTask, updateTask, deleteTask }; 