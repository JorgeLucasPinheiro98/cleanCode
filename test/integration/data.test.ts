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
    const accountByEmail = await accountRepository.getAccountByEmail(account.getEmail());
    expect(accountByEmail!.getName()).toBe(account.getName());
    expect(accountByEmail!.getEmail()).toBe(account.getEmail());
    expect(accountByEmail!.getCpf()).toBe(account.getCpf());
    expect(accountByEmail!.getPassword()).toBe(account.getPassword());
    const accountById = await accountRepository.getAccountById(account.getAccountId());
    expect(accountById.getName()).toBe(account.getName());
    expect(accountById.getEmail()).toBe(account.getEmail());
    expect(accountById.getCpf()).toBe(account.getCpf());
    expect(accountById.getPassword()).toBe(account.getPassword());
    databaseConnection.close();
});
