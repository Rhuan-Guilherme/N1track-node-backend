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

// src/repositories/in-memory/in-memory-user-repository.ts
var in_memory_user_repository_exports = {};
__export(in_memory_user_repository_exports, {
  InMemoryUserRepository: () => InMemoryUserRepository
});
module.exports = __toCommonJS(in_memory_user_repository_exports);
var import_client = require("@prisma/client");
var import_crypto = require("crypto");
var InMemoryUserRepository = class {
  constructor() {
    this.users = [];
  }
  async findById(id) {
    const user = this.users.find((user2) => user2.id === id);
    if (!user) {
      return null;
    }
    return user;
  }
  async findByEmail(email) {
    const user = this.users.find((user2) => user2.email === email);
    if (!user) {
      return null;
    }
    return user;
  }
  async create(data) {
    const user = {
      id: (0, import_crypto.randomUUID)(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      role: import_client.$Enums.Role.TECH,
      created_at: /* @__PURE__ */ new Date()
    };
    this.users.push(user);
    return user;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryUserRepository
});
