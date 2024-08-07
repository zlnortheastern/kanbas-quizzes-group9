import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Question, Questions, QuestionType } from "../interface";

export interface RootState {
  questions: Questions;
  question: Question;
}

const initialState: RootState = {
  questions: {
    _id: "",
    quiz: "",
    questions: [],
  },
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
    setQuestions(state, action: PayloadAction<Questions>) {
      state.questions = action.payload;
    },
    setQuestion(state, action: PayloadAction<Question>) {
      state.question = action.payload;
    },
    addQuestion(state, action: PayloadAction<Question>) {
      state.questions.questions.push(action.payload);
    },
    deleteQuestion(state, action: PayloadAction<number>) {
      state.questions.questions.splice(action.payload, 1);
    },
    updateQuestion(
      state,
      action: PayloadAction<{ index: number; question: Question }>
    ) {
      const { index, question } = action.payload;
      state.questions.questions[index] = question;
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
