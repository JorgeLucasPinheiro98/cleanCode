import Name from "../../src/domain/vo/Name";

test("Deve criar um nome válido", function () {
    const name = new Name("Robert Martin");
    expect(name).toBeDefined();
});

test("Não deve criar um nome inválido", function () {
    expect(() => new Name("Robert")).toThrow(new Error("Invalid name"));
});
