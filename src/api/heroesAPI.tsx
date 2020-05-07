import axios from "axios"
import apiBase from "./api"

export interface HeroModel {
  id: string
  name: string
  desc: string
}

export async function apiFetchHeroes() {
  const url = `${apiBase}/hero/heroes`

  const { data } = await axios.get<HeroModel[]>(url)
  return data
}

export async function apiSaveHero(name: string, desc: string, id?: string) {
  const url = `${apiBase}/hero/save`

  return await axios.put(url, {
    id,
    name,
    desc
  })
}

export async function apiDeleteHero(id: string) {
  const url = `${apiBase}/hero/delete/${id}`

  return await axios.delete(url)
}
