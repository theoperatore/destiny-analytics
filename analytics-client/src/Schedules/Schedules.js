import React, { Component } from 'react';
import { fetchAllSchedules } from '../state/schedules/actions';

import './schedules.css';

function Schedule(props) {
  const style = {
    backgroundImage: `url(https://bungie.net${props.background})`,
    backgroundRepeat: 'no-repeat',
  }
  return <div
    className='schedule'
    onClick={props.onClick}
    style={style}
  >
    <img
      src={`https://bungie.net${props.emblem}`}
      width='75'
      height='75'
      alt='destiny-class-emblem'
    />
    <div className='schedule-meta'>
      <p>{props.name}</p>
      <p>{props.dclass}</p>
    </div>
  </div>
}

export default class Schedules extends Component {
  componentDidMount() {
    this.props.dispatch(fetchAllSchedules());
  }

  handleScheduleSelect(sched, meta) {
    console.log(meta);
  }

  renderSchedules() {
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
    </div>
  }
}