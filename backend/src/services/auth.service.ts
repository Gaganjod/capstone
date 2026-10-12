import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { ENV } from '../config/env';

export class AuthService {
  static async registerUser(data: {
    name: string;
    email: string;
    password: string;
    role?: 'STUDENT' | 'TEACHER' | 'RESEARCHER';
    age?: number;
    gradeLevel?: string;
    dyslexiaSeverity?: string;
    school?: string;
  }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const role = data.role || 'STUDENT';

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role,
      },
    });

    if (role === 'STUDENT') {
      const studentProfile = await prisma.studentProfile.create({
        data: {
          userId: user.id,
          age: data.age || 10,
          gradeLevel: data.gradeLevel || 'Grade 5',
          dyslexiaSeverity: data.dyslexiaSeverity || 'MODERATE',
        },
      });

      // Initialize default learner state
      await prisma.learnerState.create({
        data: {
          studentId: studentProfile.id,
          readingAccuracy: 68.0,
          comprehensionScore: 72.0,
          averageResponseTime: 6500.0,
          errorRate: 0.28,
          audioPerformance: 84.0,
          textPerformance: 62.0,
          currentDifficulty: 'MEDIUM',
          preferredModality: 'AUDIO_TEXT',
          pacingMode: 'STANDARD',
          feedbackStrategy: 'ENCOURAGING_ELABORATE',
          engagementScore: 85.0,
          recentPerformanceTrend: 'STABLE',
        },
      });

      // Initialize accessibility preferences
      await prisma.accessibilityPreference.create({
        data: {
          studentId: studentProfile.id,
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
    } else if (role === 'TEACHER') {
      await prisma.teacherProfile.create({
        data: {
          userId: user.id,
          school: data.school || 'AdaptLearn Academy',
          department: 'Special Education',
        },
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  static async loginUser(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        studentProfile: true,
        teacherProfile: true,
      },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentProfile?.id,
        teacherId: user.teacherProfile?.id,
      },
      token,
    };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        studentProfile: {
          include: {
            learnerState: true,
            accessibility: true,
          },
        },
        teacherProfile: true,
      },
    });
    return user;
  }
}
