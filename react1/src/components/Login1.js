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
import Files from 'react-files';

export class Login1 extends Component {
  constructor (props) {
    super(props)
    this.state = {
      files: []
    }
  }

  onFilesChange = (files) => {
    this.setState({
      files
    }, () => {
      console.log('on file change-->')
      console.log(this.state.files);
    })
  }

  onFilesError = (error, file) => {
    console.log('error code ' + error.code + ': ' + error.message)
  }

  filesUpload = () => {
    var formData = new FormData()
    console.log('on file upload-->');
    console.log(this.state.files);
    Object.keys(this.state.files).forEach((key) => {
      const file = this.state.files[key]
      console.log('before form data --> file');
      console.log(file);
      formData.append(key, file, file.name || 'file')
      //formData.append(key, new Blob([file], { type: file.type }), file.name || 'file')
      console.log('after form data');
      console.log(formData);
    })
    axios.post(`http://localhost:3002/users/files`, formData)
    .then(response => window.alert(`${this.state.files.length} files uploaded succesfully!`))
    .catch(err => window.alert('Error uploading files :('))
    window.location.replace('/login1');
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
              <h1>Home</h1>
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
              <h4>Starred</h4>
              <p className='Starred'></p>
              </div>
              <hr/>
            </div>
          </div>
          <div className="col-md-3 d3">
            <div className="row">
              <div className="center-block">
                <button className="w3-button w3-xlarge w3-circle w3-teal b1">Sign Out</button>
              </div>
            </div>
            <button className='upload-button'>
              <Files id='f1'
                ref='files'
                className='files-dropzone-list'
                onChange={this.onFilesChange}
                onError={this.onFilesError}
                multiple
                maxFiles={10}
                maxFileSize={10000000}
                minFileSize={0}
                clickable
              >
                Select File
              </Files>
            </button>
            <br/><br/>
              <button className='upload-submit' onClick={this.filesUpload}>Upload</button>
          </div>
        </div>
      </div>
    )
  }
}
