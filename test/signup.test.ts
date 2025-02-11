import { AccountDAODatabase, AccountDAOMemory } from "../src/data";
import GetAccount from "../src/getAccount";
import Signup from "../src/signup";
import sinon from "sinon";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
    const accountDAO = new AccountDAODatabase();
    // const accountDAO = new AccountDAOMemory();
    signup = new Signup(accountDAO);
    getAccount = new GetAccount(accountDAO);
});

test("Deve fazer a criação da conta de um usuário do tipo passageiro", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.password).toBe(input.password);
});

test("Deve fazer a criação da conta de um usuário do tipo motorista", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        carPlate: "AAA9999",
        isDriver: true
    };
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.password).toBe(input.password);
});

test("Não deve fazer a criação da conta de um usuário se o nome for inválido", async function () {
    const input = {
        name: "John",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve fazer a criação da conta de um usuário se o email for inválido", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve fazer a criação da conta de um usuário se o cpf for inválido", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "974563215",
        password: "asdQWE123",
        isPassenger: true
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid cpf"));
});


test("Não deve fazer a criação da conta de um usuário se o senha for inválida", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE",
        isPassenger: true
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid password"));
});

test("Não deve fazer a criação da conta de um usuário se a conta estiver duplicada", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    await signup.execute(input);
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Account already exists"));
});

test("Não deve fazer a criação da conta de um usuário se a placa for inválida", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        carPlate: "AAA999",
        isDriver: true
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid car plate"));
});


// Test Patterns


test("Deve fazer a criação da conta de um usuário do tipo passageiro com stub", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    const saveAccountStub = sinon.stub(AccountDAODatabase.prototype, "saveAccount").resolves();
    const getAccountByEmailStub = sinon.stub(AccountDAODatabase.prototype, "getAccountByEmail").resolves();
    const getAccountById = sinon.stub(AccountDAODatabase.prototype, "getAccountById").resolves(input);
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.password).toBe(input.password);
    saveAccountStub.restore();
    getAccountByEmailStub.restore();
    getAccountById.restore();
});

test("Deve fazer a criação da conta de um usuário do tipo passageiro com spy", async function () {
    const saveAccountSpy = sinon.spy(AccountDAODatabase.prototype, "saveAccount");
    const getAccountByIdSpy = sinon.spy(AccountDAODatabase.prototype, "getAccountById");
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.password).toBe(input.password);
    expect(saveAccountSpy.calledOnce).toBe(true);
    expect(getAccountByIdSpy.calledWith(outputSignup.accountId)).toBe(true);
    saveAccountSpy.restore();
    getAccountByIdSpy.restore();
});

test("Deve fazer a criação da conta de um usuário do tipo passageiro com mock", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    const accountDAOMock = sinon.mock(AccountDAODatabase.prototype);
    accountDAOMock.expects("saveAccount").once().resolves();
    accountDAOMock.expects("getAccountByEmail").once().resolves();
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    accountDAOMock.expects("getAccountById").once().withArgs(outputSignup.accountId).resolves(input);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.password).toBe(input.password);
    accountDAOMock.verify();
    accountDAOMock.restore();
});

test.only("Deve fazer a criação da conta de um usuário do tipo passageiro com fake", async function () {
    const accountDAO = new AccountDAOMemory();
    signup = new Signup(accountDAO);
    getAccount = new GetAccount(accountDAO);
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.password).toBe(input.password);
});
