import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { AppThunk } from "app/store"

import { apiDeleteQuest, apiFetchQuests, apiSaveQuest, QuestModel } from "../../api/questsAPI"
import { GradedQuizModel } from "../../api/quizzesAPI"

interface QuestsState {
  quests: QuestModel[] | null
  questsLoading: boolean
  questsError: string
}

const initialState: QuestsState = {
  quests: null,
  questsLoading: false,
  questsError: ""
}

const quests = createSlice({
  name: "quests",
  initialState,
  reducers: {
    fetchQuestsSuccessAction(state, action: PayloadAction<QuestModel[]>) {
      state.quests = action.payload
      state.questsLoading = false
      state.questsError = ""
    },
    fetchQuestsFailedAction(state, action: PayloadAction<string>) {
      state.quests = null
      state.questsLoading = false
      state.questsError = action.payload
    },
    resetQuestsStateAction(state) {
      Object.assign(state, initialState)
    }
  }
})

export const {
  fetchQuestsSuccessAction,
  fetchQuestsFailedAction,
  resetQuestsStateAction
} = quests.actions

export default quests.reducer

export const loadQuests = (): AppThunk => async dispatch => {
  try {
    const quests = await apiFetchQuests()
    dispatch(fetchQuestsSuccessAction(quests))
  } catch (err) {
    dispatch(fetchQuestsFailedAction(err.toString()))
  }
}

export const saveQuest = (
  name: string,
  description: string,
  automaticXpReward: number,
  main: boolean,
  complete: boolean,
  completeWithQuizzes: boolean,
  incompleteQuizIds: string[],
  completedQuizzes: GradedQuizModel[],
  requiredQuestIds: string[],
  id?: string
): AppThunk => async dispatch => {
  apiSaveQuest(name,
    description,
    automaticXpReward,
    main,
    complete,
    completeWithQuizzes,
    incompleteQuizIds,
    completedQuizzes,
    requiredQuestIds,
    id)
    .then(_ => {
      dispatch(loadQuests())
      alert("Successfully saved quest")
    })
    .catch(error => {
      alert("Error saving quest (info in console)")
      console.log("error: ", error)
    })
}

export const deleteQuest = (id: string): AppThunk => async dispatch => {
  apiDeleteQuest(id)
    .then(_ => {
      dispatch(loadQuests())
      alert("Successfully deleted quest")
    })
    .catch(error => {
      alert("Error deleting quest (info in console)")
      console.log("error: ", error)
    })
}
