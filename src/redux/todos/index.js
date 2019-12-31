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
  [todoActions.addTodo]: (todos, { payload: { id, description } }) => {
    todos.push({ id, description, complete: false });
    return todos;
  },
  [todoActions.removeTodo]: (todos, { payload: { id: toRemove } }) => {
    todos.splice(todos.findIndex(({ id }) => id === toRemove), 1);
    return todos;
  },
  [todoActions.toggleTodo]: (todos, { payload: { id: toRemove } }) => {
    const todo = todos.find(({ id }) => id === toRemove) || {};
    todo.complete = !todo.complete;
    return todos;
  },
  [todoActions.reorderTodo]: (todos, { payload: { oldIndex, newIndex } }) => {
    arrayMove.mutate(todos, oldIndex, newIndex);
    return todos;
  }
}, []);

export default todoReducer;
export {
  todoActions as actions,
};
