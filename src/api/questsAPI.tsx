import axios from "axios"
import apiBase from "./api"
import { GradedQuizModel } from "./quizzesAPI"

export interface QuestModel {
  id: string
  name: string
  description: string
  automaticXpReward: number
  main: boolean
  available: boolean
  complete: boolean
  completeWithQuizzes: boolean
  completeWithCode: boolean
  completeWithQuizzesAndCode: boolean
  codeEnteredSuccessfully: boolean
  code: string
  universalCode: string
  incompleteQuizIds: string[]
  completedQuizzes: GradedQuizModel[]
  requiredQuestIds: string[]
}

export async function apiFetchQuests() {
  const url = `${apiBase}/quest/quests`

  const { data } = await axios.get<QuestModel[]>(url)
  return data
}

export async function apiSaveQuest(name: string,
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
                                   id?: string) {
  const url = `${apiBase}/quest/save`

  return await axios.put(url, {
    id,
    name,
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
    requiredQuestIds
  })
}

export async function apiDeleteQuest(id: string) {
  const url = `${apiBase}/quest/delete/${id}`

  return await axios.delete(url)
}

export async function apiEnterCode(questId: string, code: string) {
  const url = `${apiBase}/quest/enterCode`

  return await axios.post(url, {
    questId,
    code
  })
}

export async function apiGenerateCode(userEmail:string, questId: string) {
  const url = `${apiBase}/quest/generateCode`

  return await axios.put(url, {
    userEmail,
    questId
  })
}

export async function apiGenerateUniversalCode(questId: string) {
  const url = `${apiBase}/quest/generateUniversalCode`

  return await axios.put(url, {
    questId
  })
}
