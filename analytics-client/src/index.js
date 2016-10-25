import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import combinedReducers from './state';
import { fetchAllSchedules } from './state/schedules/actions';

import './index.css';

const store = createStore(combinedReducers, applyMiddleware(reduxThunk));
const mount = document.getElementById('root');

store.dispatch(fetchAllSchedules());
store.subscribe(() => {
  const { schedules, scheduleStatus } = store.getState();
  ReactDOM.render(
    <App schedules={schedules} isLoading={scheduleStatus.loading} />,
    mount
  )
})

const init = store.getState();
ReactDOM.render(
  <App schedules={init.schedules} isLoading={init.scheduleStatus.loading} />,
  mount
);
