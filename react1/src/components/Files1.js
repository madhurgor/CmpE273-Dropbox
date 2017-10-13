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
import FileDownload from 'js-file-download';

class Files1 extends Component {
  constructor (props) {
    super(props)
    this.state = {
      files: [],
      files1:[],
      message:''
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
      var status;
      console.log("username"+this.props.select.username);
      API.files(this.props.select.username)
          .then((res) => {
            status = res.status;
            return res.json();
          }).then((json) => {
            if (status === 201) {
                this.setState({
                files1:json.files
                });
            } else {
                this.setState({
                message: "Something went Wrong..!!"
                });
            }
          });
    }
  }

  onDownload = (item) => {
      axios.get(`http://localhost:3001/users/download`,{params:{file:item,username:this.props.select.username}})
         .then((res) => {
           console.log('downloaded..');
           FileDownload(res.data,item);
         }).catch((err) => {
           window.alert(`${item} cannot be downloaded!! Please try again later..`)
         })
    }

  onDelete = (item) => {
      axios.get(`http://localhost:3001/users/delete`,{params:{file:item,username:this.props.select.username}})
         .then((res) => {
           console.log('deleted..');
           window.alert(`${item} Deleted Successfully..!!`)
           this.props.history.push('/homepage');
           this.props.history.push('/files');
         }).catch((err) => {
           window.alert(`${item} cannot be deleted!! Please try again later..`)
         })
    }

  onStar = (item) => {
      axios.get(`http://localhost:3001/users/star`,{params:{file:item,username:this.props.select.username}})
         .then((res) => {
           console.log('starred..');
           window.alert(`${item} Starred Successfully..!!`)
         }).catch((err) => {
           window.alert(`${item} cannot be starred!! Please try again later..`)
         })
    }

  onSignOut = () => {
   localStorage.removeItem('jwtToken');
   window.location.replace('/');
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
    axios.post(`http://localhost:3001/users/files`, formData, {params:{'username':`${this.props.select.username}`}})
    .then(response => {
      window.alert(`${this.state.files.length} files uploaded succesfully!`);
      this.refs.files.removeFiles();
      this.props.history.push('/homepage');
      this.props.history.push('/files');
    })
    .catch(err => {
      window.alert('Error uploading files :(');
      this.refs.files.removeFiles();
      this.props.history.push('/homepage');
      this.props.history.push('/files');
    })

  }

  render(){
    if(this.props.select.username==''){
      this.forceUpdate();
    }
    /*var status;
    API.files(this.props.select.username)
        .then((res) => {
          status = res.status;
          return res.json();
        }).then((json) => {
          if (status === 201) {
              this.setState({
              files1:json.files
              });
          } else {
              this.setState({
              message: "Something went Wrong..!!"
              });
          }
        });*/
    console.log(this.state.files1);
    var files1 = this.state.files1.map(function(item,index){
      return(
        <div>
          <button className="btn btn-primary" id='dwn' type="button" onClick = {() => this.onDownload(item)}>Download</button>
          <button className="btn btn-primary" id='del' type="button" onClick = {() => this.onDelete(item)}>Delete</button>
          <button className="btn btn-primary" id='str' type="button" onClick = {() => this.onStar(item)}>Star</button>
          {item}
          <hr/>
        </div>
      );
    }.bind(this));
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
              <h1>Dropbox</h1>
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
              <h4>Files</h4>
              <p className='Starred'></p>
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
              {files1}
              </div>
            </div>
          </div>
          <div className="col-md-3 d3">
            <div className="row">
              <div className="center-block">
                <button onClick={() => this.onSignOut()} className="w3-button w3-xlarge w3-circle w3-teal b1">Sign Out</button>
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
              {
                this.state.files.length > 0
                ? <div className='files-list'>
                  <ul>{this.state.files.map((file) =>
                    <li className='files-list-item' key={file.id}>
                      <div className='files-list-item-content'>
                        <div className='files-list-item-content-item files-list-item-content-item-1'>
                          {file.name}
                        </div>
                      </div>
                    </li>
                  )}</ul>
                </div>
                : null
              }
              <button className='upload-submit' onClick={this.filesUpload}>Upload</button>
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


export default withRouter(connect(mapStateToProps)(Files1));
