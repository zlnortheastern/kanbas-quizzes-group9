import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Question, QuestionType } from "../interface";

export interface RootState {
  questions: Question[];
  question: Question;
}

const initialState: RootState = {
  questions: [],
  question: {
    type: QuestionType.multipleChoice,
    title: "",
    points: 0,
    question: "",
    true_or_false: undefined,
    choices: [],
    blank: [],
  },
};

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },

    setQuestion: (state, action: PayloadAction<Question>) => {
      state.question = { ...action.payload };
      if (action.payload.type) {
        state.question.type = action.payload.type;
      }
    },

    addQuestion: (state, action: PayloadAction<Question>) => {
      state.questions.push(action.payload);
    },

    deleteQuestion: (state, action: PayloadAction<{ title: string }>) => {
      state.questions = state.questions.filter(
        (question) => question.title !== action.payload.title
      );
    },

    updateQuestion: (state, action: PayloadAction<Question>) => {
      state.questions = state.questions.map((question) =>
        question.title === action.payload.title ? action.payload : question
      );
    },
  },
});

export const {
  setQuestions,
  setQuestion,
  addQuestion,
  deleteQuestion,
  updateQuestion,
} = questionsSlice.actions;

export default questionsSlice.reducer;
