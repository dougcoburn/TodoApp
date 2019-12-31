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

const PureCard = memo(Card);
PureCard.displayName = 'PureCard';
const PureSwitch = memo(Switch);
PureSwitch.displayName = 'PureSwitch';
const PureToDoComponent = memo(({ value, onChange, onRemove }) => {
  const classes = useStyles();
  const handleChange = useMemo(() => () => onChange(value.id), [value.id, onChange]);
  const handleRemove = useMemo(() => () => onRemove(value.id), [value.id, onRemove]);
  return (
    <PureCard className={classes.card}>
      <button onClick={handleRemove}>X</button>
      <div>{value.description}</div>
      <PureSwitch checked={value.complete} onChange={handleChange} />
    </PureCard>
  )
});
PureToDoComponent.displayName = 'PureToDoComponent';
const PureToDoContainer = SortableElement(PureToDoComponent);
PureToDoContainer.displayName = 'PureToDoContainer';
const PureToDo = memo(PureToDoContainer);
PureToDo.displayName = 'PureToDo';

const PureToDoSortableListComponent = memo(({ todos, toggleTodo, removeTodo }) => {
  return (
    <ul>
      {todos.map((todo, index) => (
        <PureToDo
          key={todo.id}
          index={index}
          value={todo}
          onChange={toggleTodo}
          onRemove={removeTodo}
        />
      ))}
    </ul>
  );
});
PureToDoSortableListComponent.displayName = 'PureToDoSortableListComponent';
const PureToDoSortableListContainer = SortableContainer(PureToDoSortableListComponent);
PureToDoSortableListContainer.displayName = 'PureToDoSortableListContainer';
const PureToDoSortableList = memo(PureToDoSortableListContainer);
PureToDoSortableList.displayName = 'PureToDoSortableList';

const PureTextField = memo(TextField);
const PureButton = memo(Button);

const PureToDoList = memo(({ todos, addTodo, reorderTodo, toggleTodo, removeTodo }) => {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    reorderTodo(oldIndex, newIndex);
  };
  if (todos.length === 0) {
    addTodo(uuid(), '1');
    addTodo(uuid(), '2');
    addTodo(uuid(), '3');
    addTodo(uuid(), '4');
    addTodo(uuid(), '5');
  }
  const textFieldRef = useRef();
  const handleButtonClick = useMemo(() => () => {
    addTodo(uuid(), textFieldRef.current.value);
    textFieldRef.current.value = "";
  }, [addTodo]);
  return (
    <div>
      <PureTextField inputRef={textFieldRef}/>
      <PureButton onClick={handleButtonClick}>ADD</PureButton>
      <PureToDoSortableList todos={todos} onSortEnd={onSortEnd} toggleTodo={toggleTodo} removeTodo={removeTodo} />
    </div>
  );
});
PureToDoList.displayName = 'PureToDoList';


export { PureToDoList };

const mapStateToProps = state => ({
  todos: state.todos,
});

const mapDispatchToProps = {
  addTodo: todoActions.addTodo,
  reorderTodo: todoActions.reorderTodo,
  toggleTodo: todoActions.toggleTodo,
  removeTodo: todoActions.removeTodo,
};

export default connect(mapStateToProps, mapDispatchToProps)(PureToDoList);
