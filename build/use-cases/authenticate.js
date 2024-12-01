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

// src/use-cases/authenticate.ts
var authenticate_exports = {};
__export(authenticate_exports, {
  Authenticate: () => Authenticate
});
module.exports = __toCommonJS(authenticate_exports);

// src/use-cases/errors/invalid-credentials-error.ts
var InvalidCredentilsError = class extends Error {
  constructor() {
    super("Usu\xE1rio ou senha inv\xE1lidos.");
  }
};

// src/use-cases/authenticate.ts
var import_bcryptjs = require("bcryptjs");
var Authenticate = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async execute({
    email,
    password
  }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentilsError();
    }
    const passwordCorrect = await (0, import_bcryptjs.compare)(password, user.password_hash);
    if (!passwordCorrect) {
      throw new InvalidCredentilsError();
    }
    return {
      user
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Authenticate
});
