import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './Home';
import Dashboard from './Dashboard';

import './App.css';

class App extends Component {
  render() {
    const DashboardForProject = ({ match }) => (
      <Dashboard project={match.params.project} />
    );

    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/:project/dashboard" component={DashboardForProject} />
        </div>
      </Router>
    );
  }
}

export default App;
