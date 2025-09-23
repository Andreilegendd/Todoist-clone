import { Label } from '../models/associations.js';
import { Op } from 'sequelize';

class LabelController {
  static async getAllLabels(req, res) {
    try {
      const userId = req.user.id;

      const labels = await Label.findAll({
        where: { user_id: userId },
        order: [['name', 'ASC']]
      });

      res.json({
        success: true,
        data: labels.map(label => ({
          id: label.id,
          name: label.name,
          color: label.color,
          created_at: label.created_at,
          updated_at: label.updated_at
        }))
      });
    } catch (error) {
      console.error('Get labels error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createLabel(req, res) {
    try {
      const { name, color } = req.body;
      const userId = req.user.id;

      if (!name || name.trim().length === 0) {
        return res.status(400).json({ 
          error: 'Label name is required' 
        });
      }

      if (name.length > 100) {
        return res.status(400).json({ 
          error: 'Label name must be less than 100 characters' 
        });
      }

      if (!color || color.trim().length === 0) {
        return res.status(400).json({ 
          error: 'Label color is required' 
        });
      }

      const existingLabel = await Label.findOne({
        where: { 
          name: name.trim(),
          user_id: userId 
        }
      });

      if (existingLabel) {
        return res.status(400).json({ 
          error: 'Label with this name already exists' 
        });
      }

      const label = await Label.create({
        name: name.trim(),
        color: color.trim(),
        user_id: userId
      });

      res.status(201).json({
        success: true,
        message: 'Label created successfully',
        data: {
          id: label.id,
          name: label.name,
          color: label.color,
          created_at: label.created_at,
          updated_at: label.updated_at
        }
      });
    } catch (error) {
      console.error('Create label error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateLabel(req, res) {
    try {
      const { id } = req.params;
      const { name, color } = req.body;
      const userId = req.user.id;

      const label = await Label.findOne({
        where: { 
          id: parseInt(id),
          user_id: userId 
        }
      });

      if (!label) {
        return res.status(404).json({ error: 'Label not found' });
      }

      const updateData = {};

      if (name !== undefined) {
        if (!name || name.trim().length === 0) {
          return res.status(400).json({ 
            error: 'Label name cannot be empty' 
          });
        }
        if (name.length > 100) {
          return res.status(400).json({ 
            error: 'Label name must be less than 100 characters' 
          });
        }

        const existingLabel = await Label.findOne({
          where: { 
            name: name.trim(),
            user_id: userId,
            id: { [Op.ne]: parseInt(id) }
          }
        });

        if (existingLabel) {
          return res.status(400).json({ 
            error: 'Label with this name already exists' 
          });
        }

        updateData.name = name.trim();
      }

      if (color !== undefined) {
        if (!color || color.trim().length === 0) {
          return res.status(400).json({ 
            error: 'Label color cannot be empty' 
          });
        }
        updateData.color = color.trim();
      }

      await label.update(updateData);

      res.json({
        success: true,
        message: 'Label updated successfully',
        data: {
          id: label.id,
          name: label.name,
          color: label.color,
          created_at: label.created_at,
          updated_at: label.updated_at
        }
      });
    } catch (error) {
      console.error('Update label error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteLabel(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const label = await Label.findOne({
        where: { 
          id: parseInt(id),
          user_id: userId 
        }
      });

      if (!label) {
        return res.status(404).json({ error: 'Label not found' });
      }

      await label.destroy();

      res.json({ success: true, message: 'Label deleted successfully' });
    } catch (error) {
      console.error('Delete label error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default LabelController;