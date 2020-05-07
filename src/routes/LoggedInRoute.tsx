import React from "react";
import { Route, Redirect, NavLink } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "../app/rootReducer"

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
      <NavLink to="/home">&lt;-- Home</NavLink>
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