import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { AppThunk } from "app/store"

import {
  apiDeleteQuest,
  apiEnterCode,
  apiFetchQuests,
  apiGenerateCode, apiGenerateUniversalCode,
  apiSaveQuest,
  QuestModel
} from "../api/questsAPI"
import { GradedQuizModel } from "../api/quizzesAPI"
import { loadAllUsers, loadProfile } from "./userSlice"
import { message } from "antd"

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
  available: boolean,
  complete: boolean,
  completeWithQuizzes: boolean,
  completeWithCode: boolean,
  completeWithQuizzesAndCode: boolean,
  code: string,
  universalCode: string,
  incompleteQuizIds: string[],
  completedQuizzes: GradedQuizModel[],
  requiredQuestIds: string[],
  id?: string
): AppThunk => async dispatch => {
  apiSaveQuest(name,
    description,
    automaticXpReward,
    main,
    available,
    complete,
    completeWithQuizzes,
    completeWithCode,
    completeWithQuizzesAndCode,
    code,
    universalCode,
    incompleteQuizIds,
    completedQuizzes,
    requiredQuestIds,
    id)
    .then(_ => {
      dispatch(loadQuests())
      message.success("Successfully saved quest")
    })
    .catch(error => {
      message.error("Error saving quest (info in console)")
      console.log("error: ", error)
    })
}

export const deleteQuest = (id: string): AppThunk => async dispatch => {
  apiDeleteQuest(id)
    .then(_ => {
      dispatch(loadQuests())
      message.success("Successfully deleted quest")
    })
    .catch(error => {
      message.error("Error deleting quest (info in console)")
      console.log("error: ", error)
    })
}

export const enterCode = (
  questId: string,
  code: string
): AppThunk => async dispatch => {
  apiEnterCode(questId, code)
    .then(_ => {
      dispatch(loadProfile())
    })
    .catch(error => {
      message.error("Invalid code")
      console.log("Code error: ", error)
    })
}

export const generateCode = (
  userEmail: string,
  questId: string
): AppThunk => async dispatch => {
  apiGenerateCode(userEmail, questId)
    .then(_ => {
      dispatch(loadAllUsers())
    })
    .catch(error => {
      message.error("Invalid code")
      console.log("Code error: ", error)
    })
}

export const generateUniversalCode = (
  questId: string
): AppThunk => async dispatch => {
  apiGenerateUniversalCode(questId)
    .then(_ => {
      dispatch(loadQuests())
    })
    .catch(error => {
      message.error("Invalid code")
      console.log("Code error: ", error)
    })
}
