import { NextResponse } from 'next/server';

function shuffleOptions(questions: any[]) {
  return questions.map((q, qIdx) => {
    const indexed = q.options.map((opt: string, i: number) => ({
      text: opt,
      isCorrect: i === q.correctAnswer,
    }));
    for (let i = indexed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
    }
    const newCorrectIdx = indexed.findIndex((item: any) => item.isCorrect);
    return {
      id: `ai-gen-${Date.now()}-${qIdx + 1}`,
      questionText: q.questionText,
      options: indexed.map((item: any) => item.text),
      correctAnswer: newCorrectIdx,
      explanation: q.explanation,
      simplifiedExplanation: q.simplifiedExplanation,
      difficulty: q.difficulty,
      concept: q.concept,
    };
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lessonText = '', lessonTitle = '', difficulty = 'MEDIUM' } = body;

    const lower = (lessonText + ' ' + lessonTitle).toLowerCase();
    const isForest = lower.includes('forest') || lower.includes('key') || lower.includes('leo') || lower.includes('tree');

    let pool: any[] = [];

    if (isForest) {
      if (difficulty === 'EASY') {
        pool = [
          {
            questionText: 'What shiny object caught Leo’s attention between the roots of the ancient tree?',
            options: ['A silver key nestled in soft moss', 'A gold wristwatch ticking softly', 'A glowing glass marble', 'A copper coin covered in dirt'],
            correctAnswer: 0,
            explanation: 'The passage mentions Leo spotted a small silver key nestled snugly in the green moss.',
            simplifiedExplanation: 'Leo found a silver key in the soft moss.',
            difficulty: 'EASY',
            concept: 'Detail Recall',
          },
          {
            questionText: 'Where was Leo heading before he paused in the clearing?',
            options: ['Through the forest on a gentle trail', 'To an underground cave', 'Climbing a steep snowy mountain', 'Running quickly toward a busy highway'],
            correctAnswer: 0,
            explanation: 'Leo was walking along a quiet path winding through the lush green trees.',
            simplifiedExplanation: 'Leo was walking down a forest trail.',
            difficulty: 'EASY',
            concept: 'Reading Comprehension',
          },
          {
            questionText: 'What kind of sounds filled the morning air around Leo?',
            options: ['Birds singing soft, calming melodies', 'Loud sirens echoing across the valley', 'Thunder booming in a storm', 'Waves crashing against high cliffs'],
            correctAnswer: 0,
            explanation: 'Colorful birds sang soft melodies as the morning breeze ruffled the oak leaves.',
            simplifiedExplanation: 'Gentle birds were singing pleasant songs in the trees.',
            difficulty: 'EASY',
            concept: 'Sensory Detail',
          },
        ];
      } else if (difficulty === 'HARD') {
        pool = [
          {
            questionText: 'How does the setting in the dense forest amplify the discovery of the key?',
            options: ['It creates a contrast between natural wilderness and a human-made silver object', 'It suggests Leo is completely lost and in danger', 'It indicates that Leo should throw the key into the river', 'It proves the forest is an ordinary modern city park'],
            correctAnswer: 0,
            explanation: 'Finding a refined silver key in an ancient natural forest immediately evokes mystery and human history.',
            simplifiedExplanation: 'Finding shiny metal in the woods makes it feel like a fairy tale.',
            difficulty: 'HARD',
            concept: 'Setting & Thematic Contrast',
          },
          {
            questionText: 'What underlying theme is introduced through Leo walking "quietly" before finding the key?',
            options: ['Mindfulness and attentiveness allow one to notice subtle wonders', 'Speed and haste are essential to winning races', 'Fear of nature leads to sudden surprises', 'Leaving trails prevents getting lost'],
            correctAnswer: 0,
            explanation: 'Because Leo walked quietly and paid attention to his surroundings, he noticed the small silver key.',
            simplifiedExplanation: 'Being quiet and watchful helps you notice special hidden things.',
            difficulty: 'HARD',
            concept: 'Thematic Inference',
          },
          {
            questionText: 'Which literary device is exemplified in "colorful birds sang soft melodies"?',
            options: ['Auditory imagery paired with peaceful mood creation', 'Hyperbolic exaggeration', 'Dramatic irony', 'Satirical commentary'],
            correctAnswer: 0,
            explanation: 'The author appeals to sound (soft melodies) to establish an idyllic, serene tone.',
            simplifiedExplanation: 'The author uses gentle sounds to make the story feel peaceful.',
            difficulty: 'HARD',
            concept: 'Literary Devices',
          },
        ];
      } else {
        // MEDIUM
        pool = [
          {
            questionText: 'What does the word "nestled" imply about how the key was situated?',
            options: ['It was resting safely and comfortably cushioned in the moss', 'It was jammed violently between sharp stones', 'It was dangling precariously from high branches', 'It was spinning rapidly in a whirlpool'],
            correctAnswer: 0,
            explanation: '"Nestled" evokes warmth and safe positioning, like a bird in a nest.',
            simplifiedExplanation: 'Nestled means tucked snugly in something soft.',
            difficulty: 'MEDIUM',
            concept: 'Contextual Semantics',
          },
          {
            questionText: 'Why did the author highlight that the oak tree was "ancient"?',
            options: ['To give the forest a timeless, majestic character', 'To explain why the tree was chopped down', 'To show the forest was recently planted', 'To indicate danger from falling branches'],
            correctAnswer: 0,
            explanation: 'Ancient implies deep age, wisdom, and mystery within the woods.',
            simplifiedExplanation: 'Ancient shows the tree has stood there for hundreds of years.',
            difficulty: 'MEDIUM',
            concept: 'Inference & Context',
          },
          {
            questionText: 'Based on the story, what will Leo most likely do next?',
            options: ['Inspect the key and wonder what mystery it unlocks', 'Immediately throw the key onto the ground and run home', 'Forget he was on his way to the market', 'Cut down the oak tree'],
            correctAnswer: 0,
            explanation: 'Discovering an intriguing key prompts a curious character to explore its lock.',
            simplifiedExplanation: 'Leo will probably look closely at the key and try to find what it opens.',
            difficulty: 'MEDIUM',
            concept: 'Predictive Reasoning',
          },
        ];
      }
    } else {
      // Science / Ecosystems
      pool = [
        {
          questionText: 'What role do primary producers play in sustaining an ecosystem?',
          options: ['They synthesize organic energy directly from sunlight via photosynthesis', 'They hunt secondary consumers at night', 'They decompose bedrock into sea water', 'They consume oxygen and release harmful radiation'],
          correctAnswer: 0,
          explanation: 'Producers convert abiotic solar energy into biological chemical energy that supports all other life.',
          simplifiedExplanation: 'Plants turn sunlight into food for the rest of the ecosystem.',
          difficulty: difficulty,
          concept: 'Ecosystem Function',
        },
        {
          questionText: 'How are primary consumers dependent on plants?',
          options: ['They obtain all their caloric energy and nutrients by consuming plants', 'They rely on plants to regulate ambient ocean temperatures', 'They use plants exclusively for nighttime camouflage', 'They do not depend on plants in any way'],
          correctAnswer: 0,
          explanation: 'Primary consumers are herbivores whose diet consists exclusively of primary producers.',
          simplifiedExplanation: 'Herbivores must eat plants to survive and have energy.',
          difficulty: difficulty,
          concept: 'Trophic Interdependence',
        },
        {
          questionText: 'What fundamental principle maintains balance in natural food webs?',
          options: ['Energy transfers continually through producers, consumers, and decomposers', 'Predators eliminate all herbivores every generation', 'Plants consume consumers during winter months', 'Solar radiation only works once per year'],
          correctAnswer: 0,
          explanation: 'Continuous, balanced energy flow across trophic levels sustains ecological equilibrium.',
          simplifiedExplanation: 'Energy keeps moving in a circle from plants to animals.',
          difficulty: difficulty,
          concept: 'Systems Thinking',
        },
      ];
    }

    const questions = shuffleOptions(pool);
    return NextResponse.json({ questions, generatedAt: new Date().toISOString() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 });
  }
}
