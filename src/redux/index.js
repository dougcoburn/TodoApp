import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'
import todoReducer from './todos';

function configureStore(preloadedState) {
  const middlewares = []
  const middlewareEnhancer = applyMiddleware(...middlewares)
  const enhancers = [middlewareEnhancer]
  const composedEnhancers = composeWithDevTools(...enhancers)
  const rootReducer = combineReducers({ todos: todoReducer });
  const store = createStore(rootReducer, preloadedState, composedEnhancers)
  return store
}
const store = configureStore();
export default store;
