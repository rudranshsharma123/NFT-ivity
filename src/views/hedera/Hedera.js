import React, { useEffect, useState } from "react";
import axios from "axios";
import { toastySuccess, toastyFailure } from "../../consts/toasts";
import { ToastContainer } from "react-toastify";
function Hedera() {
	const [messages, setMessages] = useState([]);
	const getMessages = async () => {
		toastySuccess("Getting the messages from hedera");
		const res = await axios
			.get("http://localhost:3001/messages")
			.then((res) => {
				return res.data;
			});
		console.log(res["messages"]);
		setMessages(res["messages"]);
		toastySuccess("got the messages from hedera");
		// toastyFailure();
	};
	useEffect(() => {
		getMessages();
	}, []);
	return (
		<div className="todo-app">
			<h1>Messages on the topic currently:</h1>
			{messages.map((message, i) => {
				return (
					<>
						<h1 key={i}>{message}</h1>
					</>
				);
			})}
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</div>
	);
}

export default Hedera;
