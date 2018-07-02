import React, {Component} from "react";
// import ReactDOM from "react-dom";
import {Switch, Route} from 'react-router-dom'

import Dashboard from "../../routes/Dashboard";
import Moderator from "../../routes/Moderator";

import './PageContent.css';

class PageContent extends Component {
  render() {
    return (<div className="PageContent">
      <Switch>
        <Route exact path='/dashboard' component={Dashboard}/>
        <Route exact path='/moderator' component={Moderator}/>
      </Switch>
    </div>)
  }
}

export default PageContent;
