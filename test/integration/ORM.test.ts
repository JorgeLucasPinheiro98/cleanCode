import UUID from "../../src/domain/vo/UUID";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import Registry from "../../src/infra/di/Registry";
import ORM, { AccountModel } from "../../src/infra/orm/ORM";

test("Deve persistir usando um ORM", async function () {
    const connection = new PgPromiseAdapter();
    Registry.getInstance().provide("databaseConnection", connection);
    const orm = new ORM();
    const accountId = UUID.create().getValue();
    const accountModel = new AccountModel(accountId, "John Doe", "john.doe@gmail.com", "111.111.111-11", "111111", "AAA9999", true, true);
    await orm.save(accountModel);
    const persistedAccountModel = await orm.get(AccountModel, "account_id", accountId);
    expect(persistedAccountModel.name).toBe("John Doe");
    expect(persistedAccountModel.email).toBe("john.doe@gmail.com");
    expect(persistedAccountModel.cpf).toBe("111.111.111-11");
    await connection.close();
});
