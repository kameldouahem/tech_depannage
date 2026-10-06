import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { getOrCreateUser } from '../db/users.ts';

export interface AuthRequest extends Request {
  user?: DecodedIdToken | { uid: string; email: string; name?: string };
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  
  // Allow technician local admin token
  if (token === 'techdepan-admin-token' || token === 'demo-admin-token') {
    req.user = {
      uid: 'admin-1',
      email: 'admin@depannage.fr',
      name: 'Kamel Douahem',
    };
    return next();
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    
    // Sync user with Cloud SQL
    if (decodedToken.uid && decodedToken.email) {
      await getOrCreateUser(decodedToken.uid, decodedToken.email, decodedToken.name).catch((err) => {
        console.warn('Could not sync user to Cloud SQL:', err);
      });
    }
    
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
