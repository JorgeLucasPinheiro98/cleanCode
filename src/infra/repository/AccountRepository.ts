import Account from "../../domain/Account";
import { inject } from "../di/Registry";
import DatabaseConnection from "../database/DatabaseConnection";
import ORM, { AccountModel } from "../orm/ORM";

export default interface AccountRepository {
    getAccountByEmail (email: string): Promise<Account | undefined>;
    getAccountById (accountId: string): Promise<Account>;
    saveAccount (account: Account): Promise<void>;
}

export class AccountRepositoryDatabase implements AccountRepository {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async getAccountByEmail (email: string) {
        const [accountData] = await this.connection.query("select * from ccca.account where email = $1", [email]);
        if (!accountData) return;
        return new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.password, accountData.car_plate, accountData.is_passenger, accountData.is_driver);
    }
    
    async getAccountById (accountId: string) {
        const [accountData] = await this.connection.query("select * from ccca.account where account_id = $1", [accountId]);
        return new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.password, accountData.car_plate, accountData.is_passenger, accountData.is_driver);
    }
    
    async saveAccount (account: Account) {
        await this.connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [account.getAccountId(), account.getName(), account.getEmail(), account.getCpf(), account.getCarPlate(), !!account.isPassenger, !!account.isDriver, account.getPassword()]);
    }
}

export class AccountRepositoryMemory implements AccountRepository {
    accounts: Account[] = [];

    async getAccountByEmail(email: string): Promise<Account | undefined> {
        return this.accounts.find((account: Account) => account.getEmail() === email);
    }

    async getAccountById(accountId: string): Promise<Account> {
        const account = this.accounts.find((account: Account) => account.getAccountId() === accountId);
        if (!account) throw new Error("Account not found");
        return account
    }

    async saveAccount(account: Account): Promise<void> {
        this.accounts.push(account);
    }

}

export class AccountRepositoryORM implements AccountRepository {
    @inject("orm")
    orm!: ORM;

    async getAccountByEmail (email: string) {
        const accountData = await this.orm.get(AccountModel, "email", email) as AccountModel;
        if (!accountData) return;
        return new Account(accountData.accountId, accountData.name, accountData.email, accountData.cpf, accountData.password, accountData.carPlate, accountData.isPassenger, accountData.isDriver);
    }
    
    async getAccountById (accountId: string) {
        const accountData = await this.orm.get(AccountModel, "account_id", accountId) as AccountModel;
        return new Account(accountData.accountId, accountData.name, accountData.email, accountData.cpf, accountData.password, accountData.carPlate, accountData.isPassenger, accountData.isDriver);
    }
    
    async saveAccount (account: Account) {
        const accountModel = new AccountModel(account.getAccountId(), account.getName(), account.getEmail(), account.getCpf(), account.getPassword(), account.getCarPlate() || '', account.isPassenger, account.isDriver);
        await this.orm.save(accountModel);
    }
}
