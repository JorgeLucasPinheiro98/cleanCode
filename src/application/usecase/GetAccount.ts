import AccountRepository from "../../infra/repository/AccountRepository";
import { inject } from "../../infra/di/Registry";

export default class GetAccount {
	@inject("accountRepository")
		accountRepository!: AccountRepository;

	async execute (accountId: string): Promise<Output> {
		const account = await this.accountRepository.getAccountById(accountId);
		return {
			accountId: account.getAccountId(),
			name: account.getName(),
			email: account.getEmail(),
			cpf: account.getCpf(),
			password: account.getPassword(),
			carPlate: account.getCarPlate(),
			isPassenger: account.isPassenger,
			isDriver: account.isDriver
		};
	}
}

type Output = {
	accountId: string,
	name: string,
	email: string,
	cpf: string,
	password: string,
	carPlate?: string,
	isPassenger: boolean,
	isDriver: boolean
}
