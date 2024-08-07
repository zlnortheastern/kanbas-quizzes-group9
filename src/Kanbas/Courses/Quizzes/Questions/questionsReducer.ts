import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Question, Questions, QuestionType } from "../interface";

export interface RootState {
  questions: Question[];
  question: Question;
}

const initialState: RootState = {
  questions: [],

  question: {
    _id: "",
    quiz: "",
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
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },

    setQuestion: (state, action) => {
      state.question = { ...action.payload };
      if (action.payload.type) {
        state.question.type = action.payload.type;
      }
    },

    addQuestion: (state, action) => {
      state.questions = [action.payload, ...state.questions];
    },
    deleteQuestion: (state, action) => {
      state.questions = state.questions.filter(
        (question) => question._id !== action.payload
      );
    },
    updateQuestion: (state, action) => {
      state.questions = state.questions.map((question) => {
        if (question._id === action.payload._id) {
          return action.payload;
        } else {
          return question;
        }
      });
    },
  },
});

export const {
  setQuestions,
  addQuestion,
  deleteQuestion,
  updateQuestion,
  setQuestion,
} = questionsSlice.actions;

export default questionsSlice.reducer;
