import React from "react";
import { Route, Redirect, NavLink } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "../app/rootReducer"

import "./LoggedInRoute.scss"

interface Props {
  exact?: boolean
  path: string
  component: React.ComponentType<any>
}
export const LoggedInRoute = ({ component: Component, ...otherProps }: Props) => {
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.user
  )

  if (isAuthenticated === false) {
    return (
      <>
        <Redirect to="/" />
      </>
    )
  }

  return (
    <>
      <div style={{display: "flex", justifyContent: "center", marginBottom: "2%"}} className="nav-bar">
        <NavLink to="/home">
          <img src={"/hero_engineer_logo.png"}  alt="logo" width="100px" height="100px" />
        </NavLink>
      </div>
      <Route
        render={otherProps => (
          <>
            <Component {...otherProps} />
          </>
        )}
      />
    </>
  )
}