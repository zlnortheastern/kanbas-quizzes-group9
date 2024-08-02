export interface Quiz {
  _id: string;
  title: string;
  quizType: string;
  points: number;
  assignmentGroup: string;
  shuffleAnswers: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  attemptLimit: number;
  showCorrectAnswers: string;
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  dueDate: string;
  availableDate: string;
  availableUntilDate: string;
  description: string;
  lastModified: string;
  course: string;
  published: boolean;
}

export enum QuestionType {
  trueOrFalse = "TRUE_OR_FALSE",
  multipleChoice = "MULTIPLE_CHOICE",
  fillInBlank = "FILL_IN_BLANK",
}
export interface Choice {
  _id: string;
  choice: string;
  correct: boolean;
}
export interface Question {
  type: QuestionType;
  title: string;
  points: number;
  question: string;
  true_or_false?: boolean;
  choices?: Choice[];
  blank?: string[];
}
export interface Questions {
  _id: string;
  quiz: string;
  questions: Question[];
}
export interface Answer {
  type: QuestionType;
  score: number;
  true_or_false?: boolean;
  choices?: number;
  blank?: string;
}
export interface Answers {
  _id: string;
  user: string;
  quiz: string;
  score: number;
  total: number;
  answers: Answer[];
}
