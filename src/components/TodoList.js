import React, { useEffect, useState } from "react";
import Todoform from "./Todoform";
import Todo from "./Todo";
import { connect } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toastyFailure, toastySuccess } from "../consts/toasts";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import { config } from "dotenv";

function TodoList() {
	const [todos, setTodos] = useState([]);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const deso = useSelector((state) => state.deso);
	const completeTodo = (id) => {
		let updatedTodos = todos.map((todo) => {
			if (todo.id === id) {
				todo.isComplete = !todo.isComplete;
			}
			return todo;
		});
		setTodos(updatedTodos);
	};

	const removeTodo = (id) => {
		const rem = [...todos].filter((todo) => todo.id !== id);
		setTodos(rem);
	};

	const addTodo = (todo) => {
		if (!todo.text || /^\s*$/.test(todo.text)) {
			return;
		}
		setTodos([todo, ...todos]);
		console.log(todos);
	};

	const updatedTodos = (todoId, newValue) => {
		if (!newValue || /^\s*$/.test(newValue)) {
			return;
		}
		setTodos((prev) =>
			prev.map((item) => (item.id === todoId ? newValue : item)),
		);
	};
	useEffect(() => {
		if (deso.publicKey === "" || deso.publicKey === null) {
			dispatch(connect());
		}
	}, []);
	const createPostForNft = async () => {
		const desoApi = deso.desoApi;
		const desoIdentity = deso.desoIdentity;
		const res = await desoApi.createPostForNfts(
			deso.publicKey,
			"Congrats, you did it, you deserve this NFT",
			[
				"https://images.unsplash.com/photo-1586807480822-0e95ba6666ad?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
			],
		);
		console.log(res);
		const txnHex = res.TransactionHex;
		console.log(txnHex);
		console.log(desoIdentity);
		const signTxnHex = await desoIdentity.signTxAsync(txnHex);
		const finalSub = await desoApi.submitTransaction(signTxnHex);
		console.log(finalSub);
	};
	const createPostForDeSo = async () => {
		toastySuccess("Creating a post on DeSo for you!");
		const desoApi = deso.desoApi;
		const desoIdentity = deso.desoIdentity;
		let message = "My Todos for the day are :-";

		message = message + todos.map((todo) => todo.text).join(", ");
		const res = await desoApi.createPostForNfts(deso.publicKey, message, []);
		console.log(res);
		const txnHex = res.TransactionHex;
		console.log(txnHex);
		console.log(desoIdentity);
		const signTxnHex = await desoIdentity.signTxAsync(txnHex);
		const finalSub = await desoApi.submitTransaction(signTxnHex);
		console.log(finalSub);
		toastySuccess("Post created successfully!");
	};
	const makePostNft = async (publicKey) => {
		toastySuccess("Posting NFT");

		const desoApi = deso.desoApi;
		const desoIdentity = deso.desoIdentity;
		const getPostForAPublicKey = await desoApi.getPostsForPublicKey(
			"",
			publicKey,
			"",
		);
		console.log(getPostForAPublicKey);
		const lastPostHex = getPostForAPublicKey.Posts[0].PostHashHex;
		const hext = await desoApi.createNftTxn(
			publicKey,
			lastPostHex,
			parseInt(1),
			0,
			0,
			false,
			true,
			0,
		);
		console.log(hext);
		const hex = hext.TransactionHex;
		const signTxnHex = await desoIdentity.signTxAsync(hex);
		console.log("here");

		const sub = await desoApi.submitTransaction(signTxnHex);
		console.log("here");
		console.log(sub);
		console.log("here");
		toastySuccess("You got your NFT on DeSo!!");
	};

	const getMessages = async () => {
		toastySuccess("Getting the messages from hedera");
		const res = await axios
			.get("http://localhost:3001/messages")
			.then((res) => {
				return res.data;
			});
		console.log(res["messages"]);
		toastySuccess("got the messages from hedera");
		// toastyFailure();
	};
	const minNFTsHedera = async () => {
		toastySuccess("Good Job, Minting your NFT for you");
		const res = await axios.get("http://localhost:3001/mint").then((res) => {
			return res.data;
		});
		console.log(res);
		toastySuccess("Your account has been Minted with the NFT!");
	};
	const sendMessages = async () => {
		toastySuccess(
			"sending the message to Hedera Message service with the id: 0.0.30952496 ",
		);
		let message = "My Todos for the day are :-";

		message = message + todos.map((todo) => todo.text).join(", ");

		const res = await axios
			.post("http://localhost:3001/sendMessage", {
				message: message,
			})
			.then((res) => {
				return res.data;
			});
		console.log(res);
		toastySuccess("sent the message to Hedera Message service");
	};

	const goToHedera = () => {
		navigate("/hedera");
	};

	return (
		<>
			<div>
				<Todoform onSubmit={addTodo} />
				<Todo
					todos={todos}
					completeTodo={completeTodo}
					removeTodo={removeTodo}
					updateTodo={updatedTodos}
				/>
				<button
					className="todo-button"
					style={{ marginRight: "60px", marginTop: "200px" }}
					onClick={sendMessages}>
					Submit Your Todos on hedera
				</button>
				<button className="todo-button" onClick={createPostForDeSo}>
					Submit Your Todos on DeSo
				</button>
				<button
					className="todo-button"
					style={{ marginRight: "20px", marginTop: "30px" }}
					onClick={minNFTsHedera}>
					Mark your ToDos as done on Hedera
				</button>
				<button
					className="todo-button"
					onClick={async () => {
						await createPostForNft();
						await makePostNft(deso.publicKey);
					}}>
					Mark your ToDos as done on DeSo
				</button>
				<button
					className="todo-button"
					style={{ marginRight: "20px", marginTop: "30px" }}
					onClick={getMessages}>
					See the messages currently in the topic
				</button>
				<button
					className="todo-button"
					style={{ marginRight: "20px", marginTop: "30px" }}
					onClick={goToHedera}>
					See the messages currently in the topic
				</button>
			</div>
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
			<iframe
				title="desoidentity"
				id="identity"
				frameBorder="0"
				src="https://identity.deso.org/embed?v=2"
				style={{
					height: "100vh",
					width: "100vw",
					display: "none",
					position: "fixed",
					zIndex: 1000,
					left: 0,
					top: 0,
				}}></iframe>
		</>
	);
}

export default TodoList;
