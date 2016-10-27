import React, { Component } from 'react';

import Schedules from './Schedules/Schedules';
import { changeRoute } from './state/route/actions';
import { parseHash, routes } from './routing';


// HEY AL, create a mock for the scheduling service.
// Then work on the UI where a user will select the tile
// of the character they want to see historical stats for.

// start with a basic line chart of snapshots of the current day
// to now of k/d.

// think about:
// - moving everyting in state to container folders;
//   - reducer/action files next to where they're used by the components

class App extends Component {
  componentDidMount() {

    // initial routing taken care of in the route reducer as initial path/params
    window.addEventListener('hashchange', () => {
      const { path, params } = parseHash(window.location.hash);
      this.props.dispatch(changeRoute(path, params));
    })
  }

  renderRoute() {
    const state = this.props.store.getState();
    const { path, params } = state.route;
    const { playerSummary, characterSummary } = routes;

    switch (path) {
      case playerSummary:
        return <p>Load a player using some id: {params.membershipId}</p>

      case characterSummary:
        return <p>Loading a character... {params.membershipId} - {params.characterId}</p>

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
      <header>
        <h1>Destiny Stat Analysis</h1>
      </header>
      <div className='app-body'>
        {this.renderRoute()}
        <footer>I &#10084; Bungie</footer>
      </div>
    </main>
  }
}

export default App;
