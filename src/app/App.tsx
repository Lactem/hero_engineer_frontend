import React from "react"
import { useSelector, useDispatch } from "react-redux"

import { Route, Router } from "react-router-dom"

import history from "./history"

import { RootState } from "./rootReducer"

import "./App.scss"
import { checkAuthentication } from "../features/userSlice"
import Pages from "../routes/Pages"

const App: React.FC = () => {
  const dispatch = useDispatch()

  const { isAuthenticated } = useSelector(
    (state: RootState) => state.user
  )

  // Asynchronously check if the user is already logged in
  if (!isAuthenticated) {
    dispatch(checkAuthentication())
  }

  const app = isAuthenticated === null ? null :
    (
      <Router history={history}>
        <Route component={Pages} />
      </Router>
    )
  return (
    <>
      <div id="layer2" />
      <div id="layer1" />

      <div className="App">
        {app}
      </div>
    </>
  )
}

export default App
