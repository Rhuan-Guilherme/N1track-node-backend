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

// src/use-cases/factories/make-authenticate.ts
var make_authenticate_exports = {};
__export(make_authenticate_exports, {
  makeAuthenticate: () => makeAuthenticate
});
module.exports = __toCommonJS(make_authenticate_exports);

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  PORT: import_zod.z.coerce.number().default(3333),
  NODE_ENV: import_zod.z.enum(["dev", "test", "production"]).default("dev"),
  DATABASE_URL: import_zod.z.string(),
  JWT_SECRET: import_zod.z.string()
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.log("\u274C Invalid environments variables.", _env.error.format());
  throw new Error("\u274C Invalid environments variables.");
}
var env = _env.data;

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query"] : []
});

// src/repositories/prisma/prisma-user-repository.ts
var PrismaUserRepository = class {
  async findById(id) {
    const user = prisma.user.findUnique({ where: { id } });
    if (!user) {
      return null;
    }
    return user;
  }
  async findByEmail(email) {
    const user = prisma.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }
    return user;
  }
  async create(data) {
    const user = prisma.user.create({ data });
    return user;
  }
};

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

// src/use-cases/factories/make-authenticate.ts
function makeAuthenticate() {
  const userRepository = new PrismaUserRepository();
  const authenticateUseCase = new Authenticate(userRepository);
  return authenticateUseCase;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeAuthenticate
});
