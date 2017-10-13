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
import './HomePage.css';
import Files from 'react-files';
import {connect} from 'react-redux';


class HomePage1 extends Component {

  render(){
  console.log(this.props.select1);
    return(
      <h1>Thai jase..</h1>
    )
  }
}

const mapStateToProps = (state) => {
  console.log("hello");
  return{
    select1: state.reducerUsers
  };
};

export default withRouter(connect(mapStateToProps)(HomePage1));
