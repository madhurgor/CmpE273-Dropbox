const reducerUsers = (state = {
  firstname: '',
  lastname: '',
  username: '',
  password:'',
  token:'',
  file:[],
  fileR:[],
  data:[],
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
          fileR:[],
          data:[],
        };
    break;
    default:
    break;
  }
  return state;
};

export default reducerUsers;
