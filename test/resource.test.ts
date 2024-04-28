import { getAccountByEmail, getAccountById, saveAccount } from "../src/resource";
import crypto from "crypto";

test("Deve salvar um registro na tabela account e consultar por id", async function () {
    const account = {
        accountId: crypto.randomUUID(),
        name: "John Doe",
        email: `jhon.doe${Math.random()}@gmail.com`,
        cpf: "87748248800",
        isPassenger: true
    };
    await saveAccount(account);
    const accountById = await getAccountById(account.accountId);
    expect(accountById.account_id).toBe(account.accountId);
    expect(accountById.name).toBe(account.name);
    expect(accountById.email).toBe(account.email);
    expect(accountById.cpf).toBe(account.cpf);
    expect(accountById.is_passenger).toBe(account.isPassenger);
});

test("Deve salvar um registro na tabela account e consultar por email", async function () {
    const account = {
        accountId: crypto.randomUUID(),
        name: "John Doe",
        email: `jhon.doe${Math.random()}@gmail.com`,
        cpf: "87748248800",
        isPassenger: true
    };
    await saveAccount(account);
    const accountById = await getAccountByEmail(account.email);
    expect(accountById.account_id).toBe(account.accountId);
    expect(accountById.name).toBe(account.name);
    expect(accountById.email).toBe(account.email);
    expect(accountById.cpf).toBe(account.cpf);
    expect(accountById.is_passenger).toBe(account.isPassenger);
});
