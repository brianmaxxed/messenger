import React, {Component} from "react";
// import {Link} from 'react-router-dom';

import PageContent from './components/PageContent/PageContent';
import './Page.css';

export default class Page extends Component {
  handleStateChange(state) {
    // this.setState({menuOpen: state.isOpen})
  }

  render() {
    return (<div className="Page">
      <PageContent></PageContent>
    </div>);
  }
}
