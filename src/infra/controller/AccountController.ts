import GetAccount from "../../application/usecase/GetAccount";
import Signup from "../../application/usecase/signup";
import { inject } from "../di/Registry";
import HttpServer from "../http/HttpServer";

// Interface Adapter
export default class AccountController {
    @inject("httpServer")
    httpServer!: HttpServer;
    @inject("signup")
    signup!: Signup;
    @inject("getAccount")
    getAccount!: GetAccount;

    constructor () {
        this.httpServer.register("post", "/signup", async (params: any, body: any) => {
            const input = body;
            const output = await this.signup.execute(input);
            return output;
        });

        this.httpServer.register("get", "/accounts/:{accountId}", async (params: any, body: any) => {
            const accountId = params.accountId;
            const output = await this.getAccount.execute(accountId);
            return output;
        });
    }
}
