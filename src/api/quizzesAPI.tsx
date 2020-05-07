import axios from "axios"
import apiBase from "./api"

export interface QuizModel {
  id: string
  name: string
  locked: boolean
  viewable: boolean
  numQuestions: number
  questionBank: QuizQuestionModel[]
}

export interface QuizQuestionModel {
  id: string
  question: string
  points: number
  answerOptions: QuizAnswerModel[]
}

export interface QuizAnswerModel {
  id: string
  answer: string
  correct: boolean
  // When a student requests a quiz, each "correct" field is set to false
}

export interface GradedQuizModel {
  id: string
  name: string
  gradePercent: number
  viewable: boolean
  questions: GradedQuizQuestionModel[]
}

export interface GradedQuizQuestionModel {
  id: string
  question: string
  points: number
  studentAnswerId: string
  answerOptions: QuizAnswerModel[]
}

export async function apiFetchQuizzes() {
  const url = `${apiBase}/quiz/quizzes`

  const { data } = await axios.get<QuizModel[]>(url)
  return data
}

export async function apiSaveQuiz(name: string,
                                   locked: boolean,
                                   viewable: boolean,
                                   numQuestions: number,
                                   questionBank: QuizQuestionModel[],
                                   id?: string) {
  const url = `${apiBase}/quiz/save`

  return await axios.put(url, {
    id,
    name,
    locked,
    viewable,
    numQuestions,
    questionBank
  })
}

export async function apiDeleteQuiz(id: string) {
  const url = `${apiBase}/quiz/delete/${id}`

  return await axios.delete(url)
}

export interface AnswerModel {
  questionId: string
  answerId: string
}
export async function apiGradeQuiz(questId: string,
                                   quizId: string,
                                   answers: AnswerModel[]) {
  const url = `${apiBase}/quiz/grade`

  return await axios.post(url, {
    questId,
    quizId,
    answers
  })
}
