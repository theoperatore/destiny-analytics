import React from 'react';
import { render } from 'react-dom';
import App from './App';

import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import combinedReducers from './state';

import './index.css';

const store = createStore(combinedReducers, applyMiddleware(reduxThunk));
const mount = document.getElementById('root');

store.subscribe(() => {
  render(
    <App store={store} dispatch={store.dispatch} />,
    mount
  )
})

store.dispatch({ type: 'fetchSchedules' });

render(
  <App store={store} dispatch={store.dispatch} />,
  mount
);
