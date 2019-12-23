import React, { useRef, useMemo, memo } from 'react';
import { connect } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Card from '@material-ui/core/Card';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import uuid from 'uuid/v4';
import { actions as todoActions } from '../redux/todos';

const useStyles = makeStyles({
  card: {
    width: 300,
    margin: 5,
  }
})

const ToDo = memo(SortableElement(({ value, onChange, onRemove }) => {
  const classes = useStyles();
  const handleChange = useMemo(() => () => onChange(value.id), [value.id, onChange]);
  const handleRemove = useMemo(() => () => onRemove(value.id), [value.id, onRemove]);
  return (
    <Card className={classes.card}>
      <button onClick={handleRemove}>X</button>
      <div>{value.description}</div>
      <Switch checked={value.complete} onChange={handleChange} />
    </Card>
  )
}));
ToDo.whyDidYouRender = true;

const ToDoSortableList = memo(SortableContainer(({ todos, toggleTodo, removeTodo }) => {

  return (
    <ul>
      {todos.map((todo, index) => (
        <ToDo
          key={todo.id}
          index={index}
          value={todo}
          onChange={toggleTodo}
          onRemove={removeTodo}
        />
      ))}
    </ul>
  );
}));
ToDoSortableList.propTypes = {
};
ToDoSortableList.whyDidYouRender = true;

const ToDoList = memo(({ todos, addTodo, reorderTodo, toggleTodo, removeTodo }) => {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    reorderTodo(oldIndex, newIndex);
  };
  const textFieldRef = useRef();
  return (
    <div>
      <TextField inputRef={textFieldRef}/>
      <Button
        onClick={() => {
          addTodo(uuid(), textFieldRef.current.value);
          textFieldRef.current.value = "";
        }}>
        ADD
      </Button>
      <ToDoSortableList todos={todos} onSortEnd={onSortEnd} toggleTodo={toggleTodo} removeTodo={removeTodo} />
    </div>
  );
});

ToDoList.whyDidYouRender = true;

export { ToDoList };

const mapStateToProps = state => ({
  todos: state.todos,
});

const mapDispatchToProps = {
  addTodo: todoActions.addTodo,
  reorderTodo: todoActions.reorderTodo,
  toggleTodo: todoActions.toggleTodo,
  removeTodo: todoActions.removeTodo,
};

export default connect(mapStateToProps, mapDispatchToProps)(ToDoList);
