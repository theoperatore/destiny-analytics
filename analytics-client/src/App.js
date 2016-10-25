import React, { Component } from 'react';


// HEY AL, create a mock for the scheduling service.
// Then work on the UI where a user will select the tile
// of the character they want to see historical stats for.

// start with a basic line chart of snapshots of the current day
// to now of k/d.

// think about:
// - moving everyting in state to container folders;
//   - reducer/action files next to where they're used by the components
// - redux-router; need it? need some sort of routing...
// - react-redux; need it? either let App handle it, or use it


class App extends Component {
  render() {
    return <main>
      <h1>Destiny Anaytics</h1>
      <p>{this.props.isLoading ? 'loading...': ''}</p>
      {
        this.props.schedules.map((schedule, i) => {
          return <div key={i}>
            <p><strong>{schedule.username}</strong> - <em>{schedule.id}</em></p>
          </div>
        })
      }
    </main>
  }
}

export default App;
