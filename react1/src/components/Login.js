import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import './Login.css';
import * as API from '../api/API';

class Login extends Component {
    state = {
        username: '',
        password: '',
        isLoggedIn: false,
        message: ''
    };

    login() {
      console.log('login done..');
      this.props.history.push("/login1");
    }

    login1() {
      console.log('login not done..');
      this.props.history.push("/login2");
    }

    handleSubmit = (userdata) => {
      console.log(userdata);
      if(this.state.username=="" || this.state.password===""){
        this.setState({
            isLoggedIn: false,
            message: "Please enter both username and password!!"
        });
        document.getElementById('error1').style.display="block";
      } else {
        API.doLogin(userdata)
            .then((status) => {
                if (status === 201) {
                    this.setState({
                        isLoggedIn: true,
                        message: "Welcome to my App..!!"
                    });
                    console.log(status);
                    this.login();
                } else if (status === 401) {
                    this.setState({
                        isLoggedIn: false,
                        message: "Wrong username or password. Try again..!!"
                    });
                    document.getElementById('error1').style.display="block";
                    //this.login1();
                }
                    else {
                        this.setState({
                            isLoggedIn: false,
                            message: "Wrong username or password. Try again..!!"
                    });
                    document.getElementById('error1').style.display="block";
                    //this.login1();
                }
            });
        }
      };

    render() {
      //console.log(this.state.userdata);
        return (
          <div>
            <div className="container">
              <div className="row">
                <div className="center-block">
                  <img src="/dropbox_logo.jpg" height="50" width="300" className="center-block" alt="dropbox_logo"/>
                </div>
                <hr/>
              </div>
                <div className="row justify-content-md-right" >
                <div className="col-md-6">
                <br/>
                <div className="row">
                <br/>
                  <div className="span4"></div>
                  <div className="span4"><img src="/home-page-img.jpg" height="320" width="300" className="center-block" alt="home-page-img"/></div>
                  <div className="span4"></div>
                </div>
                </div>
                    <div className="col-md-4">
                    <br/><br/><br/>
                        <div className="form-group">
                            <h3>Sign in</h3>
                            <div className="col-md-6"></div>or &nbsp; <Link to={`/signup/`} className="link">Create an Account</Link>
                        </div>
                        <form>
                        <div className="form-group">
                            <input
                                className="form-control"
                                type="text"
                                label="Username"
                                placeholder="Enter Username"
                                value={this.state.username}
                                onChange={(event) => {
                                    this.setState({
                                        username: event.target.value
                                    });
                                }}
                            />
                        </div>
                        <div className="form-group">
                          <input
                              className="form-control"
                              type="password"
                              label="password"
                              placeholder="Enter Password"
                              value={this.state.password}
                              onChange={(event) => {
                                  this.setState({
                                          password: event.target.value
                                  });
                              }}
                          />
                        </div>
                        <div className="form-group">
                          <div className="col-md-12">
                            <div id='error1' className="c-card--error">{this.state.message}</div>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="col-md-0"></div>
                            <button id='button1'
                                className="btn btn-primary"
                                type="button"
                                onClick={() => this.handleSubmit(this.state)}>
                                Sign in
                            </button>
                        </div>
                        </form>
                    </div>
                </div>
                <div className="row justify-content-md-center">

                </div>
            </div>
          </div>

        );
    }
}

export default withRouter(Login);
