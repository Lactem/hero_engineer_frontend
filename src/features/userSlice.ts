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
  UserWhitelistModel, apiSetIdeas, apiLoadProfessorAvatar, apiResetPassword, apiSetPassword, apiAddXP, apiGetXPBreakdown
} from "../api/userAPI"
import { message } from "antd"
import { resetShortAnswerAssignmentsStateAction } from "./shortAnswerAssignmentsSlice";


interface UserState {
  user: UserModel | null
  userError: string
  userLoading: boolean
  isAuthenticated: boolean | null
  loginLoading: boolean
  jwtAxiosId: number | null
  onLandingPage: boolean
  allUsers: UserModel[] | null
  allUsersLoading: boolean
  userWhitelist: UserWhitelistModel | null
  professorAvatar: string
}

const initialState: UserState = {
  user: null,
  userError: "",
  userLoading: false,
  isAuthenticated: null,
  loginLoading: false,
  jwtAxiosId: null,
  onLandingPage: true,
  allUsers: null,
  allUsersLoading: false,
  userWhitelist: null,
  professorAvatar: ""
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
    logoutAction(state, action: PayloadAction<boolean>) {
      if (action.payload && state.isAuthenticated) {
        message.info('You have been automatically logged out due to inactivity')
      }
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
    loadProfileStartAction(state) {
      state.userLoading = true;
    },
    loadProfileSuccessAction(state, action: PayloadAction<UserModel>) {
      state.user = action.payload
      state.userError = ""
      state.userLoading = false;
    },
    loadProfileFailedAction(state, action: PayloadAction<string>) {
      state.userError = action.payload
      state.userLoading = false;
    },
    signUpFailedAction(state, action: PayloadAction<string>) {
      state.userError = action.payload
    },
    clearUserErrorAction(state) {
      state.userError = ""
    },
    updateAvatarSuccessAction(state, action: PayloadAction<string>) {
      state.user = Object.assign(state.user, {"avatar": action.payload})
    },
    setAllUsersLoadingAction(state) {
      state.allUsersLoading = true
    },
    loadAllUsersSuccessAction(state, action: PayloadAction<UserModel[]>) {
      state.allUsers = action.payload
      state.allUsersLoading = false
    },
    loadAllUsersFailedAction(state) {
      state.allUsersLoading = false
    },
    loadWhitelistSuccessAction(state, action: PayloadAction<UserWhitelistModel>) {
      state.userWhitelist = action.payload
    },
    loadProfessorAvatarSuccessAction(state, action: PayloadAction<string>) {
      state.professorAvatar = action.payload
    }
  }
})

export const {
  setAuthenticationCheckedAction,
  loginSuccessAction,
  loginFailedAction,
  logoutAction,
  setTokenAction,
  loadProfileStartAction,
  loadProfileSuccessAction,
  loadProfileFailedAction,
  signUpFailedAction,
  clearUserErrorAction,
  updateAvatarSuccessAction,
  setAllUsersLoadingAction,
  loadAllUsersSuccessAction,
  loadAllUsersFailedAction,
  loadWhitelistSuccessAction,
  loadProfessorAvatarSuccessAction
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
  console.log("loadProfile() called");
  dispatch(loadProfileStartAction())
  apiLoadProfile()
    .then(response => {
      dispatch(loadProfileSuccessAction(response.data))
    })
    .catch(error => {
      console.log("loadUserProfile error")
      console.log(error.toJSON())
      console.log(error.toString())
      if (error.response) {
        if (error.response.status === 401) { // Unauthorized
          dispatch(logOut(true))
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

export const loadProfessorAvatar = (): AppThunk => async dispatch => {
  apiLoadProfessorAvatar()
    .then(response => {
      dispatch(loadProfessorAvatarSuccessAction(response.data))
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
      message.error("Could not load Professor Ramsey's avatar")
    })
}

export const resetPassword = (
  email: string,
  resetPassword: boolean
): AppThunk => async dispatch => {
  apiResetPassword(email, resetPassword)
    .then(_ => {
      message.success("Saved")
    })
    .catch(error => {
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
    })
}

export const setPassword = (
  email: string,
  password: string
): AppThunk => async dispatch => {
  apiSetPassword(email, password)
    .then(_ => {
    })
    .catch(error => {
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
    })
}

export const logOut = (staleSession?: boolean): AppThunk => async dispatch => {
  console.log("calling logOut with staleSession: " + staleSession)
  dispatch(setTokenAction(null))
  dispatch(resetQuestsStateAction())
  dispatch(resetQuizzesStateAction())
  dispatch(resetSectionStateAction())
  dispatch(resetShortAnswerAssignmentsStateAction())
  document.cookie = "HERO_ENGINEER="
  dispatch(logoutAction(staleSession || false))
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
  dispatch(setAllUsersLoadingAction())
  apiLoadAllUsers()
    .then(result => {
      dispatch(loadAllUsersSuccessAction(result.data))
    })
    .catch(error => {
      message.error("An error occurred while loading student data - try refreshing")
      console.log(error)
      dispatch(loadAllUsersFailedAction())
    })
}

export const addUserToWhitelist = (
  email: string
): AppThunk => async dispatch => {
  apiAddUserToWhitelist(email)
    .then(_ => {
      message.success("Added " + email + " to the Allowed List")
      dispatch(loadWhitelist())
    })
    .catch(error => {
      message.error("Error adding user to Allowed List (see console for details)")
      console.log(error)
    })
}

export const removeUserFromWhitelist = (
  email: string
): AppThunk => async dispatch => {
  apiRemoveUserFromWhitelist(email)
    .then(_ => {
      message.success("Removed " + email + " from the Allowed List")
      dispatch(loadWhitelist())
    })
    .catch(error => {
      message.error("Error removing user from Allowed List (see console for details)")
      console.log(error)
    })
}

export const loadWhitelist = (): AppThunk => async dispatch => {
  apiGetWhitelist()
    .then(response => {
      dispatch(loadWhitelistSuccessAction(response.data))
    })
    .catch(error => {
      message.error("Error fetching Allowed List (see console for details) - try refreshing")
      console.log(error)
    })
}

export const addXP = (email: string, xp: number, reason: string): AppThunk => async dispatch => {
  apiAddXP(email, xp, reason)
    .then(_ => {
      message.success("Added XP. Please refresh.")
    })
    .catch(error => {
      message.error("Error adding XP (see console for details)")
      console.log(error)
    })
}

export const getXPBreakdown = (email: string, setXPBreakdown: Function): AppThunk => async dispatch => {
  apiGetXPBreakdown(email)
    .then(response => {
      setXPBreakdown(response.data)
    })
    .catch(error => {
      message.error("Error calculating XP breakdown (see console for details)")
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
