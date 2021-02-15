import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { AppThunk } from "app/store"
import {
  AnnouncementModel,
  apiEnterCodeForGrandChallenge, apiGenerateCodeForGrandChallenge, apiGenerateCodeForHeroCouncil,
  apiLoadAllGrandChallenges, apiLoadAllHeroCouncils,
  apiLoadMyHeroCouncils, apiRemoveHeroCouncil, apiSaveGrandChallenge, apiSaveHeroCouncil,
  GrandChallengeModel,
  HeroCouncilModel, QuestInfoModel
} from "../api/heroCouncilAPI"

import { message } from "antd"
import { loadProfile } from "./userSlice"


interface HeroCouncilState {
  heroCouncilsLoading: boolean
  heroCouncils: HeroCouncilModel[] | null
  allHeroCouncils: HeroCouncilModel[] | null
  allGrandChallenges: GrandChallengeModel[] | null
  error: string | null
}

const initialState: HeroCouncilState = {
  heroCouncilsLoading: false,
  heroCouncils: null,
  allHeroCouncils: null,
  allGrandChallenges: null,
  error: null
}

const heroCouncil = createSlice({
  name: "heroCouncil",
  initialState,
  reducers: {
    startLoadingMyHeroCouncilsAction(state) {
      state.heroCouncilsLoading = true
    },
    loadMyHeroCouncilsSuccessAction(state, action: PayloadAction<HeroCouncilModel[]>) {
      state.heroCouncils = action.payload
      state.heroCouncilsLoading = false
    },
    loadMyHeroCouncilsFailedAction(state) {
      state.heroCouncilsLoading = false
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
  startLoadingMyHeroCouncilsAction,
  loadMyHeroCouncilsSuccessAction,
  loadMyHeroCouncilsFailedAction,
  loadAllHeroCouncilsSuccessAction,
  loadAllGrandChallengesSuccessAction,
  loadFailedAction
} = heroCouncil.actions

export default heroCouncil.reducer

// Loads hero councils that the user is a part of
export const loadMyHeroCouncils = (): AppThunk => async dispatch => {
  dispatch(startLoadingMyHeroCouncilsAction())
  apiLoadMyHeroCouncils()
    .then(response => {
      dispatch(loadMyHeroCouncilsSuccessAction(response.data))
    })
    .catch(error => {
      dispatch(loadMyHeroCouncilsFailedAction())
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

export const saveHeroCouncil = (
  successMessage: string,
  name: string,
  emails: string[],
  approved: boolean,
  declarationFileName: string,
  announcements: AnnouncementModel[],
  questInfos: QuestInfoModel[],
  id?: string
): AppThunk => async dispatch => {
  apiSaveHeroCouncil(name, emails, approved, declarationFileName, announcements, questInfos, id)
    .then(_ => {
      message.success(successMessage)
      dispatch(loadAllHeroCouncils())
    })
    .catch(error => {
      message.error("Error saving Hero Council (see console for details)")
      console.log(error)
    })
}

export const removeHeroCouncil = (id: string): AppThunk => async dispatch => {
  apiRemoveHeroCouncil(id)
    .then(_ => {
      message.success("Deleted Hero Council")
      dispatch(loadAllHeroCouncils())
    })
    .catch(error => {
      message.error("Error deleting Hero Council (see console for details)")
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
      message.error("Error saving grand challenge category (see console for details)")
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
      console.log("Error entering code for grand challenge: ", error)
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
      message.error("Couldn't generate grand challenge code (see console for errors)")
      console.log("Grand challenge code generation error: ", error)
    })
}

export const generateCodeForHeroCouncil = (
  heroCouncilId: string,
  questId: string
): AppThunk => async dispatch => {
  apiGenerateCodeForHeroCouncil(heroCouncilId, questId)
    .then(_ => {
      dispatch(loadAllHeroCouncils())
      message.success("Generated random code")
    })
    .catch(error => {
      message.error("Couldn't generate Hero Council code (see console for errors)")
      console.log("Grand challenge code generation error: ", error)
    })
}

