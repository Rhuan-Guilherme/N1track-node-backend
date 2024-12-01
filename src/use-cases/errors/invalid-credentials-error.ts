export class InvalidCredentilsError extends Error {
  constructor() {
    super('Usuário ou senha inválidos.');
  }
}
