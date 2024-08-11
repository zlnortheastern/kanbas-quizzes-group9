import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Courses/Modules/reducer";
import assignmentsReducer from "./Courses/Assignments/reducer";
import quizzesReducer from "./Courses/Quizzes/reducer";
import questionsReducer from "./Courses/Quizzes/Questions/questionsReducer";
import choicesReducer from "./Courses/Quizzes/Questions/choicesReducer";
import blanksReducer from "./Courses/Quizzes/Questions/blanksReducer";
const store = configureStore({
  reducer: {
    modulesReducer,
    assignmentsReducer,
    quizzesReducer,
    questionsReducer,
    choicesReducer,
    blanksReducer,
  },
});
export default store;
