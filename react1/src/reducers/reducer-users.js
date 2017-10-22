const reducerUsers = (state = {
  firstname: '',
  lastname: '',
  username: '',
  password:'',
  token:'',
  file:[],
  folder:[],
  fileR:[],
  data:[],
  path:'/'
}, action) => {
  switch(action.type){
    case "CHANGEUSERNAME":
        state={
          ...state,
          username: action.payload.username
        };
    break;
    case "SETTOKEN":
        state={
          ...state,
          token: action.payload.token
        };
    break;
    case "CHANGEFILE":
        state={
          ...state,
          file: action.payload.file
        };
    break;
    case "CHANGEFOLDER":
        state={
          ...state,
          folder: action.payload.folder
        };
    break;
    case "CHANGEPATH":
        state={
          ...state,
          path: action.payload.path
        };
    break;
    case "CHANGEFILER":
        state={
          ...state,
          fileR: action.payload.fileR
        };
    break;
    case "SETINFO":
        state={
          ...state,
          data: action.payload.data
        };
    break;
    case "CLEAR":
        state={
          isLoggedIn: false,
          firstname: '',
          lastname: '',
          username: '',
          password:'',
          token:'',
          file:[],
          folder:[],
          fileR:[],
          data:[],
          path:'/',
        };
    break;
    default:
    break;
  }
  return state;
};

export default reducerUsers;
