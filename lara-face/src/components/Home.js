import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = { projects: {} };
  }

  async componentDidMount() {
    let response = await fetch('http://localhost:1511/projects', {
      method: 'GET'
    });

    let projects = await response.json() || {};
    this.setState({ projects });
  }

  render() {
    let { projects } = this.state;
    let linkToProjects = Object.keys(projects).map((projectId) => {
      let projectName = projects[projectId].name;
      return (
        <div key={projectId}>
          <Link to={`/projects/${projectId}/dashboard`}>
            {projectName}
          </Link>
        </div>
      );
    });

    return <div>{linkToProjects}</div>;
  }
}

export default Home;
