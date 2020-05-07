import React from "react"
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

const Pages = () => {
  return (
    <Switch>
      <LoggedOutRoute path="/" exact={true} component={Landing} />
      <LoggedOutRoute path="/sign-up" exact={true} component={SignUp} />
      <LoggedInRoute path="/log-out" exact={true} component={LogOut} />
      <LoggedInRoute path="/admin" exact={true} component={Admin} />
      <LoggedInRoute path="/quests" exact={true} component={Quests} />
      <LoggedInHomeRoute path="/home" exact={true} component={Home} />
      <Route component={NotFound} />
    </Switch>
  )
}

export default Pages;