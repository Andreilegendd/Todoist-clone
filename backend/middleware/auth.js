import jwt from 'jsonwebtoken';
import { User, UserSession } from '../models/associations.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.session;

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const session = await UserSession.findOne({ 
      where: { token },
      include: [{ model: User, as: 'user' }]
    });

    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    if (new Date() > session.expires_at) {
      await session.destroy();
      return res.status(401).json({ error: 'Session expired' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    
    req.user = {
      id: decoded.userId || decoded.id,
      email: decoded.email,
      role: session.user.role,
      ...decoded
    };
    req.session = session;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};
