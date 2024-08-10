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
    true_or_false: true,
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

    deleteQuestion: (state, action: PayloadAction<{ index: number }>) => {
      state.questions = state.questions.filter(
        (_, idx) => idx !== action.payload.index
      );
    },

    updateQuestion: (
      state,
      action: PayloadAction<{ question: Question; index: number }>
    ) => {
      const { question, index } = action.payload;
      state.questions = state.questions.map((q, idx) =>
        idx === index ? question : q
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
