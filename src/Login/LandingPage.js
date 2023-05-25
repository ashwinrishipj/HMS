import React, { useState } from "react";
import LoginForm from "./loginform"
import { withRouter } from "react-router-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./LandingPage.css"
import LockScreen from "./LockScreen";
import DashBoard from "../DashBoard/DashBoard";
import Login from "./login";
import { useSelector } from "react-redux";

export const LandingPage = () => {
  const route = useSelector(state => state.routePage);

  return (
    <BrowserRouter>
      <Switch>
        {(route === "lockScreen" && (
          <Route path="/" component={() => (
            <LockScreen />
          )} />
        )) ||
          (route === ("login" || "logout") && (
            <Route
              path="/"
              component={() => (
                <Login />
              )}
            />
          )) ||
          (route === "dashBoard" && (
            <Route
              path="/"
              component={() => (
                <DashBoard />
              )}
            />)) || ""}
      </Switch>
    </BrowserRouter>
  );
};

export default withRouter;
