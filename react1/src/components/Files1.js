import React, {Component} from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import * as API from '../api/API';
import axios from 'axios';
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
      //files1:[],
      message:'',
      childVisible:false
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
      if(this.props.select.username!=="")
      {
        API.files({username:this.props.select.username,path:this.props.select.path})
            .then((res) => {
              status = res.status;
              try{
                return res.json();
              }
              catch(err){window.alert(`Some Error: ${err}`);}
            }).then((json) => {
              if (status === 201) {
                  //this.setState({
                  //  files1:json.files
                  //});
                  this.props.folderChange(json.folders);
                  this.props.fileChange(json.files);
              } else {
                  this.setState({
                    message: "Something went Wrong..!!"
              });
            }
        });
      }
    }
  }

  onDownload = (item) => {
      axios.get(`http://localhost:3001/users/download`,{params:{file:item,username:this.props.select.username,path:this.props.select.path}})
         .then((res) => {
           //console.log(res);
           console.log('downloaded..');
           FileDownload(res.data,item);
         }).catch((err) => {
           window.alert(`${item} cannot be downloaded!! Please try again later..`)
         })
    }

  onDelete = (item) => {
      axios.get(`http://localhost:3001/users/delete`,{params:{file:item,username:this.props.select.username,path:this.props.select.path}})
         .then((res) => {
           console.log('deleted..');
           window.alert(`${item} Deleted Successfully..!!`)
           this.props.fileChange(this.props.select.file.filter((item1)=>{return item1!==item}));
           //this.props.history.push('/homepage');
           //this.props.history.push('/files');
         }).catch((err) => {
           window.alert(`${item} cannot be deleted!! Please try again later..`)
         })
    }

  onStar = (item) => {
      axios.get(`http://localhost:3001/users/star`,{params:{file:item,username:this.props.select.username,path:this.props.select.path}})
         .then((res) => {
           console.log('starred..');
           window.alert(`${item} Starred Successfully..!!`)
           this.props.history.push('/homepage');
         }).catch((err) => {
           window.alert(`${item} cannot be starred!! Please try again later..`)
         })
  }

  onOpen = (item) => {
    this.props.changePath(this.props.select.path+`/${item}`)
    setTimeout(() => {
      axios.get(`http://localhost:3001/users/open_folder`,{params:{path:this.props.select.path,username:this.props.select.username}})
         .then((res) => {
           //console.log(res);
           this.props.fileChange(res.data.files);
           this.props.folderChange(res.data.folders);
         }).catch((err) => {
           window.alert(`${item} folder cannot be opened!! Please try again later..`)
         })
       },1)
  }

  onSignOut = () => {
   localStorage.removeItem('jwtToken');
   axios.get(`http://localhost:3001/users/signout`,{params:{username:this.props.select.username}})
      .then((res) => {
        console.log('Signed Out Successfully..!!');
      }).catch((err) => {
        console.log('Some error in Sign Out..!!');
   })
   this.props.clear();
   window.location.replace('/');
  }

  onFilesChange = (files) => {
    this.setState({
      files
    }, () => {
    })
  }

  onFilesError = (error, file) => {
    console.log('error code ' + error.code + ': ' + error.message)
  }

  onFilesUpload = () => {
    if(this.state.files.length>0){
      var formData = new FormData()
      Object.keys(this.state.files).forEach((key) => {
        const file = this.state.files[key]
        formData.append(key, file, file.name || 'file')
        //formData.append(key, new Blob([file], { type: file.type }), file.name || 'file')
      })
      axios.post(`http://localhost:3001/users/filesF`, formData, {params:{'username':`${this.props.select.username}`,path:this.props.select.path}})
      .then(response => {
        window.alert(`${this.state.files.length} files uploaded succesfully!`);
        Object.keys(this.state.files).forEach((key) => {
          const file = this.state.files[key]
          var ft1=this.props.select.file;
          if(!ft1.includes(file.name)){
            ft1.push(file.name);
          } else {
            var n1=1;
            while(true){
              var ext,name,oname=file.name,n;
              n=oname.lastIndexOf(".");
              ext=oname.substring(n);
              name=oname.substring(0,n);
              oname=name+' ('+n1+')'+ext;
              if(!ft1.includes(oname)){
                ft1.push(oname);
                break;
              }else{
                n1+=1;
              }
            }
          }
          this.props.fileChange(ft1);
        })
        this.refs.files.removeFiles();
        //this.props.history.push('/homepage');
        //this.props.history.push('/files');
      })
      .catch(err => {
        window.alert('Error uploading files :(');
        this.refs.files.removeFiles();
      })
    }else{
      window.alert(`Please select file first by clicking on "Select File" button!!`);
    }
  }

  onFolderCreate = () => {
    if(document.getElementById('foldername1').value !==''){
      axios.get(`http://localhost:3001/users/createfolder`,{params:{path:this.props.select.path,username:this.props.select.username,foldername:document.getElementById('foldername1').value}})
         .then((res) => {
           console.log('Folder created!!');
           var ft1=this.props.select.folder;
           //ft1.push(document.getElementById('foldername1').value);
           if(!ft1.includes(document.getElementById('foldername1').value)){
             ft1.push(document.getElementById('foldername1').value);
           } else {
             var n1=1;
             while(true){
               var oname=document.getElementById('foldername1').value;
               oname=oname+' ('+n1+')';
               if(!ft1.includes(oname)){
                 ft1.push(oname);
                 break;
               }else{
                 n1+=1;
               }
             }
           }
           this.props.folderChange(ft1);
           document.getElementById('foldername1').value="";
         }).catch((err) => {
           console.log('Some error in folder creation..!! And error is: '+err);
           window.alert(`Some error in Folder Creation!! Please try again later..`)
           document.getElementById('foldername1').value="";
      })
    }else{
      window.alert(`Please Enter Name of the Folder in the TextBox and then Click on "Create" Button!!`)
    }
  }

  onBack = () => {
    if(this.props.select.path!=='/'){
      this.props.changePath(this.props.select.path.substring(0,this.props.select.path.lastIndexOf("/")))
      setTimeout(() => {
        axios.get(`http://localhost:3001/users/open_folder`,{params:{path:this.props.select.path,username:this.props.select.username}})
           .then((res) => {
             //console.log(res);
             this.props.fileChange(res.data.files);
             this.props.folderChange(res.data.folders);
           }).catch((err) => {
             window.alert(`Cannot goback from here!! Please try again later..`)
           })
         },1)
     }else{
       window.alert(`You are in the root folder!! Cannot goback from here..`)
     }
  }

  render(){
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
    //var files1 = this.props.select.file.map(function(item,index){
    var files1 = this.props.select.file.map(function(item,index){
      return(
        <div key={index}>
          <button className="btn btn-primary" id='dwn' type="button" onClick = {() => this.onDownload(item)}>Download</button>
          <button className="btn btn-primary" id='del' type="button" onClick = {() => this.onDelete(item)}>Delete</button>
          <button className="btn btn-primary" id='str' type="button" onClick = {() => this.onStar(item)}>Star</button>
          {item}
          <hr/>
        </div>
      );
    }.bind(this));

    var folders1 = this.props.select.folder.map(function(item,index){
      return(
        <div key={index}>
          <button className="btn btn-primary" type="button" onClick={() => {this.onOpen(item);}}>Open</button>
          {item}
          <hr/>
        </div>
      );
    }.bind(this));
    var NoFiles;
    if(this.props.select.file.length===0){NoFiles=true;}
    else {NoFiles=false;}

    var NoFolders;
    if(this.props.select.folder.length===0){NoFolders=true;}
    else {NoFolders=false;}

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
              <h4 className="header-folder">Folders:</h4>
              <button className="button-back" onClick={()=>{this.onBack()}}>Back</button>
              <h6>{this.props.select.path}</h6>{NoFolders?<h6>No Folder in this Directory</h6>:null}
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
              {folders1}
              </div>
            </div>
            <div className="row">
              <div className="center-block">
              <h4>Files:</h4>{NoFiles?<h6>No File</h6>:null}
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
              <Files
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
              <button className='upload-submit' onClick={this.onFilesUpload}>Upload</button>
              <div className="row">
                <div className="center-block">
                  <br/>
                  <button className='shared-folder-button'>New Shared Folder</button>
                </div>
              </div>
              <div className="row">
                <div className="center-block">
                  <br/>
                  <button className='folder-button' onClick={()=>{this.setState({childVisible:!this.state.childVisible})}}>New Folder</button>
                </div>
              </div>
              {
                this.state.childVisible
                ?
                <div className="row">
                  <div className="center-block">
                    <br/>
                    <input type='text' id='foldername1' className="folder-name-text" placeholder="New Folder's Name"/>
                    <button className='folder-button' onClick={this.onFolderCreate}>Create</button>
                  </div>
                </div>
                :
                null
              }
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
    fileChange: (file) => {
        dispatch({
        type: "CHANGEFILE",
        payload : {file:file}
      });
    },
    folderChange: (folder) => {
        dispatch({
        type: "CHANGEFOLDER",
        payload : {folder:folder}
      });
    },
    changePath: (path) => {
        dispatch({
        type: "CHANGEPATH",
        payload : {path:path}
      });
    },
    clear: () => {
        dispatch({
        type: "CLEAR",
      });
    },
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Files1));
