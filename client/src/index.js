import React, {Component} from "react";
import ReactDOM from "react-dom";
import AppRouter from "./routes.js";
import Model from "./models.js";
import 'antd/dist/antd.css';


// get session details.
// if user logged in 


Model.loadSession().then((session) => {
  ReactDOM.render(<AppRouter />, document.getElementById("root"));
});

