import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, UserSession } from '../models/associations.js';
import { Op } from 'sequelize';

class AuthController {
  static async register(req, res) {
    try {
      const { email, name, password } = req.body;

      if (!email || !name || !password) {
        return res.status(400).json({ 
          error: 'Email, name and password are required' 
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ 
          error: 'Password must be at least 6 characters long' 
        });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ 
          error: 'User with this email already exists' 
        });
      }

      const saltRounds = 12;
      const password_hash = await bcrypt.hash(password, saltRounds);

      const user = await User.create({
        email,
        name,
        password_hash
      });

      const sessionToken = uuidv4();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await UserSession.create({
        token: sessionToken,
        user_id: user.id,
        expires_at: expiresAt
      });

      res.cookie('session', sessionToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: expiresAt,
        path: '/'
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          },
          token: sessionToken,
          expiresAt: expiresAt.toISOString()
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email and password are required' 
        });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ 
          error: 'Invalid email or password' 
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          error: 'Invalid email or password' 
        });
      }

      await UserSession.destroy({
        where: {
          user_id: user.id,
          expires_at: {
            [Op.lt]: new Date()
          }
        }
      });

      const sessionToken = uuidv4();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await UserSession.create({
        token: sessionToken,
        user_id: user.id,
        expires_at: expiresAt
      });

      res.cookie('session', sessionToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: expiresAt,
        path: '/'
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          },
          token: sessionToken,
          expiresAt: expiresAt.toISOString()
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default AuthController;