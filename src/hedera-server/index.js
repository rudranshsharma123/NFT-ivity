// console.clear();

import "dotenv/config";
import cors from "cors";
import {
	AccountId,
	PrivateKey,
	Client,
	TokenCreateTransaction,
	TokenInfoQuery,
	TokenType,
	CustomRoyaltyFee,
	CustomFixedFee,
	Hbar,
	TokenSupplyType,
	TokenMintTransaction,
	TokenBurnTransaction,
	TransferTransaction,
	AccountBalance,
	AccountBalanceQuery,
	AccountUpdateTransaction,
	TokenAssociateTransaction,
	AccountCreateTransaction,
	TokenNftInfoQuery,
	TokenId,
	NftId,
	TokenInfo,
	TokenNftInfo,
	TopicCreateTransaction,
	TopicMessageQuery,
	TopicMessageSubmitTransaction,
} from "@hashgraph/sdk";

import express from "express";
import axios from "axios";
const operatorId = AccountId.fromString(process.env.ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.ACCOUNT_PRIVATE_KEY);
const treasuryId = AccountId.fromString(process.env.TREASURY_ID);
const treasuryKey = PrivateKey.fromString(process.env.TREASURY_PRIVATE_KEY);
const client = Client.forTestnet().setOperator(operatorId, operatorKey);
const supplyKey = PrivateKey.generate();
const adminKey = PrivateKey.generate();

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());
const pinJSONToIPFS = async (JSONBody) => {
	const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
	const x = await axios
		.post(url, JSONBody, {
			headers: {
				pinata_api_key: "2d43a55ba1051a581a24",
				pinata_secret_api_key:
					"7a941885825d10759c2c02b7f0b5f798bb4fa74a2dfa8b526d50e140b56ab83e",
			},
		})
		.then(function (response) {
			//handle response here
			return response["data"]["IpfsHash"];
		})
		.catch(function (error) {
			//handle error here
		});
	return x;
};

const JSONBody = {
	name: "Reward NFT",
	description: "Certificate of Daily Excellence",
	image:
		"data:image/jpeg;base64,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",
	properties: {
		date: "2022-03-18",
	},
};

// await pinJSONToIPFS(JSONBody);

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

// let nftCreate = await new TokenCreateTransaction()
// 	.setTokenName("LoverVerse")
// 	.setTokenSymbol("LOVE")
// 	.setTokenType(TokenType.NonFungibleUnique)
// 	.setDecimals(0)
// 	.setInitialSupply(0)
// 	.setTreasuryAccountId(treasuryId)
// 	.setSupplyType(TokenSupplyType.Finite)
// 	.setMaxSupply(12)
// 	.setSupplyKey(supplyKey)
// 	.setAdminKey(adminKey)
// 	.freezeWith(client)
// 	.sign(treasuryKey);
// // Sign the transaction with the treasury key
// let nftCreateTxSign = await nftCreate.sign(adminKey);

// //Submit the transaction to a Hedera network
// let nftCreateSubmit = await nftCreateTxSign.execute(client);

// //Get the transaction receipt
// let nftCreateRx = await nftCreateSubmit.getReceipt(client);

// //Get the token ID
// let tokenId = nftCreateRx.tokenId;

// //Log the token ID
// console.log(`- Created NFT with Token ID: ${tokenId} \n`);
// console.log("Starting Initial Mint of 12 Places");

// let mintedTokenIds = [];

// // Mint 12 places
// for (let i = 0; i < 12; i++) {
// 	let min = await mint("i", tokenId);
// 	console.log(min.serials[0].low);
// 	mintedTokenIds.push(min.serials[0].low);
// }
// let info = await new TokenInfoQuery().setTokenId(tokenId).execute(client);

const createAMessage = async (message) => {
	let txResponse = await new TopicCreateTransaction().execute(client);

	await sleep(5000);
	let sendResponse = await new TopicMessageSubmitTransaction({
		topicId: "0.0.30952496",
		message: message,
	}).execute(client);
	const getReceipt = await sendResponse.getReceipt(client);

	const transactionStatus = getReceipt.status;
	console.log("The message transaction status" + transactionStatus);
	return transactionStatus;
};

const createATopic = async () => {
	let txResponse = await new TopicCreateTransaction().execute(client);

	let receipt = await txResponse.getReceipt(client);
	let topicId = receipt.topicId;
	console.log(`Your topic ID is: ${topicId}`);
	return topicId;
};

app.get("/", async (req, res) => {
	// await setConfig();

	res.end("Hello World!");
});
app.get("/messages", async (req, res) => {
	let arr = [];
	await sleep(5000);

	const s = new TopicMessageQuery()
		.setTopicId("0.0.30952496")
		.setStartTime(0)
		.subscribe(client, null, (message) => {
			let messageAsString = Buffer.from(message.contents, "utf8").toString();
			console.log(
				`${message.consensusTimestamp.toDate()} Received: ${messageAsString}`,
			);
			arr.push(messageAsString);
		});
	await sleep(5000);
	console.log(arr);
	res.send({ messages: arr });
});

app.post("/sendMessage", async (req, res) => {
	// await setConfig();
	const info = req.body;
	await createAMessage(info.message);
	res.end("Done");
});
app.get("/account", async (req, res) => {
	const k = await createNewAccount();
	res.send({
		account: k.newAccountID.toString(),
		privateKey: k.newAccountPrivateKey.toString(),
	});
});

app.get("/mint", async (req, res) => {
	await mint();

	res.send("done");
});

app.post("/asso", async (req, res) => {
	const info = req.body;
	accountID = AccountId.fromString(info["accountId"]);
	privateKey = PrivateKey.fromString(info["privateKey"]);
	let x = await associteAccount(accountID, privateKey);
	let y = await transferNFT(accountID, tokenId);
	res.send("success");
});

app.post("/balance", async (req, res) => {
	const info = req.body;
	accountID = AccountId.fromString(info["accountId"]);
	privateKey = PrivateKey.fromString(info["privateKey"]);
	let x = await balanceChecker(accountID);
	res.send("done");
});

app.listen(port, () => {
	console.log(`app listening at http://localhost:${port}`);
});

async function mint() {
	let nftCreate = await new TokenCreateTransaction()
		.setTokenName("DailyReward")
		.setTokenSymbol("YODI")
		.setTokenType(TokenType.NonFungibleUnique)
		.setDecimals(0)
		.setInitialSupply(0)
		.setTreasuryAccountId(treasuryId)
		.setSupplyType(TokenSupplyType.Finite)
		.setMaxSupply(250)
		.setSupplyKey(supplyKey)
		.freezeWith(client);

	let nftCreateTxSign = await nftCreate.sign(treasuryKey);

	//Submit the transaction to a Hedera network
	let nftCreateSubmit = await nftCreateTxSign.execute(client);

	//Get the transaction receipt
	let nftCreateRx = await nftCreateSubmit.getReceipt(client);

	//Get the token ID
	let tokenId = nftCreateRx.tokenId;
	console.log(tokenId);
	let CID = ["QmQGLf1s4wvUT2uZY8v1pYkmkTyfUSQ8yVoZkffVDAPXcT"];

	let mintTxn = await new TokenMintTransaction()
		.setTokenId(tokenId)
		.setMetadata([Buffer.from(CID)])
		.freezeWith(client)
		.sign(supplyKey);
	let mintTxSubmit = await mintTxn.execute(client);
	let mintTxReceipt = await mintTxSubmit.getReceipt(client);
	console.log(mintTxReceipt);
	return mintTxReceipt;
}

async function balanceChecker(id) {
	let balance = await new AccountBalanceQuery()
		.setAccountId(id)
		.execute(client);
	return [
		balance.tokens._map.get(tokenId.toString()).toString(),
		balance.hbars.toString(),
	];
}
async function main() {
	// 	let nftCustomFee = await new CustomRoyaltyFee()
	// 		.setNumerator(5)
	// 		.setDenominator(10)
	// 		.setFeeCollectorAccountId(treasuryID)
	// 		.setFallbackFee(new CustomFixedFee().setHbarAmount(new Hbar(200)));

	let x = await mint("kollldd");

	var tokenInfo = await new TokenInfoQuery()
		.setTokenId(tokenId)
		.execute(client);
	console.table(tokenInfo.totalSupply);
	console.log(tokenInfo.totalSupply);
	// let nftCreateSign = await nftCreate.sign(adminKey);
	// let nftCreateSubmit = await nftCreate.execute(client);
	// let nftCreateReceipt = await nftCreateSubmit.getReceipt(client);
	// let tokenId = nftCreateReceipt.tokenId;
	// console.log(tokenId);
	let a = await balanceChecker(treasuryId);
	console.log(a);

	let k = await createNewAccount();
	console.log(k.newAccountID, k.newAccountPrivateKey);
	let ans = await associteAccount(
		k.newAccountID,
		k.newAccountPrivateKey,
		tokenId,
	);
	console.log(ans);
	let l = await transferNFT(k.newAccountID, tokenId);
	let m = await balanceChecker(k.newAccountID);
	console.log(m);
	let z = await balanceChecker(treasuryId);
	console.log(z);
}
// main();
async function createNewAccount() {
	// const client = Client.forTestnet();

	// const myAccount = process.env.ACCOUNT_ID;
	// const myPrivateKey = process.env.ACCOUNT_PRIVATE_KEY;
	// if (myAccount == null || myPrivateKey == null) {
	// 	throw new Error("ACCOUNT_ID and ACCOUNT_PRIVATE_KEY must be set in .env");
	// }
	// client.setOperator(myAccount, myPrivateKey);

	const newAccountPrivateKey = await PrivateKey.generate();
	console.log(newAccountPrivateKey.toString());
	const newAccountPublicKey = newAccountPrivateKey.publicKey;
	console.log(newAccountPublicKey.toString());

	const newAccount = await new AccountCreateTransaction()
		.setKey(newAccountPublicKey)
		.setInitialBalance(Hbar.fromTinybars(1000))
		.execute(client);

	const getReciept = await newAccount.getReceipt(client);
	const newAccountID = getReciept.accountId;

	console.log(`New account created with ID: ${newAccountID}`);
	return {
		newAccountID: newAccountID,
		newAccountPrivateKey: newAccountPrivateKey,
	};
}
async function transferNFT(to, tokenId) {
	let transfer = await new TransferTransaction()
		.addNftTransfer(tokenId, 1, treasuryId, to)
		.freezeWith(client)
		.sign(treasuryKey);
	let transferSubmit = await transfer.execute(client);
	let transferReceipt = await transferSubmit.getReceipt(client);

	console.log(
		`\n- NFT transfer from Treasury to Alice: ${transferReceipt.status} \n`,
	);
}
async function associteAccount(accountID, privateKey, tokenId) {
	let associta = await new TokenAssociateTransaction()
		.setAccountId(accountID)
		.setTokenIds([tokenId])
		.freezeWith(client)
		.sign(privateKey);
	let associtaSubmit = await associta.execute(client);
	let associtaReceipt = await associtaSubmit.getReceipt(client);
	console.log(associtaReceipt.status.toString());
	return associtaReceipt.status.toString();
}

// createNewAccount();
// 	// const AccountBalance = await new AccountBalanceQuery()
// 	// 	.setAccountId(myAccount)
// 	// 	.execute(client);

// 	// console.log(`Account balance: ${AccountBalance.hbars.toTinybars()}`);

// 	// const sendMoney = await new TransferTransaction()
// 	// 	.addHbarTransfer(myAccount, Hbar.fromTinybars(-1000))
// 	// 	.addHbarTransfer(newAccountID, Hbar.fromTinybars(1000))
// 	// 	.execute(client);

// 	// const txnReceipt = await sendMoney.getReceipt(client);
// 	// console.log(txnReceipt.status.toString());
// 	// const cost = await new AccountBalanceQuery()
// 	// 	.setAccountId(newAccountID)
// 	// 	.getCost(client);
// 	// console.log(`Cost: ${cost}`);
// 	// const newAccountBalnce = await new AccountBalanceQuery()
// 	// 	.setAccountId(newAccountID)
// 	// 	.execute(client);
// 	// console.log(`New Account balance: ${newAccountBalnce.hbars.toTinybars()}`);
// }

// test();
