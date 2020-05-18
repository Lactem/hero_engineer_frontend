import axios from "axios"
import apiBase from "./api"
import { QuestModel } from "./questsAPI"

export interface UserModel {
  email: string
  username: string
  heroId: number
  avatarSVG: string
  avatarDataMale: AvatarDataMaleModel
  avatarDataFemale: AvatarDataFemaleModel
  avatarDataColors: AvatarDataColorsModel
  xp: number
  points: number
  quests: QuestModel[]
  isProf: boolean
}
export interface AvatarDataMaleModel {
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
export interface AvatarDataFemaleModel {
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
                                      avatarDataMale: AvatarDataMaleModel | null,
                                      avatarDataFemale: AvatarDataFemaleModel | null,
                                      avatarDataColors: AvatarDataColorsModel | null) {
  const url = `${apiBase}/user/updateAvatar`

  return await axios.post<string>(url, {
    avatarSVG,
    "avatarDataMale": avatarDataMale,
    "avatarDataFemale": avatarDataFemale,
    "avatarDataColors": avatarDataColors
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

export async function apiRemoveUserFromWhitelist(email: string) {
  const url = `${apiBase}/user/removeFromWhitelist`

  return await axios.post<string>(url, {
    email
  })
}
