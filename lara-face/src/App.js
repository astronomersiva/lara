import React, { Component } from 'react';
import Dashboard from './Dashboard';

import { BrowserRouter as Router, Route } from 'react-router-dom';

class App extends Component {
  render() {
    const DashboardForProject = ({ match }) => (
      <Dashboard project={match.params.project} />
    );

    return (
      <Router>
        <Route path="/:project/dashboard" component={DashboardForProject} />
      </Router>
    );
  }
}

export default App;
