import express from "express";
import { AccountDAODatabase } from "./data";
import Signup from "./signup";
import GetAccount from "./getAccount";

const app = express();
app.use(express.json());

const accountDAO = new AccountDAODatabase();
const signup = new Signup(accountDAO);
const getAccount = new GetAccount(accountDAO);

app.post("/signup", async function (req, res) {
    const input = req.body;
    try {
        const output = await signup.execute(input);
        res.json(output);
    } catch (e: any) {
        res.status(422).json({ message: e.message });
    }
});

app.get("/accounts/:accountId", async function (req, res) {
    const accountId = req.params.accountId;
    const output = await getAccount.execute(accountId);
    res.json(output);
});

app.listen(3000);
