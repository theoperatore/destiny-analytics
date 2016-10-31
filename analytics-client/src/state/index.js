import { combineReducers } from 'redux';

import { analytics } from './analytics/reducer';
import { schedules, scheduleStatus } from './schedules/reducer';
import { route } from './route/reducer';

export default combineReducers({
  analytics,
  schedules,
  scheduleStatus,
  route,
});