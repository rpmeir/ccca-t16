import express from "express";
import { getAccount, signup } from "./application";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	const output = await signup(req.body);
	if (typeof output === "number") {
		res.status(422).send(output + "");
	} else {
		res.json(output);
	}
});

app.get("/accounts/:id", async function (req, res) {
	const account = await getAccount(req.params.id);
	res.json(account);
});

app.listen(3000);
