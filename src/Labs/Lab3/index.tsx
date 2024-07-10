import { useSelector } from "react-redux";
export default function Lab3() {
  const { todos } = useSelector((state: any) => state.todosReducer);
  return (
    <div id="wd-lab3" className="container-fluid">
      <h3>Lab 3</h3>
      <ul className="list-group">
        {todos.map((todo: any) => (
          <li className="list-group-item" key={todo.id}>
            {todo.title}
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
}
