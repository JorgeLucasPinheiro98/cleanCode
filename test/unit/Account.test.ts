import Account from "../../src/domain/Account";

test("Deve criar uma conta de motorista", function () {
    const account = Account.create(
        "John Doe", 
        `john.doe${Math.random()}@gmail.com`,
        "97456321558",
        "asdQWE123",
        "AAA9999",
        false,
        true
    );
    expect(account).toBeDefined();
});

test("Não deve criar uma conta de passageiro", function () {
    expect(() => new Account(
        "1",
        "John Doe", 
        `john.doe${Math.random()}@gmail.com`,
        "97456321558",
        "asdQWE123",
        "",
        true,
        false
    )).toThrow(new Error("Invalid UUID"));
});

test("Não deve criar uma conta de motorista com placa inválida", function () {
    expect(() => Account.create(
        "John Doe", 
        `john.doe${Math.random()}@gmail.com`,
        "97456321558",
        "asdQWE123",
        "AAA999",
        false,
        true
    )).toThrow(new Error("Invalid car plate"));
});