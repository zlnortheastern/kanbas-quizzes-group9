import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";

export default function TodoItem({ todo }: {
  todo: { id: string; title: string };
}) {
  const dispatch = useDispatch();
  return (
    <li key={todo.id} className="list-group-item">
      <button onClick={() => dispatch(deleteTodo(todo.id))}
              id="wd-delete-todo-click"
              className="btn btn-danger float-end mx-2"> Delete </button>
      <button onClick={() => dispatch(setTodo(todo))}
              id="wd-set-todo-click"
              className="btn btn-primary float-end"> Edit </button>
      {todo.title}
    </li>
  );
}
