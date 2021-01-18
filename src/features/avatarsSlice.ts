import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { AppThunk } from "app/store"

import { AllAvatarBodyZonesModel, apiFetchAvatarsConfig } from "../api/avatarsAPI"

interface AvatarsState {
  avatarsConfig: AllAvatarBodyZonesModel | null,
  avatarsConfigLoading: boolean
  error: string | null
}

const initialState: AvatarsState = {
  avatarsConfig: null,
  avatarsConfigLoading: false,
  error: null
}

const avatars = createSlice({
  name: "avatars",
  initialState,
  reducers: {
    setAvatarsConfigLoading(state) {
      state.avatarsConfigLoading = true
    },
    fetchAvatarsConfigSuccessAction(state, action: PayloadAction<AllAvatarBodyZonesModel>) {
      state.avatarsConfig = action.payload
      state.avatarsConfigLoading = false
      state.error = null
    },
    fetchAvatarsConfigFailedAction(state, action: PayloadAction<string>) {
      state.avatarsConfig = null
      state.avatarsConfigLoading = false
      state.error = action.payload
    },
    resetAvatarStateAction(state) {
      Object.assign(state, initialState)
    }
  }
})

export const {
  setAvatarsConfigLoading,
  fetchAvatarsConfigSuccessAction,
  fetchAvatarsConfigFailedAction,
  resetAvatarStateAction
} = avatars.actions

export default avatars.reducer

export const loadAvatarsConfig = (): AppThunk => async dispatch => {
  try {
    dispatch(setAvatarsConfigLoading())
    const avatars = await apiFetchAvatarsConfig()
    dispatch(fetchAvatarsConfigSuccessAction(avatars))
  } catch (err) {
    console.log("avatarsConfig err: " + err)
    dispatch(fetchAvatarsConfigFailedAction(err.toString()))
  }
}
