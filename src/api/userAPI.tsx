import axios from "axios"
import apiBase from "./api"
import { QuestModel } from "./questsAPI"
import { GradedShortAnswerAssignmentModel } from "./shortAnswerAssignmentsAPI"

export interface UserModel {
  email: string
  username: string
  heroId: number
  avatarSVG: string
  avatarData: AvatarDataModel
  avatarDataColors: AvatarDataColorsModel
  avatarUnlockedBodyZoneShapes: string[]
  xp: number
  points: number
  quests: QuestModel[]
  gradedShortAnswerAssignments: GradedShortAnswerAssignmentModel[]
  grandChallengeCategory: string
  grandChallengeCode: string
  idea1: string
  idea2: string
  idea3: string
  isProf: boolean
  resetPasswordOnLogin: boolean
  xpBreakdown?: any
}
export interface AvatarDataModel {
  backs: number
  chinshadow: number
  clothes: number
  ears: number
  eyebrows: number
  eyesback: number
  eyesfront: number
  eyesiris: number
  facehighlight: number
  faceshape: number
  glasses: number
  hair: number
  humanbody: number
  mouth: number
  nose: number
  beard: number
  mustache: number
}
export interface AvatarDataColorsModel {
  backs: number
  chinshadow: number
  clothes: number
  ears: number
  eyebrows: number
  eyesback: number
  eyesfront: number
  eyesiris: number
  facehighlight: number
  faceshape: number
  glasses: number
  hair: number
  humanbody: number
  mouth: number
  nose: number
  beard: number
  mustache: number
}

export interface UserWhitelistModel {
  id: string
  emails: string[]
}

export function setupJwtInterceptor(token: string): number {
  return axios.interceptors.request.use(
    config => {
      config.headers.authorization = token
      return config
    }
  )
}

export function teardownJwtInterceptor(id: number) {
  axios.interceptors.request.eject(id)
}

export async function logInUser(email: string, password: string) {
  const url = `${apiBase}/authenticate`

  return await axios.post<{ token: string }>(url, {
    "username": email,
    password
  })
}

// Backend extracts email from JWT, so there's no need to specify it
export async function apiLoadProfile() {
  const url = `${apiBase}/user/profile`

  return await axios.get<UserModel>(url)
}

export async function apiLoadProfessorAvatar() {
  const url = `${apiBase}/user/professorAvatar`

  return await axios.get<string>(url)
}

export async function signUpUser(email: string,
                                 username: string,
                                 password: string,
                                 heroId: string) {
  const url = `${apiBase}/user/create`

  return await axios.post<string>(url, {
    email,
    username,
    password,
    heroId
  })
}

export async function apiUpdateAvatar(avatarSVG: string,
                                      avatarData: AvatarDataModel | null,
                                      avatarDataColors: AvatarDataColorsModel | null) {
  const url = `${apiBase}/user/updateAvatar`

  return await axios.post<string>(url, {
    avatarSVG,
    "avatarData": avatarData,
    "avatarDataColors": avatarDataColors
  })
}

export async function apiSetIdeas(
  idea1: string,
  idea2: string,
  idea3: string) {
  const url = `${apiBase}/user/setIdeas`

  return await axios.post<string>(url, {
    idea1,
    idea2,
    idea3
  })
}

export async function apiLoadAllUsers() {
  const url = `${apiBase}/user/allUsers`

  return await axios.get<UserModel[]>(url)
}

export async function apiGetWhitelist() {
  const url = `${apiBase}/user/getWhitelist`

  return await axios.get<UserWhitelistModel>(url)
}

export async function apiAddUserToWhitelist(email: string) {
  const url = `${apiBase}/user/addToWhitelist`

  return await axios.post<string>(url, {
    email
  })
}

export async function apiResetPassword(email: string, resetPassword: boolean) {
  const url = `${apiBase}/user/resetPassword`

  return await axios.post<string>(url, {
    email,
    resetPassword
  })
}

export async function apiSetPassword(email: string, password: string) {
  const url = `${apiBase}/user/setPassword`

  return await axios.post<string>(url, {
    email,
    password
  })
}

export async function apiRemoveUserFromWhitelist(email: string) {
  const url = `${apiBase}/user/removeFromWhitelist`

  return await axios.post<string>(url, {
    email
  })
}

export async function apiAddXP(email: string, xp: number, reason: string) {
  const url = `${apiBase}/user/addXP`

  return await axios.post<string>(url, {
    email,
    xp,
    reason
  })
}

export async function apiGetXPBreakdown(email: string) {
  const url = `${apiBase}/user/XPBreakdown/${email}`;

  return await axios.get(url)
}

export async function apiGetXPHistory(email: string) {
  const url = `${apiBase}/user/XPHistory/${email}`;

  return await axios.get(url)
}
