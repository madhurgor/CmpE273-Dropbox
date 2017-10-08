import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter,Route} from 'react-router-dom';
import Login from './components/Login';
import {Login1} from './components/Login1';
import {SignUp} from './components/SignUp';
import {About} from './components/About';

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <BrowserRouter>
                  <div>
                    <Route exact path="/" component={Login}/>
                    <Route exact path="/login1" component={Login1}/>
                    <Route exact path="/signup" component={SignUp}/>
                    <Route exact path="/about" component={About}/>
                  </div>
                </BrowserRouter>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));
