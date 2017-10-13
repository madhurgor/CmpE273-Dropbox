const reducerUsers = (state = {
  isLoggedIn: false,
  firstname: '',
  lastname: '',
  username: '',
  password:'',
  token:'',
}, action) => {
  switch(action.type){
    case "CHANGELOG":
        state={
          ...state,
          isLoggedIn : true,
          firstname : action.payload.firstname,
          lastname : action.payload.lastname
        };
        break;
    case "CHANGEUSER":
        state={
          ...state,
          username: action.payload.username
        };
        console.log(state.username)
        break;
    case "SETTOKEN":
        state={
          ...state,
          token: action.payload.token
        };
        break;
  }
  return state;
};

export default reducerUsers;
