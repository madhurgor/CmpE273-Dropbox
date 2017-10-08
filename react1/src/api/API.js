const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3002'

const headers = {
    'Accept': 'application/json'
};

export const doLogin = (payload) =>
    fetch(`${api}/users/login`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({username:payload.username,password:payload.password})
    }).then(res => {
        return res.status;
      })
        .catch(error => {
            console.log("This is error");
            return error;
          });

export const doSignUp = (payload) =>
    fetch(`${api}/users/signup`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({firstname:payload.firstname,lastname:payload.lastname,username:payload.username,password:payload.password})
    }).then(res => {
        return res.status;
      })
        .catch(error => {
            console.log("This is error");
            return error;
          });
