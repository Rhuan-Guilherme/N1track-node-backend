export class ResourceNotFoundError extends Error {
  constructor() {
    super('O recurso informado não foi encontrado.');
  }
}
