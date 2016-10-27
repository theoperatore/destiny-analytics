import React, { Component } from 'react';
import { fetchAllSchedules } from '../state/schedules/actions';

export default class Schedules extends Component {
  componentDidMount() {
    this.props.dispatch(fetchAllSchedules());
  }

  renderSchedules() {
    return this.props.schedules.map((sched, i) => {
      return <p key={i}><strong>{sched.username}</strong> - {sched.id}</p>
    });
  }

  render() {
    return <div>
      {
        this.props.scheduleStatus.loading
          ? <p>Loading...</p>
          : this.renderSchedules()
      }
    </div>
  }
}