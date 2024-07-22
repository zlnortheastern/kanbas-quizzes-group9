import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Quiz {
  _id: string;
  title: string;
  course: string;
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
  published: boolean;
  editing?: boolean;
  questions?: any[];
}

interface QuizzesState {
  quizzes: Quiz[];
}

const initialState: QuizzesState = {
  quizzes: [],
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action: PayloadAction<Quiz[]>) => {
      state.quizzes = action.payload;
    },
    addQuiz: (state, { payload: quiz }: PayloadAction<Quiz>) => {
      const newQuiz: Quiz = {
        ...quiz,
        _id: new Date().getTime().toString(),
        published: false,
      };
      state.quizzes = [...state.quizzes, newQuiz];
    },
    deleteQuiz: (state, { payload: quizId }: PayloadAction<string>) => {
      state.quizzes = state.quizzes.filter((q) => q._id !== quizId);
    },
    updateQuiz: (state, { payload: quiz }: PayloadAction<Quiz>) => {
      state.quizzes = state.quizzes.map((q) => (q._id === quiz._id ? quiz : q));
    },
    editQuiz: (state, { payload: quizId }: PayloadAction<string>) => {
      state.quizzes = state.quizzes.map((q) =>
        q._id === quizId ? { ...q, editing: true } : q
      );
    },
    togglePublishQuiz: (state, { payload: quizId }: PayloadAction<string>) => {
      state.quizzes = state.quizzes.map((q) =>
        q._id === quizId ? { ...q, published: !q.published } : q
      );
    },
  },
});

export const {
  setQuizzes,
  addQuiz,
  deleteQuiz,
  updateQuiz,
  editQuiz,
  togglePublishQuiz,
} = quizzesSlice.actions;

export default quizzesSlice.reducer;
