import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Home } from './Home';
import { Poll } from './Poll';
import { Vote } from './Vote';

class App extends Component {
  render() {
    return (
      <Router history={createBrowserHistory()} >
          <Switch>
            <Route path="/poll">
              <Poll />
            </Route>
            <Route path="/vote">
              <Vote />
            </Route>
            <Route path="/">
              <Home />
            </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
