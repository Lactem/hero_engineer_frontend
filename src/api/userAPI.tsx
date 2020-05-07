import axios from "axios"
import apiBase from "./api"
import { QuestModel } from "./questsAPI"

export interface UserModel {
  email: string
  username: string
  heroId: number
  xp: number
  points: number
  quests: QuestModel[]
  isProf: boolean
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
export async function loadUserProfile() {
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
