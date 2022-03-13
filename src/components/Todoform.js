import React, { useState, useEffect, useRef } from "react";

function Todoform(props) {
	const [input, setInput] = useState(props.edit ? props.edit.value : "");

	const inputRef = useRef(null);

	useEffect(() => {
		inputRef.current.focus();
	});

	const handleInput = (e) => {
		setInput(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		props.onSubmit({
			id: Math.floor(Math.random() * 100),
			text: input,
		});
		setInput("");
	};

	return (
		<form className="todo-form" onSubmit={handleSubmit}>
			{!props.edit ? (
				<>
					<input
						type="text"
						placeholder="Add your ToDo"
						value={input}
						name="text"
						className="todo-input"
						onChange={handleInput}
						ref={inputRef}></input>
					<button className="todo-button"> Add your Todos</button>
				</>
			) : (
				<>
					{" "}
					<input
						type="text"
						placeholder="Update the Item"
						value={input}
						name="text"
						className="todo-input"
						onChange={handleInput}
						ref={inputRef}></input>
					<button className="todo-button edit"> Update your Todos</button>
				</>
			)}
		</form>
	);
}

export default Todoform;
