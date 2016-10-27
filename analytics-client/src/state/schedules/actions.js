function fetchSchedules() {
  return {
    type: 'fetchSchedules',
  };
}

function receiveSchedules(schedules) {
  return {
    type: 'receiveSchedules',
    schedules,
  };
}

function errorSchedules(msg) {
  return {
    type: 'errorSchedules',
    message: msg,
  };
}

export function fetchAllSchedules() {
  return (dispatch, getState) => {
    dispatch(fetchSchedules());

    // fetch(`${process.env.REACT_APP_SCHEDULE_SVR}/schedule`)
    fetch('http://unimatrix-zero.local:9000/v1/schedule')
      .then(res => res.json())
      .then(res => {
        if (res.response && res.response.schedules) {
          dispatch(receiveSchedules(res.response.schedules));
        } else {
          dispatch(errorSchedules(res.message));
        }
      })
      .catch(err => {
        dispatch(errorSchedules(err.message));
      });
  }
}