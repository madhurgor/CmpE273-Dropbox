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
import {connect} from "react-redux";

class About extends Component {

  constructor (props) {
    super(props)
    this.state = {
      firstname: '',
      lastname:'',
      phone_no:'',
      hobbies:'',
      education:'',
      work:''
    }
  }

  componentWillMount(){
    var token = localStorage.getItem('jwtToken');
    if(!token)
    {
      this.props.history.push('/');
    }
    else
    {
      console.log(this.props.select.username);
      var status;
      API.about(this.props.select.username)
          .then((res) => {
            status = res.status;
            return res.json();
          }).then((json) => {
            if (status === 201) {
                this.setState({
                    isLoggedIn: true,
                    message: "Welcome to my App..!!"
                });
                //this.props.loginChange(json.firstname,json.lastname);
                console.log(status);
                this.setState({
                  firstname: json.firstname,
                  lastname:json.lastname,
                  work:json.work,
                  education:json.education,
                  hobbies:json.hobbies,
                  phone_no:json.phone_no
                })
                //this.props.storeToken(localStorage.getItem('jwtToken'));
                //this.login();
            } else if (status === 401) {
                this.setState({
                    isLoggedIn: false,
                    message: "Wrong username or password. Try again..!!"
                });
                //this.login1();
            } else {
                    this.setState({
                        isLoggedIn: false,
                        message: "Something went Wrong..!!"
                });
                //this.login1();
            }
          });
    }
  }

  updateInfo = () => {
    this.props.history.push('/change_info');
  }

  onSignOut = () => {
   localStorage.removeItem('jwtToken');
   this.props.storeRestore;
   window.location.replace('/');
  }

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
                <Link to={`/homepage/`} className='l1'>Home</Link>
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
                <Link to={`/files/`} className='l2'>Files</Link>
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
            <div className="row about1">
              <div className="center-block">
              <pre>
              Email Address            : {this.props.select.username}
              <br/>
              First Name:              : {this.state.firstname}
              <br/>
              Last Name:               : {this.state.lastname}
              <br/>
              Work Information:        : {this.state.work}
              <br/>
              Education:               : {this.state.education}
              <br/>
              Phone Number:            : {this.state.phone_no}
              <br/>
              Hobbies:                 : {this.state.hobbies}
              </pre>
              <button className='update-info' onClick={this.updateInfo}>Change Information</button>
              </div>
            </div>
          </div>
          <div className="col-md-3 d2">
            <div className="row">
              <div className="center-block">
                <button onClick={() => this.onSignOut()} className="w3-button w3-xlarge w3-circle w3-teal b1">Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return{
    select: state.reducerUsers
  };
};

const mapDispatchToProps = (dispatch) => {
  return{
    storeRestore: () => {
          dispatch({
        type: "RESTORE"
      });
    },

    getUserData: (data) => {
          dispatch({
        type: "CHANGEDATA",
        payload :{data:data}
      });
    },
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(About));
