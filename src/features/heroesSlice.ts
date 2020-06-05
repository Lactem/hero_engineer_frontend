import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { AppThunk } from "app/store"

import { HeroModel, apiFetchHeroes, apiSaveHero, apiDeleteHero } from "../api/heroesAPI"

interface HeroesState {
  heroes: HeroModel[] | null,
  error: string | null
}

const initialState: HeroesState = {
  heroes: null,
  error: null
}

const heroes = createSlice({
  name: "heroes",
  initialState,
  reducers: {
    fetchHeroesSuccessAction(state, action: PayloadAction<HeroModel[]>) {
      state.heroes = action.payload
      state.error = null
    },
    fetchHeroesFailedAction(state, action: PayloadAction<string>) {
      state.heroes = null
      state.error = action.payload
    }
  }
})

export const {
  fetchHeroesSuccessAction,
  fetchHeroesFailedAction
} = heroes.actions

export default heroes.reducer

export const loadHeroes = (): AppThunk => async dispatch => {
  try {
    const heroes = await apiFetchHeroes()
    dispatch(fetchHeroesSuccessAction(heroes))
  } catch (err) {
    dispatch(fetchHeroesFailedAction(err.toString()))
  }
}

export const saveHero = (
  name: string,
  desc: string,
  id?: string
): AppThunk => async dispatch => {
  apiSaveHero(name, desc, id)
    .then(_ => {
      dispatch(loadHeroes())
      alert("Successfully saved hero")
    })
    .catch(error => {
      alert("Error saving hero (info in console)")
      console.log("error: ", error)
    })
}

export const deleteHero = (id: string): AppThunk => async dispatch => {
  apiDeleteHero(id)
    .then(_ => {
      dispatch(loadHeroes())
      alert("Successfully deleted hero")
    })
    .catch(error => {
      alert("Error deleting hero (info in console)")
      console.log("error: ", error)
    })
}
