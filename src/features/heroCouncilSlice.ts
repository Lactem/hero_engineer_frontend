import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { AppThunk } from "app/store"
import {
  apiEnterCodeForGrandChallenge, apiGenerateCodeForGrandChallenge,
  apiLoadAllGrandChallenges, apiLoadAllHeroCouncils,
  apiLoadHeroCouncil, apiSaveGrandChallenge,
  GrandChallengeModel,
  HeroCouncilModel
} from "../api/heroCouncilAPI"

import { message } from "antd"
import { loadProfile } from "./userSlice"


interface HeroCouncilState {
  heroCouncil: HeroCouncilModel | null
  allHeroCouncils: HeroCouncilModel[] | null
  allGrandChallenges: GrandChallengeModel[] | null
  error: string | null
}

const initialState: HeroCouncilState = {
  heroCouncil: null,
  allHeroCouncils: null,
  allGrandChallenges: null,
  error: null
}

const heroCouncil = createSlice({
  name: "heroCouncil",
  initialState,
  reducers: {
    loadHeroCouncilSuccessAction(state, action: PayloadAction<HeroCouncilModel>) {
      state.heroCouncil = action.payload
    },
    loadAllHeroCouncilsSuccessAction(state, action: PayloadAction<HeroCouncilModel[]>) {
      state.allHeroCouncils = action.payload
    },
    loadAllGrandChallengesSuccessAction(state, action: PayloadAction<GrandChallengeModel[]>) {
      state.allGrandChallenges = action.payload
    },
    loadFailedAction(state, action: PayloadAction<string>) {
      state.error = action.payload
    }
  }
})

export const {
  loadHeroCouncilSuccessAction,
  loadAllHeroCouncilsSuccessAction,
  loadAllGrandChallengesSuccessAction,
  loadFailedAction
} = heroCouncil.actions

export default heroCouncil.reducer

export const loadHeroCouncil = (): AppThunk => async dispatch => {
  apiLoadHeroCouncil()
    .then(response => {
      dispatch(loadHeroCouncilSuccessAction(response.data))
    })
    .catch(error => {
      console.log(error.toJSON())
      console.log(error.toString())
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("error.response.data", error.response.data);
        console.log("error.response.status", error.response.status);
        console.log("error.response.headers", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser
        console.log("error.request", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log("Error.config", error.config);
      dispatch(loadFailedAction("There was a problem loading your hero council. Please try again."))
    })
}

export const loadAllHeroCouncils = (): AppThunk => async dispatch => {
  apiLoadAllHeroCouncils()
    .then(result => {
      dispatch(loadAllHeroCouncilsSuccessAction(result.data))
    })
    .catch(error => {
      message.error("An error occurred while loading hero councils")
      console.log(error)
    })
}

export const loadAllGrandChallenges = (): AppThunk => async dispatch => {
  apiLoadAllGrandChallenges()
    .then(result => {
      dispatch(loadAllGrandChallengesSuccessAction(result.data))
    })
    .catch(error => {
      message.error("An error occurred while loading hero councils")
      console.log(error)
    })
}

export const saveGrandChallenge = (
  grandChallenge: string,
  code: string,
  id: string
): AppThunk => async dispatch => {
  apiSaveGrandChallenge(grandChallenge, code, id)
    .then(_ => {
      message.success("Saved grand challenge category")
      dispatch(loadAllGrandChallenges())
    })
    .catch(error => {
      alert("Error saving class section(see console for details)")
      console.log(error)
    })
}

export const enterCodeForGrandChallenge = (
  code: string,
  successCallback?: Function
): AppThunk => async dispatch => {
  apiEnterCodeForGrandChallenge(code)
    .then(_ => {
      dispatch(loadProfile())
      if (successCallback) successCallback()
    })
    .catch(error => {
      message.error("Invalid code")
      console.log("Code error: ", error)
    })
}

export const generateCodeForGrandChallenge = (
  grandChallengeId: string
): AppThunk => async dispatch => {
  apiGenerateCodeForGrandChallenge(grandChallengeId)
    .then(_ => {
      dispatch(loadAllGrandChallenges())
      message.success("Generated random code")
    })
    .catch(error => {
      message.error("Couldn't generate code (see console for errors)")
      console.log("Grand challenge code generation error: ", error)
    })
}

