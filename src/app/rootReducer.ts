import { combineReducers } from "@reduxjs/toolkit"

import userReducer from "features/userSlice"
import heroesReducer from "features/heroesSlice"
import questsReducer from "features/questsSlice"
import quizzesReducer from "features/quizzesSlice"
import sectionReducer from "features/sectionSlice"

const rootReducer = combineReducers({
  user: userReducer,
  heroes: heroesReducer,
  quests: questsReducer,
  quizzes: quizzesReducer,
  section: sectionReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
