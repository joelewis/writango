import React from "react";
import ReactDOM from "react-dom";
import Index from "./components/Index.js";
import Model from "./models.js";
import 'antd/dist/antd.less';
import { BrowserRouter as Router } from "react-router-dom";

// get session details.
// if user logged in 


Model.loadSession().then(() => {
  ReactDOM.render(
    <Router>
      <Index />
    </Router>, 
    document.getElementById("root"));
});

