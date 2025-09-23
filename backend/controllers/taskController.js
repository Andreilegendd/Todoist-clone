import { Task, Project, Label } from '../models/associations.js';
import { Op } from 'sequelize';

class TaskController {
  static async getAllTasks(req, res) {
    try {
      const userId = req.user.id;
      const { 
        project_id, 
        label_id,
        completed = false, 
        due_date,
        priority,
        page = 1,
        limit = 50
      } = req.query;

      const whereClause = { user_id: userId };

      if (project_id) {
        whereClause.project_id = parseInt(project_id);
      }

      if (completed !== undefined) {
        whereClause.completed = completed === 'true';
      }

      if (priority) {
        whereClause.priority = parseInt(priority);
      }

      if (due_date) {
        if (due_date === 'upcoming') {
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          
          whereClause.due_date = {
            [Op.between]: [
              new Date(tomorrow.setHours(0, 0, 0, 0)),
              new Date(nextWeek.setHours(23, 59, 59, 999))
            ]
          };
        } else {
          const date = new Date(due_date);
          if (!isNaN(date.getTime())) {
            whereClause.due_date = {
              [Op.between]: [
                new Date(date.setHours(0, 0, 0, 0)),
                new Date(date.setHours(23, 59, 59, 999))
              ]
            };
          }
        }
      }

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const includeArray = [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'color']
        },
        {
          model: Label,
          as: 'labels',
          through: { attributes: [] },
          attributes: ['id', 'name', 'color'],
          ...(label_id && {
            where: { id: parseInt(label_id) },
            required: true
          })
        },
        {
          model: Task,
          as: 'subtasks',
          attributes: ['id', 'title', 'completed'],
          where: { completed: false },
          required: false
        }
      ];

      const { count, rows: tasks } = await Task.findAndCountAll({
        where: whereClause,
        include: includeArray,
        order: [
          ['completed', 'ASC'],
          ['priority', 'DESC'],
          ['due_date', 'ASC'],
          ['sort_order', 'ASC'],
          ['created_at', 'DESC']
        ],
        limit: parseInt(limit),
        offset: offset
      });

      res.json({
        success: true,
        data: tasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          completed: task.completed,
          due_date: task.due_date,
          priority: task.priority,
          sort_order: task.sort_order,
          project: task.project,
          labels: task.labels || [],
          subtask_count: task.subtasks ? task.subtasks.length : 0,
          created_at: task.created_at,
          updated_at: task.updated_at
        })),
        pagination: {
          page: parseInt(page),
          totalPages: Math.ceil(count / parseInt(limit)),
          total: count,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createTask(req, res) {
    try {
      const { 
        title, 
        description, 
        due_date, 
        priority = 1, 
        project_id,
        parent_id,
        labels = []
      } = req.body;
      const userId = req.user.id;

      if (!title || title.trim().length === 0) {
        return res.status(400).json({ 
          error: 'Task title is required' 
        });
      }

      if (title.length > 255) {
        return res.status(400).json({ 
          error: 'Task title must be less than 255 characters' 
        });
      }

      if (priority && (priority < 1 || priority > 4)) {
        return res.status(400).json({ 
          error: 'Priority must be between 1 and 4' 
        });
      }

      if (project_id) {
        const project = await Project.findOne({
          where: { 
            id: parseInt(project_id),
            user_id: userId 
          }
        });

        if (!project) {
          return res.status(404).json({ error: 'Project not found' });
        }
      }

      if (parent_id) {
        const parentTask = await Task.findOne({
          where: { 
            id: parseInt(parent_id),
            user_id: userId 
          }
        });

        if (!parentTask) {
          return res.status(404).json({ error: 'Parent task not found' });
        }
      }

      const maxSortOrder = await Task.max('sort_order', {
        where: { 
          user_id: userId,
          project_id: project_id || null
        }
      });

      let parsedDueDate = null;
      if (due_date) {
        parsedDueDate = new Date(due_date);
        if (isNaN(parsedDueDate.getTime())) {
          return res.status(400).json({ 
            error: 'Invalid due date format' 
          });
        }
      }

      const task = await Task.create({
        title: title.trim(),
        description: description ? description.trim() : null,
        due_date: parsedDueDate,
        priority: parseInt(priority),
        project_id: project_id ? parseInt(project_id) : null,
        parent_id: parent_id ? parseInt(parent_id) : null,
        user_id: userId,
        sort_order: (maxSortOrder || 0) + 1
      });

      if (labels && labels.length > 0) {
        const labelIds = labels.map(id => parseInt(id));
        const validLabels = await Label.findAll({
          where: {
            id: labelIds,
            user_id: userId
          }
        });

        if (validLabels.length > 0) {
          await task.addLabels(validLabels);
        }
      }

      const createdTask = await Task.findByPk(task.id, {
        include: [
          {
            model: Project,
            as: 'project',
            attributes: ['id', 'name', 'color']
          },
          {
            model: Label,
            as: 'labels',
            through: { attributes: [] },
            attributes: ['id', 'name', 'color']
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: {
          id: createdTask.id,
          title: createdTask.title,
          description: createdTask.description,
          completed: createdTask.completed,
          due_date: createdTask.due_date,
          priority: createdTask.priority,
          sort_order: createdTask.sort_order,
          project: createdTask.project,
          labels: createdTask.labels || [],
          created_at: createdTask.created_at,
          updated_at: createdTask.updated_at
        }
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { 
        title, 
        description, 
        completed, 
        due_date, 
        priority, 
        project_id,
        sort_order,
        labels
      } = req.body;
      const userId = req.user.id;

      const task = await Task.findOne({
        where: { 
          id: parseInt(id),
          user_id: userId 
        }
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const updateData = {};

      if (title !== undefined) {
        if (!title || title.trim().length === 0) {
          return res.status(400).json({ 
            error: 'Task title cannot be empty' 
          });
        }
        if (title.length > 255) {
          return res.status(400).json({ 
            error: 'Task title must be less than 255 characters' 
          });
        }
        updateData.title = title.trim();
      }

      if (description !== undefined) {
        updateData.description = description ? description.trim() : null;
      }

      if (completed !== undefined) {
        updateData.completed = Boolean(completed);
      }

      if (due_date !== undefined) {
        if (due_date === null) {
          updateData.due_date = null;
        } else {
          const parsedDueDate = new Date(due_date);
          if (isNaN(parsedDueDate.getTime())) {
            return res.status(400).json({ 
              error: 'Invalid due date format' 
            });
          }
          updateData.due_date = parsedDueDate;
        }
      }

      if (priority !== undefined) {
        if (priority < 1 || priority > 4) {
          return res.status(400).json({ 
            error: 'Priority must be between 1 and 4' 
          });
        }
        updateData.priority = parseInt(priority);
      }

      if (project_id !== undefined) {
        if (project_id === null) {
          updateData.project_id = null;
        } else {
          const project = await Project.findOne({
            where: { 
              id: parseInt(project_id),
              user_id: userId 
            }
          });

          if (!project) {
            return res.status(404).json({ error: 'Project not found' });
          }
          updateData.project_id = parseInt(project_id);
        }
      }

      if (sort_order !== undefined) {
        if (!Number.isInteger(sort_order) || sort_order < 0) {
          return res.status(400).json({ 
            error: 'Sort order must be a non-negative integer' 
          });
        }
        updateData.sort_order = sort_order;
      }

      await task.update(updateData);

      if (labels !== undefined) {
        if (Array.isArray(labels)) {
          const labelIds = labels.map(id => parseInt(id));
          const validLabels = await Label.findAll({
            where: {
              id: labelIds,
              user_id: userId
            }
          });
          await task.setLabels(validLabels);
        }
      }

      const updatedTask = await Task.findByPk(task.id, {
        include: [
          {
            model: Project,
            as: 'project',
            attributes: ['id', 'name', 'color']
          },
          {
            model: Label,
            as: 'labels',
            through: { attributes: [] },
            attributes: ['id', 'name', 'color']
          }
        ]
      });

      res.json({
        success: true,
        message: 'Task updated successfully',
        data: {
          id: updatedTask.id,
          title: updatedTask.title,
          description: updatedTask.description,
          completed: updatedTask.completed,
          due_date: updatedTask.due_date,
          priority: updatedTask.priority,
          sort_order: updatedTask.sort_order,
          project: updatedTask.project,
          labels: updatedTask.labels || [],
          created_at: updatedTask.created_at,
          updated_at: updatedTask.updated_at
        }
      });
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const task = await Task.findOne({
        where: { 
          id: parseInt(id),
          user_id: userId 
        }
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const subtaskCount = await Task.count({
        where: { parent_id: task.id }
      });

      if (subtaskCount > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete task with existing subtasks. Please delete subtasks first.' 
        });
      }

      await task.destroy();

      res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async completeTask(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const task = await Task.findOne({
        where: { 
          id: parseInt(id),
          user_id: userId 
        }
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      if (task.completed) {
        return res.status(400).json({ error: 'Task is already completed' });
      }

      await task.update({
        completed: true,
        completed_at: new Date()
      });

      const completedTask = await Task.findByPk(task.id, {
        include: [
          {
            model: Project,
            as: 'project',
            attributes: ['id', 'name', 'color']
          },
          {
            model: Label,
            as: 'labels',
            through: { attributes: [] },
            attributes: ['id', 'name', 'color']
          }
        ]
      });

      res.json({
        success: true,
        message: 'Task completed successfully',
        data: {
          id: completedTask.id,
          title: completedTask.title,
          description: completedTask.description,
          completed: completedTask.completed,
          completed_at: completedTask.completed_at,
          due_date: completedTask.due_date,
          priority: completedTask.priority,
          sort_order: completedTask.sort_order,
          project: completedTask.project,
          labels: completedTask.labels || [],
          created_at: completedTask.created_at,
          updated_at: completedTask.updated_at
        }
      });
    } catch (error) {
      console.error('Complete task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async uncompleteTask(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const task = await Task.findOne({
        where: { 
          id: parseInt(id),
          user_id: userId 
        }
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      if (!task.completed) {
        return res.status(400).json({ error: 'Task is not completed' });
      }

      await task.update({
        completed: false,
        completed_at: null
      });

      const uncompletedTask = await Task.findByPk(task.id, {
        include: [
          {
            model: Project,
            as: 'project',
            attributes: ['id', 'name', 'color']
          },
          {
            model: Label,
            as: 'labels',
            through: { attributes: [] },
            attributes: ['id', 'name', 'color']
          }
        ]
      });

      res.json({
        success: true,
        message: 'Task marked as incomplete',
        data: {
          id: uncompletedTask.id,
          title: uncompletedTask.title,
          description: uncompletedTask.description,
          completed: uncompletedTask.completed,
          completed_at: uncompletedTask.completed_at,
          due_date: uncompletedTask.due_date,
          priority: uncompletedTask.priority,
          sort_order: uncompletedTask.sort_order,
          project: uncompletedTask.project,
          labels: uncompletedTask.labels || [],
          created_at: uncompletedTask.created_at,
          updated_at: uncompletedTask.updated_at
        }
      });
    } catch (error) {
      console.error('Uncomplete task error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default TaskController;