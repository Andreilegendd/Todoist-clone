import bcrypt from 'bcryptjs';
import { User, UserSession } from '../models/associations.js';
import { Op } from 'sequelize';

class UserController {
  static async me(req, res) {
    try {
      const user = req.user;
      
      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      });
    } catch (error) {
      console.error('Get user info error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async changeName(req, res) {
    try {
      const { name } = req.body;
      const userId = req.user.id;

      if (!name || name.trim().length === 0) {
        return res.status(400).json({ 
          error: 'Name is required' 
        });
      }

      if (name.length > 255) {
        return res.status(400).json({ 
          error: 'Name must be less than 255 characters' 
        });
      }

      await User.update(
        { name: name.trim() },
        { where: { id: userId } }
      );

      const updatedUser = await User.findByPk(userId);

      res.json({
        message: 'Name updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role
        }
      });
    } catch (error) {
      console.error('Change name error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async logout(req, res) {
    try {
      const sessionToken = req.cookies.session;

      if (sessionToken) {
        await UserSession.destroy({
          where: { token: sessionToken }
        });
      }

      res.clearCookie('session');

      res.json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          error: 'Current password and new password are required' 
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ 
          error: 'New password must be at least 6 characters long' 
        });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ 
          error: 'Current password is incorrect' 
        });
      }

      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      await User.update(
        { password_hash: newPasswordHash },
        { where: { id: userId } }
      );

      const currentSessionToken = req.cookies.session;
      await UserSession.destroy({
        where: {
          user_id: userId,
          token: {
            [Op.ne]: currentSessionToken
          }
        }
      });

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteAccount(req, res) {
    try {
      const { password } = req.body;
      const userId = req.user.id;

      if (!password) {
        return res.status(400).json({ 
          error: 'Password is required for account deletion' 
        });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(400).json({ 
          error: 'Incorrect password' 
        });
      }

      await UserSession.destroy({
        where: { user_id: userId }
      });

      await User.destroy({
        where: { id: userId }
      });

      res.clearCookie('session');

      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default UserController;