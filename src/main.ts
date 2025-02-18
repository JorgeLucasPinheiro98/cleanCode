import { AccountRepositoryDatabase, AccountRepositoryMemory } from "./infra/repository/AccountRepository";
import Signup from "./application/usecase/signup";
import Registry from "./infra/di/Registry";
import GetAccount from "./application/usecase/GetAccount";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter, HapiAdapter } from "./infra/http/HttpServer";
import AccountController from "./infra/controller/AccountController";
import AuthorizeDecorator from "./application/decorator/AuthorizeDecorator";

// Main - Composition Root
const databaseConnection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase();
// const accountRepository = new AccountRepositoryMemory();
const signup = new Signup();
const getAccount = new GetAccount();
const httpServer = new ExpressAdapter();
// const httpServer = new HapiAdapter();
Registry.getInstance().provide("databaseConnection", databaseConnection);
Registry.getInstance().provide("accountRepository", accountRepository);
Registry.getInstance().provide("signup", signup);
Registry.getInstance().provide("getAccount", getAccount);
Registry.getInstance().provide("httpServer", httpServer);
new AccountController();
httpServer.listen(3000);
