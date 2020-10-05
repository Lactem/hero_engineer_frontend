import axios from "axios"
import apiBase from "./api"

export interface HeroCouncilModel {
  id: string
  name: string
  emails: string[]
  approved: boolean
  declarationFileName: string
  announcements: AnnouncementModel[]
  questInfos: QuestInfoModel[]
}
export interface GrandChallengeModel {
  id: string
  code: string
  grandChallenge: string
}
export interface AnnouncementModel {
  num: number
  text: string
}
export interface QuestInfoModel {
  questId: string
  code: string
}

export async function apiLoadAllHeroCouncils() {
  const url = `${apiBase}/herocouncil/herocouncils`

  return await axios.get<HeroCouncilModel[]>(url)
}

export async function apiLoadHeroCouncil() {
  const url = `${apiBase}/herocouncil/herocouncil`

  return await axios.get<HeroCouncilModel>(url)
}

export async function apiSaveHeroCouncil(name: string,
                                         emails: string[],
                                         approved: boolean,
                                         declarationFileName: string,
                                         announcements: AnnouncementModel[],
                                         questInfos: QuestInfoModel[],
                                         id?: string) {
  const url = `${apiBase}/herocouncil/save`

  return await axios.post<HeroCouncilModel>(url, {
    id,
    name,
    emails,
    approved,
    declarationFileName,
    announcements,
    questInfos
  })
}

export async function apiRemoveHeroCouncil(id: string) {
  const url = `${apiBase}/herocouncil/remove/${id}`

  return await axios.delete(url)
}

export async function apiLoadAllGrandChallenges() {
  const url = `${apiBase}/herocouncil/grandChallenges`

  return await axios.get<GrandChallengeModel[]>(url)
}

export async function apiSaveGrandChallenge(grandChallenge: string,
                                            code: string,
                                            id: string) {
  const url = `${apiBase}/herocouncil/saveGrandChallenge`

  return await axios.put<string>(url, {
    id,
    grandChallenge,
    code
  })
}

export async function apiEnterCodeForGrandChallenge(code: string) {
  const url = `${apiBase}/herocouncil/enterGrandChallengeCode`

  return await axios.post<string>(url, { code })
}

export async function apiGenerateCodeForGrandChallenge(grandChallengeId: string) {
  const url = `${apiBase}/herocouncil/generateGrandChallengeCode`

  return await axios.put<string>(url, { grandChallengeId })
}

export async function apiGenerateCodeForHeroCouncil(heroCouncilId: string, questId: string) {
  const url = `${apiBase}/herocouncil/generateHeroCouncilCode`;

  return await axios.put<string>(url, {
    heroCouncilId,
    questId
  })
}
