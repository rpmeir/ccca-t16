import crypto from "crypto";
import express from "express";
import pgp from "pg-promise";
import { validate } from "./validateCpf";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	let output;
	const connection = pgp()("postgres://postgres:123456@localhost:5432/postgres");
	try {
		const id = crypto.randomUUID();
		const [acc] = await connection.query("select * from cccat16.account where email = $1", [req.body.email]);
		if (acc) { output = -4; }
		if (!req.body.name.match(/[a-zA-Z] [a-zA-Z]+/))  { output = -3; }
		if (!req.body.email.match(/^(.+)@(.+)$/)) { output = -2; }
		if (!validate(req.body.cpf)) { output = -1; }
		if (req.body.isDriver && req.body.carPlate && !req.body.carPlate.match(/[A-Z]{3}[0-9]{4}/)) { output = -5; }
		await connection.query("insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [id, req.body.name, req.body.email, req.body.cpf, req.body.carPlate, !!req.body.isPassenger, !!req.body.isDriver]);

		if (typeof output === "number") {
			res.status(422).send(output + "");
		} else {
			const obj = {
				accountId: id
			};
			output = obj;
			res.json(output);
		}
	} finally {
		await connection.$pool.end();
	}
});

app.get("/accounts/:id", async function (req, res) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/postgres");
	try {
		const [acc] = await connection.query("select * from cccat16.account where account_id = $1", [req.params.id]);
		if (acc) {
			res.json(acc);
		} else {
			res.status(404).send();
		}
	} finally {
		await connection.$pool.end();
	}
});

app.listen(3000);
