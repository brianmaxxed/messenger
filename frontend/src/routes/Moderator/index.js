import React, {Component} from "react";
import axios from "axios";

// import {Link} from 'react-router-dom';

import "./Moderator.css";

export default class Moderator extends Component {
  constructor(props) {
      super(props);

      this.state = {
        images: [],
        newImage : {
          url: '',
        },
        user: '',
      }
  }

  moderateImage(event) {
    const approved = event.target.name === 'approve';
    console.log(event.target.name);

    const params = {
      imageId: event.target.id ? event.target.id : this.state.newImage._id,
      user: this.state.user,
      approved,
    };

    console.log(params);

    axios.put(`http://localhost:3100/api/v1/image/moderate${window.location.search}`, params)
      .then(res => {
        // console.log(res);
        this.refreshData();
      })
      .catch(err => {
        console.log(err);
      });
  }

  refreshData() {
    var urlParams = new URLSearchParams(window.location.search);

    // display the list of moderated images
    axios.get(`http://localhost:3100/api/v1/image/moderated${window.location.search}`)
      .then(res => {
        const images = [];

        res.data.data.message.forEach((obj, idx) => {
          images.push(<div key={idx} className="box">
            <header>{obj.approved ? 'Approved' : 'Rejected'}</header>
            <img className="thumb" alt="thumb" src={obj.url} />
            <button id={obj._id} name={!obj.approved ? 'approve' : 'reject'} onClick={this.moderateImage.bind(this)}>{!obj.approved ? 'Approve' : 'Reject'}</button>
          </div>);
        });

        if (images.length < 1) {
          images.push(<div key={1} className="message">no images have been moderated.</div>);
        }

        this.setState({ images, user: urlParams.get('user') });
      });

      // get the next image to moderate
      axios.get(`http://localhost:3100/api/v1/image/next${window.location.search}`)
        .then(res => {
          const img = res.data.data.message;
          if (img.length > 0) {
            this.setState({ newImage: img[0] });
          } else {
            this.setState({
              newImage: {
                url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
              },
            });
          }

      });
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    document.title = 'Moderator';
    this.refreshData();
  }

  render() {
    return (<div className="Moderator">
        <div className="imageBar">
          <div className="leftBar"><button name="approve" onClick={this.moderateImage.bind(this)}>Approve</button></div>
          <div className="middle"><img src={ this.state.newImage.url } alt="unmoderated" /></div>
          <div className="rightBar"><button name="reject" onClick={this.moderateImage.bind(this)}>Reject</button></div>
        </div>
        <div className="recentModerations">
          <div className="heading">Most recent moderations for {this.state.user}</div>
          <div className="recentImages">
            {this.state.images}
          </div>
        </div>
    </div>)
  };
};
