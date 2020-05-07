import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux"
import { RootState } from "../app/rootReducer"

interface Props {
  exact?: boolean
  path: string
  component: React.ComponentType<any>
}
export const LoggedInHomeRoute = ({ component: Component, ...otherProps }: Props) => {
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