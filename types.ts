
export enum Language {
  HEBREW = 'he',
  ENGLISH = 'en'
}

export enum ConceptStatus {
  NOT_STARTED = 'not_started',
  DIAGNOSING = 'diagnosing',
  WEAK = 'weak',
  IN_PROGRESS = 'in_progress',
  MASTERED = 'mastered'
}

export interface Concept {
  id: string;
  name: string;
  name_en?: string;
  status: ConceptStatus;
  description: string;
  description_en?: string;
  identifiedWeakness?: string;
}

export interface HabitData {
  id: string;
  name: string;
  count: number;
  color: string;
}

export interface Experiment {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
}

export interface StudentProfile {
  name: string;
  grade: string;
  learningStyle: string;
  concepts: Concept[];
  history: string[];
  habits: HabitData[];
  savedExperiments: Experiment[];
  exp: number;
  level: number;
  badges: string[];
  learningGoal?: string;
  dailyGoal?: string;
  mascotId?: string;
  streak?: number;
  lastActiveDate?: string;
  completedDays?: string[];
  countryCode?: string;
}

export interface UserAccount {
  username: string;
  passwordHash: string; // Stored securely in localStorage
  profile: StudentProfile;
  messages: ChatMessage[];
  createdAt: string;
}

export type MessageRole = 'user' | 'assistant' | 'system' | 'lab' | 'quiz';

export interface InteractiveAction {
  label: string;
  payload: string;
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp: Date;
  actions?: InteractiveAction[];
  metadata?: {
    type?: 'experiment' | 'analogy' | 'quiz';
    status?: string;
  };
}

export interface AnalysisUpdate {
  updatedConcepts: Partial<Concept>[];
  suggestedLearningStyle?: string;
  reasoning: string;
  triggerQuiz?: boolean;
}

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
