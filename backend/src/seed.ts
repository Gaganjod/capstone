import bcrypt from 'bcryptjs';
import { prisma } from './config/db';

async function main() {
  console.log('🌱 Seeding AdaptLearn AI Database with comprehensive demo datasets...');

  // Reset database tables
  await prisma.aIInteraction.deleteMany();
  await prisma.experimentSession.deleteMany();
  await prisma.recommendationExplanation.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.attempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.accessibilityPreference.deleteMany();
  await prisma.learnerState.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.teacherProfile.deleteMany();
  await prisma.user.deleteMany();

  const hashedDefaultPassword = await bcrypt.hash('password123', 10);

  // 1. Create Teacher Users
  const teacher1User = await prisma.user.create({
    data: {
      name: 'Dr. Sarah Jenkins',
      email: 'teacher@adaptlearn.edu',
      passwordHash: hashedDefaultPassword,
      role: 'TEACHER',
    },
  });

  const teacher1Profile = await prisma.teacherProfile.create({
    data: {
      userId: teacher1User.id,
      school: 'Horizon Inclusive Academy',
      department: 'Cognitive & Special Education',
    },
  });

  const teacher2User = await prisma.user.create({
    data: {
      name: 'Prof. Marcus Vance',
      email: 'marcus.vance@adaptlearn.edu',
      passwordHash: hashedDefaultPassword,
      role: 'TEACHER',
    },
  });

  await prisma.teacherProfile.create({
    data: {
      userId: teacher2User.id,
      school: 'Beacon Hill Learning Center',
      department: 'Educational Neurodiversity Research',
    },
  });

  // 2. Create Researcher User
  await prisma.user.create({
    data: {
      name: 'Dr. Elena Rostova',
      email: 'researcher@adaptlearn.edu',
      passwordHash: hashedDefaultPassword,
      role: 'RESEARCHER',
    },
  });

  // 3. Create Demo Students
  const studentData = [
    { name: 'Alex Morgan', email: 'alex@student.edu', age: 11, grade: 'Grade 5', severity: 'MODERATE', accuracy: 68, comp: 74, audio: 86, text: 58, respTime: 6200 },
    { name: 'Maya Lin', email: 'maya@student.edu', age: 10, grade: 'Grade 4', severity: 'SEVERE', accuracy: 52, comp: 65, audio: 88, text: 44, respTime: 9400 },
    { name: 'Jordan Hayes', email: 'jordan@student.edu', age: 12, grade: 'Grade 6', severity: 'MILD', accuracy: 82, comp: 88, audio: 91, text: 79, respTime: 4800 },
    { name: 'Sam Taylor', email: 'sam@student.edu', age: 11, grade: 'Grade 5', severity: 'MODERATE', accuracy: 64, comp: 70, audio: 82, text: 56, respTime: 7100 },
    { name: 'Chloe Bennett', email: 'chloe@student.edu', age: 9, grade: 'Grade 3', severity: 'SEVERE', accuracy: 48, comp: 60, audio: 84, text: 41, respTime: 10200 },
    { name: 'Ethan Rivera', email: 'ethan@student.edu', age: 12, grade: 'Grade 6', severity: 'MILD', accuracy: 85, comp: 90, audio: 92, text: 82, respTime: 4100 },
    { name: 'Liam O\'Connor', email: 'liam@student.edu', age: 10, grade: 'Grade 4', severity: 'MODERATE', accuracy: 70, comp: 76, audio: 85, text: 63, respTime: 6500 },
    { name: 'Zoe Washington', email: 'zoe@student.edu', age: 11, grade: 'Grade 5', severity: 'MILD', accuracy: 79, comp: 84, audio: 89, text: 74, respTime: 5300 },
    { name: 'Noah Miller', email: 'noah@student.edu', age: 13, grade: 'Grade 7', severity: 'SEVERE', accuracy: 56, comp: 68, audio: 86, text: 49, respTime: 8900 },
    { name: 'Emma Watson', email: 'emma@student.edu', age: 10, grade: 'Grade 4', severity: 'MODERATE', accuracy: 72, comp: 78, audio: 87, text: 66, respTime: 5900 },
  ];

  const createdStudents = [];

  for (const s of studentData) {
    const user = await prisma.user.create({
      data: {
        name: s.name,
        email: s.email,
        passwordHash: hashedDefaultPassword,
        role: 'STUDENT',
      },
    });

    const studentProfile = await prisma.studentProfile.create({
      data: {
        userId: user.id,
        age: s.age,
        gradeLevel: s.grade,
        readingLevel: s.severity === 'SEVERE' ? 'Emerging' : s.severity === 'MODERATE' ? 'Intermediate' : 'Advanced',
        dyslexiaSeverity: s.severity,
      },
    });

    const audioDiff = s.audio - s.text;
    const modality = audioDiff > 15 ? 'AUDIO_TEXT' : audioDiff > 5 ? 'HIGHLIGHTED_TEXT' : 'TEXT';

    await prisma.learnerState.create({
      data: {
        studentId: studentProfile.id,
        readingAccuracy: s.accuracy,
        comprehensionScore: s.comp,
        averageResponseTime: s.respTime,
        errorRate: Math.round((1 - s.accuracy / 100) * 100) / 100,
        audioPerformance: s.audio,
        textPerformance: s.text,
        currentDifficulty: s.accuracy < 60 ? 'EASY' : s.accuracy > 80 ? 'HARD' : 'MEDIUM',
        preferredModality: modality,
        pacingMode: s.respTime > 8000 ? 'SLOWER' : 'STANDARD',
        feedbackStrategy: s.severity === 'SEVERE' ? 'ENCOURAGING_ELABORATE' : 'CONCEPTUAL_HINT',
        engagementScore: 88.0,
        recentPerformanceTrend: 'IMPROVING',
        attemptHistoryCount: 14,
      },
    });

    await prisma.accessibilityPreference.create({
      data: {
        studentId: studentProfile.id,
        fontSize: s.severity === 'SEVERE' ? 'large' : 'medium',
        fontFamily: 'OpenDyslexic',
        letterSpacing: 'wide',
        lineSpacing: 'comfortable',
        readingSpeed: s.respTime > 8000 ? 0.75 : 1.0,
        audioAutoPlay: true,
        highlightReading: true,
        highContrast: false,
        focusOverlay: false,
      },
    });

    createdStudents.push(studentProfile);
  }

  // 4. Create Courses & Lessons
  const course1 = await prisma.course.create({
    data: {
      title: 'Reading & Vocabulary Essentials',
      description: 'Interactive multimodal stories designed for dyslexic readers to boost decoding and contextual vocabulary.',
      category: 'Language Arts',
      icon: 'BookOpen',
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Scientific Concepts & Systems',
      description: 'Visual and auditory science lessons breaking complex natural ecosystems into clear, manageable concepts.',
      category: 'Science & Nature',
      icon: 'Microscope',
    },
  });

  const lesson1 = await prisma.lesson.create({
    data: {
      courseId: course1.id,
      title: 'The Whispering Forest Journey',
      summary: 'Follow Leo as he travels through the enchanted woods, discovering how animals communicate.',
      content: 'The little boy walked quietly to the market through the dense green forest. High above, colorful birds sang soft melodies. Leo stopped near an ancient oak tree and noticed a small silver key nestled in the moss.',
      simplifiedContent: 'Leo walked to the market through the green woods. Birds sang above him. He stopped at a big oak tree and found a silver key in the soft moss.',
      audioUrl: '/audio/whispering_forest.mp3',
      difficulty: 'EASY',
      order: 1,
    },
  });

  const q1 = await prisma.question.create({
    data: {
      lessonId: lesson1.id,
      questionText: 'Where was Leo walking when he found the silver key?',
      options: JSON.stringify(['To his friend\'s house', 'To the market through the forest', 'To the school library', 'To the riverbank']),
      correctAnswer: 1,
      explanation: 'The story mentions Leo was walking to the market through the dense green forest when he stopped near the oak tree.',
      simplifiedExplanation: 'Leo was walking to the market through the forest when he found the key.',
      difficulty: 'EASY',
      concept: 'Detail Retrieval',
    },
  });

  const q2 = await prisma.question.create({
    data: {
      lessonId: lesson1.id,
      questionText: 'What did Leo find near the ancient oak tree?',
      options: JSON.stringify(['A wooden box', 'A silver key in the moss', 'A blue bird feather', 'A golden coin']),
      correctAnswer: 1,
      explanation: 'Near the oak tree, Leo noticed a small silver key resting on top of the moss.',
      simplifiedExplanation: 'Leo saw a silver key resting on the moss.',
      difficulty: 'EASY',
      concept: 'Vocabulary Decoding',
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      courseId: course2.id,
      title: 'Ecosystems and Food Webs',
      summary: 'Understand how plants and animals interact to balance natural ecosystems.',
      content: 'An ecosystem consists of interacting organisms and their physical environment. Primary producers, such as plants, convert sunlight into chemical energy through photosynthesis. Primary consumers then eat these plants to survive.',
      simplifiedContent: 'An ecosystem is a group of living things that interact with each other and their home. Plants use sunlight to make food. Herbivores eat plants to get energy.',
      audioUrl: '/audio/ecosystems.mp3',
      difficulty: 'MEDIUM',
      order: 2,
    },
  });

  const q3 = await prisma.question.create({
    data: {
      lessonId: lesson2.id,
      questionText: 'How do plants make food in an ecosystem?',
      options: JSON.stringify(['By drinking lake water', 'By capturing sunlight through photosynthesis', 'By taking energy from soil bacteria', 'By storing heat at night']),
      correctAnswer: 1,
      explanation: 'Plants use photosynthesis to convert light energy from the sun into chemical energy (food).',
      simplifiedExplanation: 'Plants use sunlight to make their own food through photosynthesis.',
      difficulty: 'MEDIUM',
      concept: 'Scientific Process',
    },
  });

  // 5. Seed Attempts & Recommendations for Alex (Student #1)
  const alex = createdStudents[0];

  await prisma.attempt.create({
    data: {
      studentId: alex.id,
      lessonId: lesson1.id,
      questionId: q1.id,
      chosenOption: 1,
      isCorrect: true,
      responseTimeMs: 5400,
      modalityUsed: 'AUDIO_TEXT',
      hintUsed: false,
      retryCount: 0,
      engineType: 'ML_ADAPTIVE',
    },
  });

  await prisma.attempt.create({
    data: {
      studentId: alex.id,
      lessonId: lesson1.id,
      questionId: q2.id,
      chosenOption: 1,
      isCorrect: true,
      responseTimeMs: 6100,
      modalityUsed: 'AUDIO_TEXT',
      hintUsed: true,
      retryCount: 1,
      engineType: 'ML_ADAPTIVE',
    },
  });

  const rec = await prisma.recommendation.create({
    data: {
      studentId: alex.id,
      targetDifficulty: 'MEDIUM',
      targetModality: 'AUDIO_TEXT',
      targetPacing: 'STANDARD',
      targetFeedback: 'ENCOURAGING_ELABORATE',
      engineType: 'ML_ADAPTIVE',
      confidence: 0.87,
    },
  });

  await prisma.recommendationExplanation.create({
    data: {
      recommendationId: rec.id,
      featureImportances: JSON.stringify({
        readingAccuracy: 0.36,
        audioPerformance: 0.29,
        averageResponseTime: 0.18,
        comprehensionScore: 0.11,
        errorRate: 0.06,
      }),
      naturalLanguageReasoning:
        'Audio + Text modality was recommended because Alex performed 28% higher during bimodal activities, and recent reading accuracy (68%) benefits from synchronized audio highlighting.',
      SHAPValues: JSON.stringify({
        readingAccuracy: 0.36,
        audioPerformance: 0.29,
        averageResponseTime: 0.18,
        comprehensionScore: 0.11,
        errorRate: 0.06,
      }),
      observedData: JSON.stringify({
        readingAccuracy: 68,
        audioPerformance: 86,
        textPerformance: 58,
        responseTimeMs: 6200,
        comprehension: 74,
      }),
      modelConfidence: 0.87,
    },
  });

  // 6. Seed Research Experiment Sessions
  const engineTypes = ['NON_ADAPTIVE', 'RULE_BASED', 'ML_ADAPTIVE'];
  for (let i = 0; i < 30; i++) {
    const eng = engineTypes[i % 3];
    const baseGain = eng === 'ML_ADAPTIVE' ? 22.4 : eng === 'RULE_BASED' ? 13.1 : 5.4;
    const baseAcc = eng === 'ML_ADAPTIVE' ? 18.2 : eng === 'RULE_BASED' ? 10.5 : 3.2;
    const baseComp = eng === 'ML_ADAPTIVE' ? 16.5 : eng === 'RULE_BASED' ? 9.8 : 4.1;

    await prisma.experimentSession.create({
      data: {
        studentId: createdStudents[i % createdStudents.length].id,
        engineType: eng,
        learningGain: Math.round((baseGain + (Math.random() * 4 - 2)) * 10) / 10,
        accuracyDelta: Math.round((baseAcc + (Math.random() * 4 - 2)) * 10) / 10,
        comprehensionDelta: Math.round((baseComp + (Math.random() * 4 - 2)) * 10) / 10,
        completionTimeMs: eng === 'ML_ADAPTIVE' ? 480000 : eng === 'RULE_BASED' ? 620000 : 780000,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
