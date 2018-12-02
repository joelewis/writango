import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Index from './components/Index.js';


var PostList = () => <div> post list </div>
var DraftList = () => <div> draft list </div>
var PostView = () => <div> post view </div>
var PostEdit = () => <div> post edit </div>

const AppRouter = () => (
  <Router>
    <div>
      <Route path="/" exact component={Landing} />
      <Route path="/writes/:username" exact component={PostList} />
      <Route path="/writes/:username/drafts" exact component={DraftList} />
      <Route path="/writes/:username/posts/:postslug" exact component={PostView} />
      <Route path="/writes/:username/edit/:postslug" exact component={PostEdit} />
    </div>
  </Router>
);

export default AppRouter;