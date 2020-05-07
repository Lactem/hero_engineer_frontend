import { combineReducers } from "@reduxjs/toolkit"

import userReducer from "features/user/userSlice"
import heroesReducer from "features/heroes/heroesSlice"
import questsReducer from "features/quests/questsSlice"
import quizzesReducer from "features/quizzes/quizzesSlice"

const rootReducer = combineReducers({
  user: userReducer,
  heroes: heroesReducer,
  quests: questsReducer,
  quizzes: quizzesReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
