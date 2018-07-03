import React, {Component} from "react";
import axios from "axios";
// import {Link} from 'react-router-dom';

import "./Dashboard.css";

export default class Dashboard extends Component {
  constructor(props) {
      super(props);

      this.state = {
        images: [],
      }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    document.title = 'Dashboard';

    this.getImageList();
  }

  changeFilter(event) {
    let filter = `/${event.target.value}`;
    if (filter === '/all') filter = '';
    this.getImageList(filter);
  }

  getImageList(filter = '') {
    axios.get(`http://localhost:3100/api/v1/image/list${filter}`)
      .then(res => {
        const images = [];
        res.data.data.message.forEach((obj, idx) => {
          let className = 'box';
          if (typeof obj.approved === 'boolean') {
            console.log(typeof obj.approved);
            className += obj.approved ? ' approved' : ' rejected';
            console.log(className);
          }

          images.push(<div key={idx} className={className}>
            <img className="thumb" alt="thumb" src={obj.url} />
          </div>);
        });

        this.setState({ images });
      });
  }

  render() {
    return (<div className="Dashboard">
        <header className="header">
          <div className="leftHeader">Show {this.state.images.length} images</div>
          <div className="rightHeader">
            <select onChange={this.changeFilter.bind(this)}>
              <option value="all">all</option>
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
            </select>
          </div>
        </header>
        <div className="imageList">
          {this.state.images}
        </div>
    </div>)
  };
};
