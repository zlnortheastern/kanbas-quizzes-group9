import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Blank {
  value: string;
}

export interface RootState {
  blanks: Blank[];
  blank: Blank;
}

const initialState: RootState = {
  blanks: [],
  blank: {
    value: "",
  },
};

const blankSlice = createSlice({
  name: "blanks",
  initialState,
  reducers: {
    setBlanks(state, action: PayloadAction<Blank[]>) {
      state.blanks = action.payload;
    },
    setBlank(state, action: PayloadAction<Blank>) {
      state.blank = action.payload;
    },
    addBlank(state, action: PayloadAction<Blank>) {
      state.blanks.push(action.payload);
    },
    deleteBlank(state, action: PayloadAction<string>) {
      state.blanks = state.blanks.filter(
        (blank) => blank.value !== action.payload
      );
    },
  },
});

export const { setBlanks, setBlank, addBlank, deleteBlank } =
  blankSlice.actions;
export default blankSlice.reducer;
