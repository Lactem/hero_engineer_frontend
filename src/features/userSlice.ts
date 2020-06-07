import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppThunk } from "app/store"

import jwt_decode from "jwt-decode";

import { resetQuestsStateAction } from "./questsSlice"
import { resetQuizzesStateAction } from "./quizzesSlice"
import { resetSectionStateAction } from "./sectionSlice"
import {
  UserModel,
  logInUser,
  signUpUser,
  setupJwtInterceptor,
  teardownJwtInterceptor,
  apiUpdateAvatar,
  AvatarDataFemaleModel,
  AvatarDataMaleModel,
  AvatarDataColorsModel,
  apiLoadProfile,
  apiLoadAllUsers,
  apiAddUserToWhitelist,
  apiRemoveUserFromWhitelist,
  apiGetWhitelist,
  UserWhitelistModel, apiSetIdeas
} from "../api/userAPI"


interface UserState {
  user: UserModel | null
  isAuthenticated: boolean | null
  loginLoading: boolean
  userError: string
  jwtAxiosId: number | null
  onLandingPage: boolean
  allUsers: UserModel[] | null
  userWhitelist: UserWhitelistModel | null
}

const initialState: UserState = {
  user: null,
  isAuthenticated: null,
  loginLoading: false,
  userError: "",
  jwtAxiosId: null,
  onLandingPage: true,
  allUsers: null,
  userWhitelist: null
}

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuthenticationCheckedAction(state) {
      if (state.isAuthenticated === null) state.isAuthenticated = false
    },
    loginSuccessAction(state) {
      state.userError = ""
      state.isAuthenticated = true
      state.loginLoading = false
    },
    loginFailedAction(state, action: PayloadAction<string>) {
      state.user = null
      state.userError = action.payload
      state.isAuthenticated = false
      state.loginLoading = false
    },
    logoutAction(state) {
      state.isAuthenticated = false
      state.user = null
      state.userError = ""
    },
    setTokenAction(state, action: PayloadAction<string | null>) {
      const token = action.payload
      if (token === null) {
        teardownJwtInterceptor(state.jwtAxiosId as number)
        state.jwtAxiosId = null
      } else {
        const decodedToken = jwt_decode<{ exp: number }>(token)
        setCookie("HERO_ENGINEER", token, decodedToken.exp);
        state.jwtAxiosId = setupJwtInterceptor("Bearer " + token)
      }
    },
    loadProfileSuccessAction(state, action: PayloadAction<UserModel>) {
      state.user = action.payload
      state.userError = ""
    },
    loadProfileFailedAction(state, action: PayloadAction<string>) {
      state.userError = action.payload
    },
    signUpFailedAction(state, action: PayloadAction<string>) {
      state.userError = action.payload
    },
    updateAvatarSuccessAction(state, action: PayloadAction<string>) {
      state.user = Object.assign(state.user, {"avatar": action.payload})
    },
    loadAllUsersSuccessAction(state, action: PayloadAction<UserModel[]>) {
      state.allUsers = action.payload
    },
    loadWhitelistSuccessAction(state, action: PayloadAction<UserWhitelistModel>) {
      state.userWhitelist = action.payload
    }
  }
})

export const {
  setAuthenticationCheckedAction,
  loginSuccessAction,
  loginFailedAction,
  logoutAction,
  setTokenAction,
  loadProfileSuccessAction,
  loadProfileFailedAction,
  signUpFailedAction,
  updateAvatarSuccessAction,
  loadAllUsersSuccessAction,
  loadWhitelistSuccessAction
} = user.actions

export default user.reducer

// TODO: Store refresh token instead of JWT. Needs backend changes
export const logIn = (
  email: string,
  password: string
): AppThunk => async dispatch => {
  logInUser(email, password)
    .then(response => {
      dispatch(loginSuccessAction())
      dispatch(setTokenAction(response.data.token))
      dispatch(loadProfile())
    })
    .catch(error => {
      console.log("loginUser error")
      if (error.response && error.response.data && error.response.data.error) {
        dispatch(loginFailedAction(error.response.data.error))
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser
        console.log("error.request", error.request);
        dispatch(loginFailedAction("Wrong email/password combination"))
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
        dispatch(loginFailedAction("Wrong email/password combination"))
      }
      console.log("Error.config", error.config);
    })
}

export const loadProfile = (): AppThunk => async dispatch => {
  apiLoadProfile()
    .then(response => {
      dispatch(loadProfileSuccessAction(response.data))
    })
    .catch(error => {
      console.log("loadUserProfile error")
      console.log(error.toJSON())
      console.log(error.toString())
      if (error.response) {
        if (error.response.status === 401) {
          dispatch(logOut())
          return
        }
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
      dispatch(loadProfileFailedAction("There was a problem loading your Hero profile. Please try again."))
    })
}

export const logOut = (): AppThunk => async dispatch => {
  dispatch(setTokenAction(null))
  dispatch(logoutAction())
  dispatch(resetQuestsStateAction())
  dispatch(resetQuizzesStateAction())
  dispatch(resetSectionStateAction())
  document.cookie = "HERO_ENGINEER="
}

export const signUp = (
  email: string,
  username: string,
  password: string,
  heroId: string
): AppThunk => async dispatch => {
  signUpUser(email, username, password, heroId)
    .then(_ => {
      dispatch(logIn(email, password))
    }).catch(error => {
    if (error.response) {
      if (error.response.data.error) {
        dispatch(signUpFailedAction(error.response.data.error))
      }
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
  })
}

export const updateAvatar = (
  avatar: string,
  avatarDataMale: AvatarDataMaleModel | null,
  avatarDataFemale: AvatarDataFemaleModel | null,
  avatarDataColors: AvatarDataColorsModel | null,
  successCallback: Function): AppThunk => async dispatch => {
  apiUpdateAvatar(avatar, avatarDataMale, avatarDataFemale, avatarDataColors)
    .then(_ => {
      dispatch(updateAvatarSuccessAction(avatar))
      dispatch(loadProfile())
      successCallback()
    }).catch(error => {
    if (error.response) {
      if (error.response.data.error) {
        dispatch(signUpFailedAction(error.response.data.error))
      }
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
  })
}

export const setIdeas = (
  idea1: string,
  idea2: string,
  idea3: string,
  successCallback?: Function): AppThunk => async dispatch => {
  apiSetIdeas(idea1, idea2, idea3)
    .then(_ => {
      dispatch(loadProfile())
      if (successCallback) successCallback()
    }).catch(error => {
    if (error.response) {
      if (error.response.data.error) {
        dispatch(signUpFailedAction(error.response.data.error))
      }
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("error.response.data", error.response.data)
      console.log("error.response.status", error.response.status)
      console.log("error.response.headers", error.response.headers)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser
      console.log("error.request", error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message)
    }
    console.log("Error.config", error.config)
  })
}


export const loadAllUsers = (): AppThunk => async dispatch => {
  apiLoadAllUsers()
    .then(result => {
      dispatch(loadAllUsersSuccessAction(result.data))
    })
    .catch(error => {
      alert("An error occurred while loading student data")
      console.log(error)
    })
}

export const addUserToWhitelist = (
  email: string
): AppThunk => async dispatch => {
  apiAddUserToWhitelist(email)
    .then(_ => {
      alert("Added " + email + " to the whitelist")
      dispatch(loadWhitelist())
    })
    .catch(error => {
      alert("Error adding user to whitelist (see console for details)")
      console.log(error)
    })
}

export const removeUserFromWhitelist = (
  email: string
): AppThunk => async dispatch => {
  apiRemoveUserFromWhitelist(email)
    .then(_ => {
      alert("Removed " + email + " from the whitelist")
      dispatch(loadWhitelist())
    })
    .catch(error => {
      alert("Error removing user from whitelist (see console for details)")
      console.log(error)
    })
}

export const loadWhitelist = (): AppThunk => async dispatch => {
  apiGetWhitelist()
    .then(response => {
      dispatch(loadWhitelistSuccessAction(response.data))
    })
    .catch(error => {
      alert("Error fetching whitelist (see console for details)")
      console.log(error)
    })
}

export const checkAuthentication = (): AppThunk => async dispatch => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    if (cookie.split("=")[0] === "HERO_ENGINEER"
        && cookie.split("=")[1]) {
      // TODO: Check if cookie expired? Or do they get removed automatically?
      dispatch(loginSuccessAction())
      dispatch(setTokenAction(cookie.split("=")[1]))
      dispatch(loadProfile())
      return
    }
  }
  setTimeout(() => {
    dispatch(setAuthenticationCheckedAction())
  }, 1)
}

const setCookie = (name: string, value: string, expire: number) => {
  let expireDate = new Date(expire * 1000);
  document.cookie = (name + " = " + value +
    "; expires = " + expireDate.toUTCString() //+
    //"; site=heroengineer.com; secure; samesite
    )
  // TODO: Uncomment security additions
}
