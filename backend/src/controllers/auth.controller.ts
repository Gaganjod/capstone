import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const result = await AuthService.registerUser(req.body);
      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Registration failed' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const result = await AuthService.loginUser(req.body);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(401).json({ error: err.message || 'Login failed' });
    }
  }

  static async getMe(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      const user = await AuthService.getMe(req.user.id);
      return res.status(200).json(user);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch user' });
    }
  }
}
