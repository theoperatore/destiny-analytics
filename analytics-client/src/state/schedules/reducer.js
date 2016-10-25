const INITIAL_STATE = [];
const INITIAL_STATUS_STATE = {
  loading: false,
  error: null,
};

export function schedules(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'receiveSchedules':
      return action.schedules;
    default: {
      return state;
    }
  }
}

export function scheduleStatus(state = INITIAL_STATUS_STATE, action) {
  switch (action.type) {
    case 'fetchSchedules': {
      return {
        ...state,
        loading: true,
        error: null,
      }
    }
    case 'receiveSchedules': {
      return {
        ...state,
        loading: false,
        error: null,
      }
    }
    case 'errorSchedules': {
      return {
        ...state,
        loading: false,
        error: action.message,
      }
    }
    default: {
      return state;
    }
  }
}
