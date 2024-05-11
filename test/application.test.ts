import { Signup } from "../src/application/Signup";
import { GetAccount } from "../src/application/GetAccount";
import { AccountDAODatabase, AccountDAOMemory } from "../src/resources/AccountDAO";
import { MailerGatewayMemory } from "../src/resources/MailerGateway";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(async() => {
	const accountDAO = new AccountDAODatabase();
	const mailerGateway = new MailerGatewayMemory();
	signup = new Signup(accountDAO, mailerGateway);
	getAccount = new GetAccount(accountDAO);
})

test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
});

test("Deve criar uma conta para o motorista", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		carPlate: "ABC1234",
		isPassenger: false,
		isDriver: true
	};
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	//expect(outputGetAccount.carPlate).toBe(input.carPlate);
});

test("Não deve criar uma conta para o passageiro se o nome for invalido", async function () {
	const input = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});
