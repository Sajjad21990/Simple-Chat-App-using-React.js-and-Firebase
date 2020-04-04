import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import LoginComponent from "./login/login";
import SignupComponent from "./signup/signup";
import DashboardComponent from "./dashboard/dashboard";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LoginComponent}></Route>
        <Route path="/signup" component={SignupComponent}></Route>
        <Route path="/dashboard" component={DashboardComponent}></Route>
      </Switch>
    </Router>
  );
}

export default App;
