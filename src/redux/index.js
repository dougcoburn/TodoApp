import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { throttle } from 'lodash';
import { batchedSubscribe } from 'redux-batched-subscribe';
import todoReducer from './todos';
import pureEnhancer from './pureEnhancer';

const updateBatcher = throttle((notify) => { notify(); }, 16);

function configureStore(preloadedState) {
  const middlewares = [];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const enhancers = [middlewareEnhancer];
  enhancers.push(pureEnhancer);
  if (window.__REDUX_DEVTOOLS_EXTENSION__ ) {
    enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
  }
  enhancers.push(batchedSubscribe(updateBatcher));
  const composedEnhancers = compose(...enhancers);
  const rootReducer = combineReducers({ todos: todoReducer });
  const store = createStore(rootReducer, preloadedState, composedEnhancers);
  return store;
}
const store = configureStore();
export default store;
