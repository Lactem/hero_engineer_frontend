import axios from "axios"
import apiBase from "./api"

export interface ShortAnswerAssignmentModel {
  id: string
  name: string
  questions: ShortAnswerQuestionModel[]
  sectionIdsAvailableFor: string[]
  sectionIdsGradesAvailableFor: string[]
  maxXp: number
}

export interface ShortAnswerQuestionModel {
  id: string
  question: string
}

export interface GradedShortAnswerAssignmentModel {
  id: string
  name: string
  gradedQuestions: GradedShortAnswerQuestionModel[]
  available: boolean
  graded: boolean
  xpAwarded: number
  maxXp: number
  feedback?: string
}

export interface GradedShortAnswerQuestionModel {
  id: string
  question: string
  answer: string
}

export async function apiGetActiveShortAnswerAssignment() {
  const url = `${apiBase}/ShortAnswerAssignment/active`

  const { data } = await axios.get<ShortAnswerAssignmentModel>(url)
  return data
}

export async function apiGetShortAnswerAssignments() {
  const url = `${apiBase}/ShortAnswerAssignment/assignments`

  const { data } = await axios.get<ShortAnswerAssignmentModel[]>(url)
  return data
}

export async function apiSaveShortAnswerAssignment(name: string,
                                                   questions: ShortAnswerQuestionModel[],
                                                   sectionIdsAvailableFor: string[],
                                                   sectionIdsGradesAvailableFor: string[],
                                                   maxXp: number,
                                                   id?: string) {
  const url = `${apiBase}/ShortAnswerAssignment/save`

  return await axios.put(url, {
    id,
    name,
    questions,
    sectionIdsAvailableFor,
    sectionIdsGradesAvailableFor,
    maxXp
  })
}

export async function apiDeleteShortAnswerAssignment(id: string) {
  const url = `${apiBase}/ShortAnswerAssignment/delete/${id}`

  return await axios.delete(url)
}

export async function apiSaveGradedShortAnswerAssignment(id: string,
                                                         name: string,
                                                         gradedQuestions: GradedShortAnswerQuestionModel[],
                                                         available: boolean,
                                                         graded: boolean,
                                                         xpAwarded: number,
                                                         maxXp: number,
                                                         feedback: string,
                                                         email: string
) {
  const url = `${apiBase}/ShortAnswerAssignment/saveGraded`

  return await axios.post(url, {
    gradedAssignment: {
      id,
      name,
      gradedQuestions,
      available,
      graded,
      xpAwarded,
      maxXp,
      feedback
    },
    email
  })
}
