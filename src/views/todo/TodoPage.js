import "./styles.css";
import Todoform from "../../components/Todoform";
import TodoList from "../../components/TodoList";

function TodoPage() {
	return (
		<div className="todo-app">
			<h1> Add your To-Dos</h1>
			<TodoList />
		</div>
	);
}

export default TodoPage;
