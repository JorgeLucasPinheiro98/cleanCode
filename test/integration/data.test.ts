import crypto from "crypto";
import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import Account from "../../src/domain/Account";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import Registry from "../../src/infra/di/Registry";

test("Deve salvar uma account", async function () {
    const databaseConnection = new PgPromiseAdapter();
    Registry.getInstance().provide("databaseConnection", databaseConnection);
    const accountRepository = new AccountRepositoryDatabase();
    const account = Account.create("John Doe", `john.doe${Math.random()}@gmail.com`, "97456321558", "asdQWE123", "", true, false);
    await accountRepository.saveAccount(account);
    const accountByEmail = await accountRepository.getAccountByEmail(account.email);
    expect(accountByEmail!.name).toBe(account.name);
    expect(accountByEmail!.email).toBe(account.email);
    expect(accountByEmail!.cpf).toBe(account.cpf);
    expect(accountByEmail!.password).toBe(account.password);
    const accountById = await accountRepository.getAccountById(account.accountId);
    expect(accountById.name).toBe(account.name);
    expect(accountById.email).toBe(account.email);
    expect(accountById.cpf).toBe(account.cpf);
    expect(accountById.password).toBe(account.password);
    databaseConnection.close();
});
