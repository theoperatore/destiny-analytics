import { combineReducers } from 'redux';

import { schedules, scheduleStatus } from './schedules/reducer';  

export default combineReducers({
  schedules,
  scheduleStatus,
});