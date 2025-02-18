import Account from "../../domain/Account";
import { inject } from "../di/Registry";
import DatabaseConnection from "../database/DatabaseConnection";

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
        return new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.password, accountData.carPlate, accountData.is_passenger, accountData.is_driver);
    }
    
    async getAccountById (accountId: string) {
        const [accountData] = await this.connection.query("select * from ccca.account where account_id = $1", [accountId]);
        return new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.password, accountData.carPlate, accountData.is_passenger, accountData.is_driver);
    }
    
    async saveAccount (account: Account) {
        await this.connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver, account.password]);
    }
}

export class AccountRepositoryMemory implements AccountRepository {
    accounts: Account[] = [];

    async getAccountByEmail(email: string): Promise<any> {
        return this.accounts.find((account: any) => account.email === email);
    }

    async getAccountById(accountId: string): Promise<any> {
        return this.accounts.find((account: any) => account.accountId === accountId);
    }

    async saveAccount(account: any): Promise<void> {
        this.accounts.push(account);
    }

}
