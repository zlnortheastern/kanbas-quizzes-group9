import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Choice } from "../interface";

export interface RootState {
  choices: Choice[];
  choice: Choice;
}

const initialState: RootState = {
  choices: [],
  choice: {
    _id: "",
    choice: "",
    correct: false,
  },
};

const choiceSlice = createSlice({
  name: "choices",
  initialState,
  reducers: {
    setChoices(state, action: PayloadAction<Choice[]>) {
      state.choices = action.payload;
    },
    setChoice(state, action: PayloadAction<Choice>) {
      state.choice = action.payload;
    },
    addChoice(state, action: PayloadAction<Choice>) {
      state.choices.push(action.payload);
    },
    deleteChoice(state, action: PayloadAction<string>) {
      state.choices = state.choices.filter(
        (choice) => choice._id !== action.payload
      );
    },
  },
});

export const { setChoices, setChoice, addChoice, deleteChoice } =
  choiceSlice.actions;

export default choiceSlice.reducer;
