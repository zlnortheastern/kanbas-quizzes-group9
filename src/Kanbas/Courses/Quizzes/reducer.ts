import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Quiz, ShowAnswerType } from "./interface";

interface QuizzesState {
  quizzes: Quiz[];
  quiz: Quiz;
}

const initialState: QuizzesState = {
  quizzes: [],
  quiz: {
    _id: "new",
    title: "new quiz title",
    description: "new quiz description",
    quizType: "quiz",
    points: 0,
    assignmentGroup: "Quizzes",
    shuffleAnswers: false,
    timeLimit: 0,
    multipleAttempts: false,
    attemptLimit: 100,
    showCorrectAnswers: ShowAnswerType.immediately,
    accessCode: "",
    oneQuestionAtATime: false,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    dueDate: "2024-08-15",
    availableDate: "2024-05-16",
    availableUntilDate: "2024-08-15",
    lastModified: "",
    course: "course id",
    published: false,
  },
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
    setQuiz: (state, action) => {
      state.quiz = action.payload;
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
  setQuiz,
} = quizzesSlice.actions;

export default quizzesSlice.reducer;
