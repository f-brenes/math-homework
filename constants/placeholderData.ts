export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface SavedEquation {
  id: string;
  equation: string;
  solution: string;
  steps: string[];
  difficulty: Difficulty;
  savedAt: string;
  tags: string[];
}

export interface QuizQuestion {
  id: string;
  equation: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface TheoryTopic {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  readTime: string;
  difficulty: Difficulty;
  preview: string;
}

export const recentProblems: SavedEquation[] = [
  {
    id: '1',
    equation: '2x + 6 = 14',
    solution: 'x = 4',
    steps: ['2x = 14 - 6', '2x = 8', 'x = 4'],
    difficulty: 'Easy',
    savedAt: '2 hours ago',
    tags: ['one-variable', 'positive'],
  },
  {
    id: '2',
    equation: '3x - 9 = 2x + 1',
    solution: 'x = 10',
    steps: ['3x - 2x = 1 + 9', 'x = 10'],
    difficulty: 'Medium',
    savedAt: 'Yesterday',
    tags: ['two-sides', 'subtraction'],
  },
  {
    id: '3',
    equation: '5(x - 2) = 3x + 4',
    solution: 'x = 7',
    steps: ['5x - 10 = 3x + 4', '2x = 14', 'x = 7'],
    difficulty: 'Medium',
    savedAt: '3 days ago',
    tags: ['parentheses', 'distribution'],
  },
  {
    id: '4',
    equation: '(x/3) + 4 = 7',
    solution: 'x = 9',
    steps: ['x/3 = 3', 'x = 9'],
    difficulty: 'Easy',
    savedAt: '1 week ago',
    tags: ['fractions', 'division'],
  },
];

export const savedEquations: SavedEquation[] = [
  ...recentProblems,
  {
    id: '5',
    equation: '2(3x + 1) = 4(x - 3) + 2',
    solution: 'x = -6',
    steps: ['6x + 2 = 4x - 12 + 2', '6x + 2 = 4x - 10', '2x = -12', 'x = -6'],
    difficulty: 'Hard',
    savedAt: '2 weeks ago',
    tags: ['parentheses', 'negative', 'distribution'],
  },
  {
    id: '6',
    equation: '(2x + 1)/3 = (x - 2)/2',
    solution: 'x = -7',
    steps: ['2(2x + 1) = 3(x - 2)', '4x + 2 = 3x - 6', 'x = -8'],
    difficulty: 'Hard',
    savedAt: '3 weeks ago',
    tags: ['fractions', 'cross-multiply'],
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: '1',
    equation: '4x + 8 = 24',
    options: ['x = 2', 'x = 4', 'x = 6', 'x = 8'],
    correct: 1,
    explanation: 'Subtract 8 from both sides: 4x = 16, then divide by 4: x = 4',
  },
  {
    id: '2',
    equation: '7x - 3 = 5x + 9',
    options: ['x = 3', 'x = 4', 'x = 6', 'x = 12'],
    correct: 2,
    explanation: 'Move x terms: 2x = 12, then divide: x = 6',
  },
  {
    id: '3',
    equation: '3(x + 2) = 21',
    options: ['x = 5', 'x = 6', 'x = 7', 'x = 9'],
    correct: 0,
    explanation: 'Distribute: 3x + 6 = 21, then 3x = 15, so x = 5',
  },
  {
    id: '4',
    equation: '(x/2) - 3 = 5',
    options: ['x = 4', 'x = 8', 'x = 16', 'x = 10'],
    correct: 2,
    explanation: 'Add 3 to both sides: x/2 = 8, then multiply by 2: x = 16',
  },
];

export const theoryTopics: TheoryTopic[] = [
  {
    id: '1',
    title: 'What is a Linear Equation?',
    subtitle: 'Foundations',
    icon: '📐',
    readTime: '3 min',
    difficulty: 'Easy',
    preview: 'A linear equation is an equation where each term is either a constant or a product of a constant and a single variable...',
  },
  {
    id: '2',
    title: 'Solving One-Step Equations',
    subtitle: 'Basic Operations',
    icon: '➕',
    readTime: '5 min',
    difficulty: 'Easy',
    preview: 'One-step equations require only one operation to isolate the variable. The key is to perform the inverse operation...',
  },
  {
    id: '3',
    title: 'Two-Step Equations',
    subtitle: 'Building Complexity',
    icon: '✌️',
    readTime: '7 min',
    difficulty: 'Medium',
    preview: 'Two-step equations need two operations to solve. Always reverse the order of operations: undo addition/subtraction first...',
  },
  {
    id: '4',
    title: 'Variables on Both Sides',
    subtitle: 'Advanced Techniques',
    icon: '⚖️',
    readTime: '8 min',
    difficulty: 'Medium',
    preview: 'When variables appear on both sides, you need to collect all variable terms on one side by adding or subtracting...',
  },
  {
    id: '5',
    title: 'Equations with Parentheses',
    subtitle: 'Distribution Law',
    icon: '🔢',
    readTime: '10 min',
    difficulty: 'Medium',
    preview: 'The distributive property allows you to expand expressions like a(b + c) = ab + ac before solving...',
  },
  {
    id: '6',
    title: 'Fractional Equations',
    subtitle: 'Advanced',
    icon: '🧮',
    readTime: '12 min',
    difficulty: 'Hard',
    preview: 'Equations with fractions can be solved by multiplying all terms by the least common denominator (LCD)...',
  },
];

export const dashboardStats = {
  solvedToday: 8,
  weeklyStreak: 5,
  totalSolved: 142,
  accuracy: 87,
};
