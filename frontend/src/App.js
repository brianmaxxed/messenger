import React, { Component } from "react";
import {withRouter} from 'react-router'
import './App.css';
import Page from './Page';


class App extends Component {
  render() {
    return (<div className="App">
      <Page></Page>
    </div>);
  }
}

export default withRouter(App);
