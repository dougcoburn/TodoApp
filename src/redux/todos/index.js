import { createActions, handleActions } from 'redux-actions';
import arrayMove from 'array-move';

const todoActions =  createActions({
  TODOS: {
    ADD_TODO: (id, description) => ({ id, description }),
    REMOVE_TODO: (id) => ({ id }),
    TOGGLE_TODO: (id) => ({ id }),
    REORDER_TODO: (oldIndex, newIndex) => ({ oldIndex, newIndex }),
  }
}).todos;

const todoReducer = handleActions({
  [todoActions.addTodo]: (todos, { payload: { id, description } }) => [...todos, { id, description, complete: false }],
  [todoActions.removeTodo]: (todos, { payload: { id: toRemove } }) => [...todos].filter(({ id }) => id !== toRemove),
  [todoActions.toggleTodo]: (todos, { payload: { id } }) => todos.map(todo => todo.id === id ? {...todo, complete: !todo.complete } : todo),
  [todoActions.reorderTodo]: (todos, { payload: { oldIndex, newIndex } }) => oldIndex === newIndex ? todos : arrayMove(todos, oldIndex, newIndex),
}, []);

export default todoReducer;
export {
  todoActions as actions,
};
