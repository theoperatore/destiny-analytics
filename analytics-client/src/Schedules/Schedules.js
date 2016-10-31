import React, { Component, PropTypes } from 'react';
import { fetchAllSchedules } from '../state/schedules/actions';
import Schedule from './Schedule';

import './schedules.css';

export default class Schedules extends Component {
  static PropTypes = {
    dispatch: PropTypes.func.isRequired,
    schedules: PropTypes.array.isRequired,
    scheduleStatus: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.props.dispatch(fetchAllSchedules());
  }

  handleScheduleSelect(sched, meta) {
    window.location.hash = `#/players/${sched.membershipId}/characters/${meta.characterId}`;
  }

  renderSchedules() {
    if (this.props.scheduleStatus.error) {
      return <div>
        <p>Error retrieving schedules: {this.props.scheduleStatus.error}</p>
        <button onClick={() => this.props.dispatch(fetchAllSchedules())}>try again</button>
      </div>
    }

    return this.props.schedules.map((sched, i) => {
      return <div className='player-schedules' key={i}>
        {
          sched.meta.map((meta, j) => {
            return <Schedule
              key={`${i}${j}`}
              onClick={this.handleScheduleSelect.bind(this, sched, meta)}
              name={sched.username}
              emblem={meta.emblemPath}
              background={meta.backgroundPath}
              dclass={meta.className}
            />
          })
        }
      </div>
    });
  }

  render() {
    return <div className='schedules'>
      {
        this.props.scheduleStatus.loading
          ? <p>Loading schedule meta data...</p>
          : this.renderSchedules()
      }
      <footer>I &#10084; Bungie</footer>
    </div>
  }
}