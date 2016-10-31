import React, { Component, PropTypes } from 'react';
import { fetchAllSchedules } from '../state/schedules/actions';
import { fetchRecentCharacterData } from '../state/analytics/actions';

import LineChart from './charts/LineChart';

import './character.css';

export default class Character extends Component {
  static PropTypes = {
    dispatch: PropTypes.func.isRequired,
    membershipId: PropTypes.string.isRequired,
    characterId: PropTypes.string.isRequired,
    loadError: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
    characterData: PropTypes.array.isRequired,
    schedule: PropTypes.object.isRequired,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.isLoading !== this.props.isLoading ||
           nextProps.loadError !== this.props.loadError ||
           nextProps.characterData !== this.props.characterData ||
           nextProps.schedule !== this.props.schedule;
  }

  componentDidMount() {
    const { membershipId, characterId } = this.props;
    this.props.dispatch(fetchAllSchedules());
    this.props.dispatch(fetchRecentCharacterData(membershipId, characterId));
  }

  renderChart() {
    return <div className='analytics-chart'>
      <h4>{this.props.schedule.meta && this.props.schedule.meta.className}</h4>
      <LineChart
        xLabel={'time'}
        yLabel={'k/d'}
        snapshots={this.props.characterData}
      />
    </div>
  }

  render() {
    if (this.props.loadError) {
      return <p>{this.props.loadError}</p>
    }

    return <div className='analytics'>
      <nav className='analytics-nav'>
        <button className='btn btn-big active' title='Historical Stats'>
          <span className='fa fa-line-chart' />
        </button>
      </nav>
      <div className='analytics-body'>
        <h1>{this.props.schedule.username || <em><small>fetching metadata...</small></em>}</h1>
        {
          this.props.isLoading
            ? <span className='loading fa fa-circle-o-notch fa-spin' />
            : this.renderChart()
        }
      </div>
    </div>
  }
}