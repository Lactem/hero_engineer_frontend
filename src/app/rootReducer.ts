import { combineReducers } from "@reduxjs/toolkit"

import avatarsReducer from "features/avatarsSlice"
import userReducer from "features/userSlice"
import heroesReducer from "features/heroesSlice"
import questsReducer from "features/questsSlice"
import quizzesReducer from "features/quizzesSlice"
import sectionReducer from "features/sectionSlice"
import heroCouncilReducer from "features/heroCouncilSlice"
import shortAnswerAssignmentsReducer from "features/shortAnswerAssignmentsSlice"

const rootReducer = combineReducers({
  avatars: avatarsReducer,
  user: userReducer,
  heroes: heroesReducer,
  quests: questsReducer,
  quizzes: quizzesReducer,
  section: sectionReducer,
  heroCouncil: heroCouncilReducer,
  shortAnswerAssignments: shortAnswerAssignmentsReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
