import React, {Component} from "react";
import ReactDOM from "react-dom";
import AppRouter from "./routes.js";
import Index from "./components/Index.js";
import Model from "./models.js";
import 'antd/dist/antd.less';
import { BrowserRouter as Router } from "react-router-dom";

// get session details.
// if user logged in 


Model.loadSession().then((session) => {
  ReactDOM.render(
    <Router>
      <Index />
    </Router>, 
    document.getElementById("root"));
});

