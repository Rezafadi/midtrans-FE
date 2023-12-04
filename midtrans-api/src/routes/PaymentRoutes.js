import express from "express";
import midtransClient from "midtrans-client";

const router = express.Router();

router.post("/process-transaction", async (req, res) => {
	try {
		const snap = new midtransClient.Snap({
			isProduction: false,
			serverKey: "SB-Mid-server-_AwolkqSec6NFWOl0VXsVIOg",
			clientKey: "SB-Mid-client-aPM6HKjy9Yc4IQlM",
		});

		const parameter = {
			transaction_details: {
				order_id: req.body.order_id,
				gross_amount: req.body.gross_amount,
			},
			customer_details: {
				first_name: req.body.name,
				email: req.body.email,
			},
		};

		await snap.createTransaction(parameter).then((transaction) => {
			const dataPayment = {
				response: JSON.stringify(transaction),
			};

			const token = transaction.token;

			res.status(200).json({
				message: "success",
				dataPayment,
				token,
			});
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
});

router.post("/notification", async (req, res) => {
	const data = req.body;
	// console.log(data);
});

export default router;
