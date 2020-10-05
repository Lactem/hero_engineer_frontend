import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { AppThunk } from "app/store"

import {
  apiDeleteQuest,
  apiEnterCode,
  apiFetchQuests,
  apiGenerateCode,
  apiGenerateUniversalCode,
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
  codeEnteredSuccessfully: boolean,
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
    codeEnteredSuccessfully,
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
    .then(response => {
      dispatch(loadProfile())
      if (response.data && response.data.error) {
        dispatch(handleEnterCodeError(response.data.error))
      } else {
        message.success('Code accepted!')
      }
    })
    .catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        if (error.response.data && error.response.data.error) {
          dispatch(handleEnterCodeError(error.response.data.error))
        } else {
          message.error('An error occurred while entering your code')
        }
        console.log("error.response.data", error.response.data);
        console.log("error.response.status", error.response.status);
        console.log("error.response.headers", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser
        message.error('An error occurred while entering your code')
        console.log("error.request", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        message.error('An error occurred while entering your code')
        console.log("Error", error.message);
      }
      console.log("Error.config", error.config);
    })
}

export const handleEnterCodeError = (error: string): AppThunk => async dispatch => {
  switch (error) {
    case 'JWT_NOT_ACCEPTED':
      message.error('Authorization failed. Please try re-logging in')
      break
    case 'NO_QUEST_FOUND':
      message.error('Error finding your quest. Please try refreshing')
      break
    case 'NO_CODE_AVAILABLE':
      message.error('You don\'t have any code that can be used to complete this quest at this time')
      break
    case 'INVALID_CODE':
      message.error('Code not accepted -- double-check that you entered it correctly')
      break
    case 'CODE_ALREADY_ENTERED':
      message.error('You have already successfully entered your code -- no need to enter it again')
      break
    case 'QUEST_ALREADY_COMPLETED':
      message.error('You have already completed this quest -- no need to enter a code')
      break
    default:
      message.error(error)
      break
  }
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
      message.error("Error generating code (see console for details)")
      console.log("Error generating student code: ", error)
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
      message.error("Error generating code (see console for details)")
      console.log("Error generating universal code: ", error)
    })
}
