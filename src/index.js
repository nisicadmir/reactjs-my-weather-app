import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom'

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import routes from './routes';
import reducer from './reducers';


const store = createStore(reducer);


ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        {routes}
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)