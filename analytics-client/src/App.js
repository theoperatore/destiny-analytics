import React, { Component } from 'react';

import Character from './Analytics/Character';
import Schedules from './Schedules/Schedules';
import { changeRoute } from './state/route/actions';
import { parseHash, routes } from './routing';

const { playerSummary, characterSummary } = routes;

// start with a basic line chart of snapshots of the current day
// to now of k/d.

// think about:
// - moving everyting in state to container folders;
//   - reducer/action files next to where they're used by the components

class App extends Component {
  constructor(props) {
    super(props);
    
    this.navigateHome = this.navigateHome.bind(this);  
  }

  componentDidMount() {

    // initial routing taken care of in the route reducer as initial path/params
    window.addEventListener('hashchange', () => {
      const { path, params } = parseHash(window.location.hash);
      this.props.dispatch(changeRoute(path, params));
    })
  }

  navigateHome() {
    window.location.hash = '#/';  
  }

  renderRoute() {
    const state = this.props.store.getState();
    const { path, params } = state.route;

    switch (path) {
      case playerSummary:
        return <p>Load a player using some id: {params.membershipId}</p>

      case characterSummary: {
        const { analytics, schedules } = state;
        const foundSched = schedules.find(sched => sched.membershipId === params.membershipId);
        const schedule = {
          ...foundSched,
          meta: foundSched && foundSched.meta.filter(m => m.characterId === params.characterId)[0],
        }

        return <Character
          dispatch={this.props.dispatch}
          membershipId={params.membershipId}
          characterId={params.characterId}
          isLoading={analytics.isLoadingCharacterData}
          loadError={analytics.characterDataLoadError}
          characterData={analytics.characterData}
          schedule={schedule}
        />
      }

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
      <header onClick={this.navigateHome}>
        <h1>Destiny Stat Analysis</h1>
      </header>
      <div className='app-body'>
        {this.renderRoute()}
      </div>
    </main>
  }
}

export default App;
