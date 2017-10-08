import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import * as API from '../api/API';
import PropTypes from 'prop-types'
import axios from 'axios';
import Blob from 'blob';
import FormData from 'form-data';
import './Login1.css';

export class About extends Component {
  render(){
    return(
      <div>
        <div className="container-fluid">
          <div className="col-md-2 d1">
            <div className="row">
              <div className="center-block">
                <img src="/logo_blue.jpg" height="50" width="50" className="img1" alt="logo_blue"/>
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
                <Link to={`/login1/`} className='l1'>Home</Link>
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
                <Link to={`/login1/`} className='l2'>Home</Link>
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
                <Link to={`/about/`} className='l2'>About</Link>
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
              </div>
              <hr/>
            </div>
          </div>
          <div className="col-md-7 d2">
            <div className="row">
              <div className="center-block">
              <br/><br/>
              </div>
            </div>
            <div className="row">
              <div className="center-block">
              <h1>About</h1>
              </div>
              <hr/>
            </div>
          </div>
          <div className="col-md-3 d2">
            <div className="row">
              <div className="center-block">
                <button className="w3-button w3-xlarge w3-circle w3-teal b1">Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
