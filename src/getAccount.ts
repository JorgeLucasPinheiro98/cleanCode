import AccountDAO from "./data";

export default class GetAccount {

	constructor (readonly accountDAO: AccountDAO) {
	}

	async execute (accountId: string) {
		const output = await this.accountDAO.getAccountById(accountId);
		return output;
	}
}


