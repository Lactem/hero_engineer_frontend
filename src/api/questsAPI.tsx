import axios from "axios"
import apiBase from "./api"
import { GradedQuizModel } from "./quizzesAPI"

export interface QuestModel {
  id: string
  name: string
  description: string
  automaticXpReward: number
  main: boolean
  complete: boolean
  completeWithQuizzes: boolean
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
                                   complete: boolean,
                                   completeWithQuizzes: boolean,
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
    complete,
    completeWithQuizzes,
    incompleteQuizIds,
    completedQuizzes,
    requiredQuestIds
  })
}

export async function apiDeleteQuest(id: string) {
  const url = `${apiBase}/quest/delete/${id}`

  return await axios.delete(url)
}
