import { Project, Task } from '../models/associations.js';
import { Op } from 'sequelize';

class ProjectController {
  static async getAllProjects(req, res) {
    try {
      const userId = req.user.id;
      const { includeArchived = false } = req.query;

      const whereClause = { 
        user_id: userId 
      };

      if (includeArchived !== 'true') {
        whereClause.is_archived = false;
      }

      const projects = await Project.findAll({
        where: whereClause,
        include: [
          {
            model: Task,
            as: 'tasks',
            where: { completed: false },
            required: false,
            attributes: ['id', 'title', 'completed', 'due_date', 'priority']
          }
        ],
        order: [
          ['sort_order', 'ASC'],
          ['created_at', 'DESC']
        ]
      });

      res.json({
        success: true,
        data: projects.map(project => ({
          id: project.id,
          name: project.name,
          description: project.description,
          color: project.color,
          is_archived: project.is_archived,
          sort_order: project.sort_order,
          task_count: project.tasks ? project.tasks.length : 0,
          created_at: project.created_at,
          updated_at: project.updated_at
        }))
      });
    } catch (error) {
      console.error('Get projects error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createProject(req, res) {
    try {
      const { name, description, color } = req.body;
      const userId = req.user.id;

      if (!name || name.trim().length === 0) {
        return res.status(400).json({ 
          error: 'Project name is required' 
        });
      }

      if (name.length > 255) {
        return res.status(400).json({ 
          error: 'Project name must be less than 255 characters' 
        });
      }

      if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
        return res.status(400).json({ 
          error: 'Color must be in hex format (#RRGGBB)' 
        });
      }

      const maxSortOrder = await Project.max('sort_order', {
        where: { user_id: userId }
      });

      const project = await Project.create({
        name: name.trim(),
        description: description ? description.trim() : null,
        color: color || '#808080',
        user_id: userId,
        sort_order: (maxSortOrder || 0) + 1
      });

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: {
          id: project.id,
          name: project.name,
          description: project.description,
          color: project.color,
          is_archived: project.is_archived,
          sort_order: project.sort_order,
          created_at: project.created_at,
          updated_at: project.updated_at
        }
      });
    } catch (error) {
      console.error('Create project error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateProject(req, res) {
    try {
      const { id } = req.params;
      const { name, description, color, is_archived, sort_order } = req.body;
      const userId = req.user.id;

      const project = await Project.findOne({
        where: { 
          id: parseInt(id),
          user_id: userId 
        }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const updateData = {};

      if (name !== undefined) {
        if (!name || name.trim().length === 0) {
          return res.status(400).json({ 
            error: 'Project name cannot be empty' 
          });
        }
        if (name.length > 255) {
          return res.status(400).json({ 
            error: 'Project name must be less than 255 characters' 
          });
        }
        updateData.name = name.trim();
      }

      if (description !== undefined) {
        updateData.description = description ? description.trim() : null;
      }

      if (color !== undefined) {
        if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
          return res.status(400).json({ 
            error: 'Color must be in hex format (#RRGGBB)' 
          });
        }
        updateData.color = color || '#808080';
      }

      if (is_archived !== undefined) {
        updateData.is_archived = Boolean(is_archived);
      }

      if (sort_order !== undefined) {
        if (!Number.isInteger(sort_order) || sort_order < 0) {
          return res.status(400).json({ 
            error: 'Sort order must be a non-negative integer' 
          });
        }
        updateData.sort_order = sort_order;
      }

      await project.update(updateData);

      res.json({
        success: true,
        message: 'Project updated successfully',
        data: {
          id: project.id,
          name: project.name,
          description: project.description,
          color: project.color,
          is_archived: project.is_archived,
          sort_order: project.sort_order,
          created_at: project.created_at,
          updated_at: project.updated_at
        }
      });
    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteProject(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const project = await Project.findOne({
        where: { 
          id: parseInt(id),
          user_id: userId 
        }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const taskCount = await Task.count({
        where: { project_id: project.id }
      });

      if (taskCount > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete project with existing tasks. Please move or delete all tasks first.' 
        });
      }

      await project.destroy();

      res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
      console.error('Delete project error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default ProjectController;