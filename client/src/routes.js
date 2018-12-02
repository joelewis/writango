import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Index from './components/Index.js';


const AppRouter = () => (
  <Router>
    <div>
      <Route path="/" exact component={Index} />
    </div>
  </Router>
);

export default AppRouter;