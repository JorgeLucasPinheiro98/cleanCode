import AccountRepository from "../../infra/repository/AccountRepository";
import { inject } from "../../infra/di/Registry";

export default class GetAccount {
	@inject("accountRepository")
		accountRepository!: AccountRepository;

	async execute (accountId: string) {
		const account = await this.accountRepository.getAccountById(accountId);
		return account;
	}
}


