import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { AppThunk } from "app/store"

import {
  AnswerModel,
  apiDeleteQuiz,
  apiFetchQuizzes,
  apiGradeQuiz,
  apiSaveQuiz,
  QuizModel,
  QuizQuestionModel
} from "../../api/quizzesAPI"
import { loadProfile } from "../user/userSlice"

interface QuizzesState {
  quizzes: QuizModel[] | null
  quizzesLoading: boolean
  quizzesError: string
  quizGrading: boolean
  quizGradingError: string
}

const initialState: QuizzesState = {
  quizzes: null,
  quizzesLoading: false,
  quizzesError: "",
  quizGrading: false,
  quizGradingError: ""
}

const quizzes = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    fetchQuizzesStartAction(state) {
      state.quizzesLoading = true
    },
    fetchQuizzesSuccessAction(state, action: PayloadAction<QuizModel[]>) {
      state.quizzes = action.payload
      state.quizzesLoading = false
      state.quizzesError = ""
    },
    fetchQuizzesFailedAction(state, action: PayloadAction<string>) {
      state.quizzes = null
      state.quizzesLoading = false
      state.quizzesError = action.payload
    },
    gradeQuizStartAction(state) {
      state.quizGrading = true
    },
    gradeQuizSuccessAction(state) {
      state.quizGrading = false
      state.quizGradingError = ""
    },
    gradeQuizFailedAction(state, action: PayloadAction<string>) {
      state.quizGrading = false
      state.quizGradingError = action.payload
    },
    resetQuizzesStateAction(state) {
      Object.assign(state, initialState)
    }
  }
})

export const {
  fetchQuizzesStartAction,
  fetchQuizzesSuccessAction,
  fetchQuizzesFailedAction,
  gradeQuizStartAction,
  gradeQuizSuccessAction,
  gradeQuizFailedAction,
  resetQuizzesStateAction
} = quizzes.actions

export default quizzes.reducer

export const loadQuizzes = (): AppThunk => async dispatch => {
  try {
    dispatch(fetchQuizzesStartAction())
    const quizzes = await apiFetchQuizzes()
    dispatch(fetchQuizzesSuccessAction(quizzes))
  } catch (err) {
    dispatch(fetchQuizzesFailedAction(err.toString()))
  }
}

export const saveQuiz = (
  name: string,
  locked: boolean,
  viewable: boolean,
  numQuestions: number,
  questionBank: QuizQuestionModel[],
  id?: string
): AppThunk => async dispatch => {
  apiSaveQuiz(
    name,
    locked,
    viewable,
    numQuestions,
    questionBank,
    id
  )
    .then(_ => {
      dispatch(loadQuizzes())
      alert("Successfully saved quiz")
    })
    .catch(error => {
      alert("Error saving quiz (info in console)")
      console.log("error: ", error)
    })
}

export const deleteQuiz = (id: string): AppThunk => async dispatch => {
  apiDeleteQuiz(id)
    .then(_ => {
      dispatch(loadQuizzes())
      alert("Successfully deleted quiz")
    })
    .catch(error => {
      alert("Error deleting quiz (info in console)")
      console.log("error: ", error)
    })
}

export const gradeQuiz = (
  questId: string,
  quizId: string,
  answers: AnswerModel[]
): AppThunk => async dispatch => {
  dispatch(gradeQuizStartAction())
  apiGradeQuiz(
    questId,
    quizId,
    answers
  )
    .then(_ => {
      dispatch(gradeQuizSuccessAction())
      dispatch(loadQuizzes())
      dispatch(loadProfile())
    })
    .catch(error => {
      dispatch(gradeQuizFailedAction(error.toString()))
    })
}
