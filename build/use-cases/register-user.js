"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/use-cases/register-user.ts
var register_user_exports = {};
__export(register_user_exports, {
  RegisterUser: () => RegisterUser
});
module.exports = __toCommonJS(register_user_exports);
var import_bcryptjs = require("bcryptjs");

// src/use-cases/errors/user-already-exists-error.ts
var UserAlreadyExistsError = class extends Error {
  constructor() {
    super("O E-mail informado ja esta cadastrado.");
  }
};

// src/use-cases/register-user.ts
var RegisterUser = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async execute({
    email,
    name,
    password
  }) {
    const findEmailAlreadyExists = await this.userRepository.findByEmail(email);
    if (findEmailAlreadyExists) {
      throw new UserAlreadyExistsError();
    }
    const password_hash = await (0, import_bcryptjs.hash)(password, 6);
    const user = await this.userRepository.create({
      email,
      name,
      password_hash
    });
    return {
      user
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RegisterUser
});
