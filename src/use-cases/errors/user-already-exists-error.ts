export class UserAlreadyExistsError extends Error {
  constructor() {
    super('O E-mail informado ja esta cadastrado.');
  }
}
