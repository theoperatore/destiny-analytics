import { combineReducers } from 'redux';

import { schedules, scheduleStatus } from './schedules/reducer';
import { route } from './route/reducer';

export default combineReducers({
  schedules,
  scheduleStatus,
  route,
});