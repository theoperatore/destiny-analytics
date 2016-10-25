import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import combinedReducers from './state';
import { fetchAllSchedules } from './state/schedules/actions';

import './index.css';

const store = createStore(combinedReducers, applyMiddleware(reduxThunk));

store.dispatch(fetchAllSchedules());

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
