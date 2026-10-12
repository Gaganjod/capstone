import { Request, Response } from 'express';
import { prisma } from '../config/db';

export class AccessibilityController {
  static async getSettings(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      let settings = await prisma.accessibilityPreference.findUnique({
        where: { studentId },
      });

      if (!settings) {
        settings = await prisma.accessibilityPreference.create({
          data: {
            studentId,
            fontSize: 'medium',
            fontFamily: 'OpenDyslexic',
            letterSpacing: 'wide',
            lineSpacing: 'comfortable',
            readingSpeed: 1.0,
            audioAutoPlay: true,
            highlightReading: true,
            highContrast: false,
            focusOverlay: false,
          },
        });
      }

      return res.status(200).json(settings);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch accessibility settings' });
    }
  }

  static async updateSettings(req: Request, res: Response) {
    try {
      const { studentId, ...data } = req.body;
      const settings = await prisma.accessibilityPreference.upsert({
        where: { studentId },
        update: data,
        create: {
          studentId,
          ...data,
        },
      });

      return res.status(200).json(settings);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to update accessibility settings' });
    }
  }
}
