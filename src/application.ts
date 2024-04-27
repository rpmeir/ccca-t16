import crypto from "crypto";
import pgp from "pg-promise";
import { validate } from "./validateCpf";

export async function signup(input: any): Promise<any> {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/postgres");
	try {
		const id = crypto.randomUUID();
		const [acc] = await connection.query("select * from cccat16.account where email = $1", [input.email]);
		if (acc) { return -4; }
		if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/))  { return -3; }
		if (!input.email.match(/^(.+)@(.+)$/)) { return -2; }
		if (!validate(input.cpf)) { return -1; }
		if (input.isDriver && input.carPlate && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) { return -5; }
		await connection.query("insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]);

		const obj = {
			accountId: id
		};
		return obj;
	} finally {
		await connection.$pool.end();
	}
};

export async function getAccount (accountId: string) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/postgres");
	const [account] = await connection.query("select * from cccat16.account where account_id = $1", [accountId]);
	await connection.$pool.end();
	return account;
};
