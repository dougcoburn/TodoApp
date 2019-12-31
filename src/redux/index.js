import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import todoReducer from './todos';
import pureEnhancer from './pureEnhancer';

function configureStore(preloadedState) {
  const middlewares = [];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const enhancers = [middlewareEnhancer];
  enhancers.push(pureEnhancer);
  if (window.__REDUX_DEVTOOLS_EXTENSION__ ) {
    enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
  }
  const composedEnhancers = compose(...enhancers);
  const rootReducer = combineReducers({ todos: todoReducer });
  const store = createStore(rootReducer, preloadedState, composedEnhancers);
  return store;
}
const store = configureStore();
export default store;
