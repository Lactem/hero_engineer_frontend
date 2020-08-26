import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { AppThunk } from "app/store"

import {
  apiDeleteShortAnswerAssignment,
  apiGetActiveShortAnswerAssignment,
  apiGetShortAnswerAssignments,
  apiSaveGradedShortAnswerAssignment,
  apiSaveShortAnswerAssignment,
  GradedShortAnswerQuestionModel,
  ShortAnswerAssignmentModel,
  ShortAnswerQuestionModel
} from "../api/shortAnswerAssignmentsAPI"
import { message } from "antd"
import { loadAllUsers, loadProfile } from "./userSlice"

interface ShortAnswerAssignmentsState {
  activeAssignment: ShortAnswerAssignmentModel | null
  activeAssignmentLoading: boolean
  activeAssignmentError: string
  allAssignments: ShortAnswerAssignmentModel[] | null
  allAssignmentsLoading: boolean
  allAssignmentsError: string
  assignmentSubmitting: boolean
}

const initialState: ShortAnswerAssignmentsState = {
  activeAssignment: null,
  activeAssignmentLoading: false,
  activeAssignmentError: "",
  allAssignments: null,
  allAssignmentsLoading: false,
  allAssignmentsError: "",
  assignmentSubmitting: false
}

const shortAnswerAssignments = createSlice({
  name: "shortAnswerAssignments",
  initialState,
  reducers: {
    loadAllAssignmentsSuccessAction(state, action: PayloadAction<ShortAnswerAssignmentModel[]>) {
      state.allAssignments = action.payload
      state.allAssignmentsLoading = false
      state.allAssignmentsError = ""
    },
    loadAllAssignmentsFailedAction(state, action: PayloadAction<string>) {
      state.allAssignments = null
      state.allAssignmentsLoading = false
      state.allAssignmentsError = action.payload
    },
    loadActiveAssignmentStartAction(state) {
      state.activeAssignmentLoading = true
    },
    loadActiveAssignmentSuccessAction(state, action: PayloadAction<ShortAnswerAssignmentModel>) {
      state.activeAssignment = action.payload
      state.activeAssignmentLoading = false
      state.activeAssignmentError = ""
    },
    loadActiveAssignmentFailedAction(state, action: PayloadAction<string>) {
      state.activeAssignment = null
      state.activeAssignmentLoading = false
      state.activeAssignmentError = action.payload
    },
    setAssignmentSubmittingAction(state, action: PayloadAction<boolean>) {
      state.assignmentSubmitting = action.payload
    },
    resetShortAnswerAssignmentsStateAction(state) {
      Object.assign(state, initialState)
    }
  }
})

export const {
  loadAllAssignmentsSuccessAction,
  loadAllAssignmentsFailedAction,
  loadActiveAssignmentStartAction,
  loadActiveAssignmentSuccessAction,
  loadActiveAssignmentFailedAction,
  setAssignmentSubmittingAction,
  resetShortAnswerAssignmentsStateAction
} = shortAnswerAssignments.actions

export default shortAnswerAssignments.reducer

export const loadActiveShortAnswerAssignment = (): AppThunk => async dispatch => {
  try {
    dispatch(loadActiveAssignmentStartAction())
    const activeAssignment = await apiGetActiveShortAnswerAssignment()
    dispatch(loadActiveAssignmentSuccessAction(activeAssignment))
  } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        if (error.response.data.error) {
          if (error.response.data.error === "NOT_IN_CLASS_SECTION") {
            dispatch(loadActiveAssignmentFailedAction("Error: You are not in a class section. Please ask Professor Ramsey to set the class that you're in."))
          } else if (error.response.data.error === "NO_ACTIVE_ASSIGNMENT") {
            dispatch(loadActiveAssignmentFailedAction(""))
          } else {
            dispatch(loadActiveAssignmentFailedAction(error.response.data.error))
          }
        } else {
          dispatch(loadActiveAssignmentFailedAction("Error loading in-class assignment"))
        }
        console.log("error.response.data", error.response.data);
        console.log("error.response.status", error.response.status);
        console.log("error.response.headers", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser
        dispatch(loadActiveAssignmentFailedAction("Error loading in-class assignment"))
        console.log("error.request", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        dispatch(loadActiveAssignmentFailedAction("Error loading in-class assignment"))
        console.log("Error", error.message);
      }
      console.log("Error.config", error.config);
    }
}

export const loadShortAnswerAssignments = (): AppThunk => async dispatch => {
  try {
    const allAssignments = await apiGetShortAnswerAssignments()
    dispatch(loadAllAssignmentsSuccessAction(allAssignments))
  } catch (err) {
    dispatch(loadAllAssignmentsFailedAction(err.toString()))
  }
}

export const saveShortAnswerAssignment = (
  name: string,
  questions: ShortAnswerQuestionModel[],
  sectionIdsAvailableFor: string[],
  sectionIdsGradesAvailableFor: string[],
  maxXp: number,
  id?: string
): AppThunk => async dispatch => {
  apiSaveShortAnswerAssignment(
    name,
    questions,
    sectionIdsAvailableFor,
    sectionIdsGradesAvailableFor,
    maxXp,
    id)
    .then(_ => {
      dispatch(loadShortAnswerAssignments())
      message.success("Successfully saved in-class assignment")
    })
    .catch(error => {
      message.error("Error saving in-class assignment (info in console)")
      console.log("error: ", error)
    })
}

export const deleteShortAnswerAssignment = (id: string): AppThunk => async dispatch => {
  apiDeleteShortAnswerAssignment(id)
    .then(_ => {
      dispatch(loadShortAnswerAssignments())
      message.success("Successfully deleted in-class assignment")
    })
    .catch(error => {
      message.error("Error deleting in-class assignment (info in console)")
      console.log("error: ", error)
    })
}

export const saveGradedShortAnswerAssignment = (
  id: string,
  name: string,
  gradedQuestions: GradedShortAnswerQuestionModel[],
  available: boolean,
  graded: boolean,
  xpAwarded: number,
  maxXp: number,
  feedback: string,
  email: string,
  professorInitiated: boolean
): AppThunk => async dispatch => {
  dispatch(setAssignmentSubmittingAction(true))
    apiSaveGradedShortAnswerAssignment(
      id,
      name,
      gradedQuestions,
      available,
      graded,
      xpAwarded,
      maxXp,
      feedback,
      email
    ).then(_ => {
      if (professorInitiated) {
        message.success("Successfully graded in-class assignment")
        dispatch(loadAllUsers())
      } else {
        dispatch(loadProfile())
      }
      setTimeout(() => {
        dispatch(setAssignmentSubmittingAction(false))
      }, 500)
    }).catch((error: any) => {
      setTimeout(() => {
        dispatch(setAssignmentSubmittingAction(false))
      }, 500)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        if (error.response.data.error) {
          if (error.response.data.error === "INVALID_ASSIGNMENT") {
            message.error("Error: invalid assignment")
          } else if (error.response.data.error === "ASSIGNMENT_ALREADY_GRADED") {
            console.log("Student submitted an assignment ( ", name, " ) that was already submitted.")
          } else {
            dispatch(loadActiveAssignmentFailedAction(error.response.data.error))
          }
        } else {
          dispatch(loadActiveAssignmentFailedAction("Error loading in-class assignment"))
        }
        console.log("error.response.data", error.response.data);
        console.log("error.response.status", error.response.status);
        console.log("error.response.headers", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser
        dispatch(loadActiveAssignmentFailedAction("Error loading in-class assignment"))
        console.log("error.request", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        dispatch(loadActiveAssignmentFailedAction("Error loading in-class assignment"))
        console.log("Error", error.message);
      }
      console.log("Error.config", error.config);
    })
}
