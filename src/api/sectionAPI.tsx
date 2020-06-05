import axios from "axios"
import apiBase from "./api"
import { UserModel } from "./userAPI"

export interface SectionModel {
  id: string
  name: string
  emails: string[]
}

export async function apiLoadAllSections() {
  const url = `${apiBase}/section/sections`

  return await axios.get<SectionModel[]>(url)
}

export async function apiLoadSection() {
  const url = `${apiBase}/section/section`

  return await axios.get<SectionModel>(url)
}

export async function apiLoadClassmates() {
  const url = `${apiBase}/section/classmates`

  return await axios.get<UserModel[]>(url)
}

export async function apiSaveSection(name: string,
                                     emails: string[],
                                     id?: string) {
  const url = `${apiBase}/section/save`

  return await axios.put<string>(url, {
    id,
    name,
    emails
  })
}

export async function apiRemoveSection(id: string) {
  const url = `${apiBase}/section/delete/${id}`

  return await axios.delete<string>(url)
}
