import React from 'react';
import ReactDOM from "react-dom";
import App from "./App";
import store from "./redux/store";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/login/Login";
import TodoPage from "./views/todo/TodoPage";
import "react-toastify/dist/ReactToastify.css";
import Hedera from "./views/hedera/Hedera";
ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/todo" element={<TodoPage />} />
				<Route path="/hedera" element={<Hedera />} />
			</Routes>
		</BrowserRouter>
	</Provider>,
	document.getElementById("root"),
);
