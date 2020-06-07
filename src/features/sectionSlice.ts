import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppThunk } from "app/store"
import {
  apiLoadAllSections,
  apiLoadClassmates,
  apiLoadSection,
  apiRemoveSection,
  apiSaveSection,
  SectionModel
} from "../api/sectionAPI"
import { UserModel } from "../api/userAPI"


interface SectionState {
  section: SectionModel | null
  classmates: UserModel[] | null
  allSections: SectionModel[] | null
  error: string | null
}

const initialState: SectionState = {
  section: null,
  classmates: null,
  allSections: null,
  error: null
}

const section = createSlice({
  name: "section",
  initialState,
  reducers: {
    loadSectionSuccessAction(state, action: PayloadAction<SectionModel>) {
      state.section = action.payload
    },
    loadAllSectionsSuccessAction(state, action: PayloadAction<SectionModel[]>) {
      state.allSections = action.payload
    },
    loadClassmatesSuccessAction(state, action: PayloadAction<UserModel[]>) {
      state.classmates = action.payload
      state.error = null
    },
    loadFailedAction(state, action: PayloadAction<string>) {
      state.error = action.payload
    },
    resetSectionStateAction(state) {
      Object.assign(state, initialState)
    }
  }
})

export const {
  loadSectionSuccessAction,
  loadAllSectionsSuccessAction,
  loadClassmatesSuccessAction,
  loadFailedAction,
  resetSectionStateAction
} = section.actions

export default section.reducer

export const loadSection = (): AppThunk => async dispatch => {
  apiLoadSection()
    .then(response => {
      dispatch(loadSectionSuccessAction(response.data))
      dispatch(loadClassmates())
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
      dispatch(loadFailedAction("There was a problem loading your class data. Please try again."))
    })
}

export const loadClassmates = (): AppThunk => async dispatch => {
  apiLoadClassmates()
    .then(response => {
      dispatch(loadClassmatesSuccessAction(response.data))
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
      dispatch(loadFailedAction("There was a problem loading your classmates' data. Please try again."))
    })
}

export const loadAllSections = (): AppThunk => async dispatch => {
  apiLoadAllSections()
    .then(result => {
      dispatch(loadAllSectionsSuccessAction(result.data))
    })
    .catch(error => {
      alert("An error occurred while loading class data")
      console.log(error)
    })
}

export const saveSection = (
  name: string,
  emails: string[],
  id?: string
): AppThunk => async dispatch => {
  apiSaveSection(name, emails, id)
    .then(_ => {
      alert("Successfully saved class section")
      dispatch(loadAllSections())
    })
    .catch(error => {
      alert("Error saving class section(see console for details)")
      console.log(error)
    })
}

export const removeSection = (id: string): AppThunk => async dispatch => {
  apiRemoveSection(id)
    .then(_ => {
      alert("Successfully deleted class section")
      dispatch(loadAllSections())
    })
    .catch(error => {
      alert("Error deleting class section(see console for details)")
      console.log(error)
    })
}
