import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect, login } from "../../redux/actions";
import "./login.css";
import axios from "axios";
import { toastySuccess } from "../../consts/toasts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
function Login() {
	const dispatch = useDispatch();
	const [hederaAcc, setHederAcc] = useState("");
	const [hederaPvtKey, setHederaPvtKey] = useState("");
	const deso = useSelector((state) => state.deso);
	const [publicKey, setPublic] = useState("");
	const navigate = useNavigate();
	const getHederaAccountHedera = async () => {
		toastySuccess("Generating Hedera Account...");
		const res = await axios.get("http://localhost:3001/account").then((res) => {
			console.log(res.data);
			return res;
		});
		toastySuccess("Hedera Account Generated!");
		setHederAcc(res.data.account);
		setHederaPvtKey(res.data.privateKey);
	};
	useEffect(() => {
		if (deso.publicKey === "" || deso.publicKey === null) {
			dispatch(connect());
		}
	}, []);
	useEffect(() => {
		if (deso.publicKey) {
			setPublic(deso.publicKey);
			toastySuccess(
				"You already have an account " + "look at the footer for more details ",
			);
		}
	}, [deso.publicKey]);

	const test = () => {
		console.log(hederaAcc);
		console.log(hederaPvtKey);
	};

	const handlePage = () => {
		navigate("/todo");
	};

	return (
		<>
			<div className="log">
				<h1>Welcome to Nft-ivty</h1>
				<div
					className="login-container"
					onClick={(e) => {
						e.preventDefault();
						dispatch(login());
					}}>
					Login With/DeSo
				</div>
				<div className="login-container" onClick={getHederaAccountHedera}>
					Login with/Hedera
				</div>
				<footer className="foot">
					{hederaAcc === "" || publicKey === "" ? (
						"You dont have an accout set yet"
					) : (
						<>
							<div>
								Your account is {hederaAcc}, your private key is
								{hederaPvtKey} keep it safe it will not be shown again`
							</div>
							<button onClick={handlePage}>Click me to procceed</button>
						</>
					)}
				</footer>
				<footer className="foot">
					<>
						<div>Your account on deso is {publicKey}</div>
						<button onClick={handlePage}>Click me to procceed</button>
					</>
				</footer>
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
		</>
	);
}

export default Login;
