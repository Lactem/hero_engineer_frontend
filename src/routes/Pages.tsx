import React, { useEffect } from "react"
import { Switch, Route } from "react-router-dom";
import { LoggedOutRoute } from "./LoggedOutRoute"
import { LogOut } from "../components/pages/LogOut"
import { Landing } from "../components/pages/Landing"
import { Home } from "../components/pages/Home"
import { NotFound } from "../components/pages/NotFound"
import { SignUp } from "../components/pages/SignUp"
import { Admin } from "../components/pages/admin/Admin"
import { LoggedInRoute } from "./LoggedInRoute"
import { LoggedInHomeRoute } from "./LoggedInHomeRoute"
import { Quests } from "../components/pages/Quests"
import { Councils } from "../components/pages/Councils"
import { LiveClassroom } from "../components/pages/LiveClassroom"
import { loadProfile } from "../features/userSlice"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../app/rootReducer"

const Pages = () => {
  const reload = () => window.location.reload();
  const dispatch = useDispatch()
  const { userLoading } = useSelector(
    (state: RootState) => state.user
  )
  useEffect(() => {
    const timer = setInterval(() => {
      if (!userLoading) {
        dispatch(loadProfile())
      }
    }, 5000);
    return () => clearTimeout(timer);
  })

  return (
    <Switch>
      <LoggedOutRoute path="/" exact={true} component={Landing} />
      <LoggedOutRoute path="/sign-up" exact={true} component={SignUp} />
      <LoggedInRoute path="/log-out" exact={true} component={LogOut} />
      <LoggedInRoute path="/admin" exact={true} component={Admin} />
      <LoggedInRoute path="/quests" exact={true} component={Quests} />
      <LoggedInRoute path="/councils" exact={true} component={Councils} />
      <LoggedInRoute path="/live-classroom" exact={true} component={LiveClassroom} />
      <LoggedInHomeRoute path="/home" exact={true} component={Home} />
      <Route path="/.well-known/pki-validation/5E5757841245634A66E1A558303AAAEB.txt" exact={true} onEnter={reload} />
      <Route component={NotFound} />
    </Switch>
  )
}

export default Pages;