import React, { Component } from 'react';

import Schedules from './Schedules/Schedules';
import { changeRoute } from './state/route/actions';


// HEY AL, create a mock for the scheduling service.
// Then work on the UI where a user will select the tile
// of the character they want to see historical stats for.

// start with a basic line chart of snapshots of the current day
// to now of k/d.

// think about:
// - moving everyting in state to container folders;
//   - reducer/action files next to where they're used by the components

class App extends Component {
  constructor(props) {
    super(props);

    this.routeParams = {
      'players': /#\/players\/([0-9-A-z]+)/,
    }
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      const { path, param } = this.parseHash();
      this.props.dispatch(changeRoute(path, param));
    })

    // initial routing
    const { path, param } = this.parseHash();
    this.props.dispatch(changeRoute(path, param));
  }
  
  parseHash() {
    const rawPath = window.location.hash;

    const routePartial = Object
      .keys(this.routeParams)
      .filter(routePartial => rawPath.match(routePartial))[0];

    const matches = routePartial
     ? this.routeParams[routePartial].exec(rawPath) || []
     : [];

    const param = matches[1];
    const almostPath = rawPath.replace(param, '');

    const path = almostPath.charAt(almostPath.length - 1) === '/'
      ? almostPath.slice(0, almostPath.length - 1)
      : almostPath;

    return { path, param };
  }

  renderRoute() {
    const state = this.props.store.getState();
    const { path, param } = state.route;

    switch (path) {
      case '#/players':
        return <p>Load a player using some id: {param}</p>

      // home
      default: {
        const { schedules, scheduleStatus } = state;
        return <Schedules
          dispatch={this.props.dispatch}
          schedules={schedules}
          scheduleStatus={scheduleStatus}
        />
      }
    }
  }

  render() {
    return <main>
      <h1>Some Destiny Analytics Header</h1>
      {this.renderRoute()}
      <footer>some footer thing</footer>
    </main>
  }
}

export default App;
