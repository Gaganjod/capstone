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

  const q3 = await prisma.question.create({
    data: {
      lessonId: lesson1.id,
      questionText: 'What was singing high above Leo in the forest?',
      options: JSON.stringify(['Colorful birds singing soft melodies', 'A group of noisy monkeys', 'The howling wind', 'Crickets in the tall grass']),
      correctAnswer: 0,
      explanation: 'The passage mentions high above, colorful birds sang soft melodies.',
      simplifiedExplanation: 'Birds were singing high up in the trees.',
      difficulty: 'EASY',
      concept: 'Direct Recall',
    },
  });

  const q4 = await prisma.question.create({
    data: {
      lessonId: lesson1.id,
      questionText: 'What does the word "nestled" mean in the phrase "nestled in the moss"?',
      options: JSON.stringify(['Thrown far away into the bushes', 'Resting snugly and protected in the moss', 'Broken into sharp pieces', 'Buried deep under heavy stones']),
      correctAnswer: 1,
      explanation: '"Nestled" means settled or lying comfortably and snugly within something soft.',
      simplifiedExplanation: '"Nestled" means tucked comfortably like an egg in a nest.',
      difficulty: 'MEDIUM',
      concept: 'Contextual Vocabulary',
    },
  });

  const q5 = await prisma.question.create({
    data: {
      lessonId: lesson1.id,
      questionText: 'Which detail suggests that the forest has existed for a very long time?',
      options: JSON.stringify(['The market in the town', 'The ancient oak tree', 'The small silver key', 'Leo\'s footsteps']),
      correctAnswer: 1,
      explanation: 'The word "ancient" specifically indicates the oak tree—and by extension the forest—has been there for centuries.',
      simplifiedExplanation: 'The word "ancient" means very, very old.',
      difficulty: 'MEDIUM',
      concept: 'Inference & Context',
    },
  });

  const q6 = await prisma.question.create({
    data: {
      lessonId: lesson1.id,
      questionText: 'Why did the author describe Leo walking "quietly"?',
      options: JSON.stringify(['He was running away from danger', 'He was taking in the peaceful forest atmosphere', 'He was playing a game of tag', 'He was wearing heavy iron boots']),
      correctAnswer: 1,
      explanation: 'Walking quietly reflects Leo\'s calm, attentive journey through the serene woods.',
      simplifiedExplanation: 'Leo walked quietly because the forest was calm and peaceful.',
      difficulty: 'MEDIUM',
      concept: 'Character Intent',
    },
  });

  const q7 = await prisma.question.create({
    data: {
      lessonId: lesson1.id,
      questionText: 'What overall mood or tone is established by the author in this passage?',
      options: JSON.stringify(['An eerie and suspenseful atmosphere', 'A tranquil and enchanting fairy-tale mood', 'A chaotic and humorous setting', 'A sorrowful and bleak environment']),
      correctAnswer: 1,
      explanation: 'Words like "soft melodies", "dense green forest", and "ancient oak tree" create a peaceful, enchanted storybook mood.',
      simplifiedExplanation: 'The story feels magical, calm, and peaceful.',
      difficulty: 'HARD',
      concept: 'Tone & Atmosphere',
    },
  });

  const q8 = await prisma.question.create({
    data: {
      lessonId: lesson1.id,
      questionText: 'How does discovering the silver key function as an inciting incident for the plot?',
      options: JSON.stringify(['It immediately ends Leo\'s journey and returns him home', 'It introduces a mystery that triggers curiosity and invites an adventure', 'It proves that Leo has lost his way to the market', 'It warns Leo of an impending natural disaster']),
      correctAnswer: 1,
      explanation: 'In narrative structure, finding a mysterious key raises questions about what lock it opens, initiating the story\'s central mystery.',
      simplifiedExplanation: 'The key is a clue that starts an exciting new adventure.',
      difficulty: 'HARD',
      concept: 'Literary Structure',
    },
  });

  const q9 = await prisma.question.create({
    data: {
      lessonId: lesson1.id,
      questionText: 'Which phrase contains both visual and tactile sensory imagery?',
      options: JSON.stringify(['Leo stopped near an ancient oak tree', 'Silver key nestled in the moss', 'Walked quietly to the market', 'High above, colorful birds']),
      correctAnswer: 1,
      explanation: '"Silver key" provides metallic visual imagery, while "nestled in the moss" evokes the soft tactile feel of moss cushioning an object.',
      simplifiedExplanation: 'You can see the shiny silver key and imagine touching the soft moss.',
      difficulty: 'HARD',
      concept: 'Sensory Imagery Analysis',
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

  const l2_q1 = await prisma.question.create({
    data: {
      lessonId: lesson2.id,
      questionText: 'How do plants make food in an ecosystem?',
      options: JSON.stringify(['By drinking lake water', 'By capturing sunlight through photosynthesis', 'By taking energy from soil bacteria', 'By storing heat at night']),
      correctAnswer: 1,
      explanation: 'Plants use photosynthesis to convert light energy from the sun into chemical energy (food).',
      simplifiedExplanation: 'Plants use sunlight to make their own food through photosynthesis.',
      difficulty: 'EASY',
      concept: 'Scientific Process',
    },
  });

  const l2_q2 = await prisma.question.create({
    data: {
      lessonId: lesson2.id,
      questionText: 'What do primary consumers eat to survive?',
      options: JSON.stringify(['Rocks and sand', 'Plants (primary producers)', 'Apex predators like eagles', 'Clouds and rainwater']),
      correctAnswer: 1,
      explanation: 'Primary consumers are herbivores that feed directly on primary producers (plants).',
      simplifiedExplanation: 'Primary consumers are animals that eat plants for energy.',
      difficulty: 'EASY',
      concept: 'Food Chain Basics',
    },
  });

  const l2_q3 = await prisma.question.create({
    data: {
      lessonId: lesson2.id,
      questionText: 'What is the primary source of energy that fuels nearly all ecosystems?',
      options: JSON.stringify(['The Sun', 'Volcanic lava', 'Wind currents', 'Deep underground caverns']),
      correctAnswer: 0,
      explanation: 'Solar radiation from the sun is the initial energy input for almost all terrestrial ecosystems.',
      simplifiedExplanation: 'The sun gives plants the light they need to grow.',
      difficulty: 'EASY',
      concept: 'Energy Origins',
    },
  });

  const l2_q4 = await prisma.question.create({
    data: {
      lessonId: lesson2.id,
      questionText: 'Why are green plants classified as "primary producers"?',
      options: JSON.stringify(['They produce oxygen for fish only', 'They synthesize their own organic food from abiotic sunlight', 'They hunt smaller primary consumers', 'They decompose fallen branches']),
      correctAnswer: 1,
      explanation: 'Producers generate new biomass from inorganic sunlight and water, forming the foundation of the trophic pyramid.',
      simplifiedExplanation: 'Plants are called producers because they make their own food from scratch.',
      difficulty: 'MEDIUM',
      concept: 'Trophic Levels',
    },
  });

  const l2_q5 = await prisma.question.create({
    data: {
      lessonId: lesson2.id,
      questionText: 'What would happen to herbivore populations if a drought destroyed all local plants?',
      options: JSON.stringify(['Their population would rapidly multiply', 'They would experience severe starvation and population decline', 'They would turn into photosynthesis producers', 'They would remain completely unchanged']),
      correctAnswer: 1,
      explanation: 'Without their primary food source, herbivore populations decline due to starvation and lack of energy.',
      simplifiedExplanation: 'Without plants to eat, plant-eating animals would go hungry.',
      difficulty: 'MEDIUM',
      concept: 'Ecosystem Interdependence',
    },
  });

  const l2_q6 = await prisma.question.create({
    data: {
      lessonId: lesson2.id,
      questionText: 'Which of the following organisms is an example of a primary consumer?',
      options: JSON.stringify(['A hawk catching field mice', 'A caterpillar eating green oak leaves', 'An ancient pine tree', 'A mushroom breaking down logs']),
      correctAnswer: 1,
      explanation: 'A caterpillar eats plant foliage directly, making it a primary consumer (herbivore).',
      simplifiedExplanation: 'A caterpillar is a primary consumer because it eats plant leaves.',
      difficulty: 'MEDIUM',
      concept: 'Classification & Examples',
    },
  });

  const l2_q7 = await prisma.question.create({
    data: {
      lessonId: lesson2.id,
      questionText: 'According to the 10% rule in ecology, why is there less biomass at higher trophic levels?',
      options: JSON.stringify(['Predators refuse to eat large amounts of food', 'Approximately 90% of energy is lost as heat and metabolic maintenance at each transfer', 'Plants absorb chemical energy back from apex predators', 'Herbivores destroy energy permanently during digestion']),
      correctAnswer: 1,
      explanation: 'Only about 10% of energy is incorporated into new biomass at the next trophic level; 90% is consumed in cellular respiration or lost as thermal heat.',
      simplifiedExplanation: 'Most energy is used up for body heat and running, so only a little energy is passed up to top animals.',
      difficulty: 'HARD',
      concept: 'Thermodynamics in Ecology',
    },
  });

  const l2_q8 = await prisma.question.create({
    data: {
      lessonId: lesson2.id,
      questionText: 'How does an ecosystem maintain dynamic homeostasis when a temporary disturbance occurs?',
      options: JSON.stringify(['By completely eradicating all primary producers', 'Through interconnected negative feedback loops and biodiversity resilience', 'By stopping photosynthesis until winter', 'By expelling all secondary consumers']),
      correctAnswer: 1,
      explanation: 'Biodiversity and negative feedback loops buffer ecosystems, allowing them to absorb shocks and re-establish equilibrium.',
      simplifiedExplanation: 'Different animals and plants help balance each other out when bad weather strikes.',
      difficulty: 'HARD',
      concept: 'Homeostasis & Equilibrium',
    },
  });

  const l2_q9 = await prisma.question.create({
    data: {
      lessonId: lesson2.id,
      questionText: 'How does photosynthesis directly mitigate greenhouse gas accumulation in the atmosphere?',
      options: JSON.stringify(['It sequesters carbon dioxide and transforms it into glucose and oxygen', 'It emits ozone into the troposphere', 'It converts nitrogen gas into sulfuric acid', 'It cools water molecules in oceans permanently']),
      correctAnswer: 0,
      explanation: 'Plants absorb atmospheric CO2 during the Calvin cycle, sequestering carbon in solid cellulose and releasing O2.',
      simplifiedExplanation: 'Plants pull carbon dioxide out of the air to make sugars and give off fresh oxygen.',
      difficulty: 'HARD',
      concept: 'Biogeochemical Cycles',
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
