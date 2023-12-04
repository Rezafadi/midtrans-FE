import { Box, TextField, Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

function Home() {
	const [name, setName] = useState<string | null>("");
	const [email, setEmail] = useState<string | null>("");
	const [totalPrice, setTotalPrice] = useState<number>(0);
	const [token, setToken] = useState<string | null>("");

	const process = async () => {
		const data = {
			gross_amount: totalPrice,
			name: name,
			email: email,
		};

		const config = {
			headers: {
				"Content-type": "application/json",
			},
		};

		const response = await axios.post(
			"http://localhost:5000/api/payment/process-transaction",
			data,
			config
		);

		setToken(response.data.token);
	};

	useEffect(() => {
		if (token) {
			window.snap.pay(token, {
				onSuccess: (result: string | null) => {
					localStorage.setItem("payment", JSON.stringify(result));
					console.log("payment success: ", result);

					setToken("");
				},
				onPending: (result: string | null) => {
					localStorage.setItem("payment", JSON.stringify(result));
					setToken("");
				},
				onError: (error: Error) => {
					console.log(error);
					setToken("");
				},
				onClose: () => {
					console.log("Anda belum menyelesaikan transaksi");
					setToken("");
				},
			});

			setName("");
			setEmail("");
			setTotalPrice(0);
		}
	}, [token]);

	useEffect(() => {
		const midtransurl = "https://app.sandbox.midtrans.com/snap/snap.js";

		let scriptTag = document.createElement("script");
		scriptTag.src = midtransurl;

		const midtransClientKey = "SB-Mid-client-aPM6HKjy9Yc4IQlM";
		scriptTag.setAttribute("data-client-key", midtransClientKey);

		document.body.appendChild(scriptTag);

		return () => {
			document.body.removeChild(scriptTag);
		};
	}, []);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				margin: "0 auto",
				height: "100vh",
				width: "90%",
				p: 4,
				gap: 2,
			}}>
			<TextField
				type="text"
				label="Nama"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<TextField
				type="email"
				label="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<TextField
				type="number"
				label="Total Price"
				value={totalPrice}
				onChange={(e) => setTotalPrice(parseInt(e.target.value))}
			/>
			<Box>
				<Button variant="outlined" onClick={process}>
					Process
				</Button>
			</Box>
		</Box>
	);
}

export default Home;
