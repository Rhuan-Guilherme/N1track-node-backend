"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_fastify = __toESM(require("fastify"));

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

// src/use-cases/errors/user-already-exists-error.ts
var UserAlreadyExistsError = class extends Error {
  constructor() {
    super("O E-mail informado ja esta cadastrado.");
  }
};

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

// src/use-cases/register-user.ts
var import_bcryptjs = require("bcryptjs");
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

// src/use-cases/factories/make-register-user.ts
function makeRegisterUser() {
  const userRepository = new PrismaUserRepository();
  const registerUserUseCase = new RegisterUser(userRepository);
  return registerUserUseCase;
}

// src/http/controllers/user/register-user.ts
var import_zod2 = require("zod");
async function register(request, reply) {
  const userRequestSchema = import_zod2.z.object({
    name: import_zod2.z.string(),
    email: import_zod2.z.string().email(),
    password: import_zod2.z.string().min(6)
  });
  const { email, name, password } = userRequestSchema.parse(request.body);
  try {
    const registeUseCase = makeRegisterUser();
    await registeUseCase.execute({ email, name, password });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    throw error;
  }
  return reply.status(201).send();
}

// src/use-cases/errors/invalid-credentials-error.ts
var InvalidCredentilsError = class extends Error {
  constructor() {
    super("Usu\xE1rio ou senha inv\xE1lidos.");
  }
};

// src/use-cases/authenticate.ts
var import_bcryptjs2 = require("bcryptjs");
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
    const passwordCorrect = await (0, import_bcryptjs2.compare)(password, user.password_hash);
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

// src/http/controllers/user/authenticate.ts
var import_zod3 = require("zod");
async function authenticate(request, reply) {
  const userAuthenticateRequest = import_zod3.z.object({
    email: import_zod3.z.string().email(),
    password: import_zod3.z.string()
  });
  const { email, password } = userAuthenticateRequest.parse(request.body);
  try {
    const authenticateUseCase = makeAuthenticate();
    const { user } = await authenticateUseCase.execute({ email, password });
    const token = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id, expiresIn: "7d" } }
    );
    return reply.status(200).send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentilsError) {
      return reply.status(401).send({ message: error.message });
    }
  }
}

// src/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("O recurso informado n\xE3o foi encontrado.");
  }
};

// src/use-cases/get-user.ts
var GetUser = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async execute({ id }) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new ResourceNotFoundError();
    }
    return {
      user
    };
  }
};

// src/use-cases/factories/make-get-user.ts
function makeGetUser() {
  const userRepository = new PrismaUserRepository();
  const getUserUseCase = new GetUser(userRepository);
  return getUserUseCase;
}

// src/http/controllers/user/get-user.ts
async function getUser(request, reply) {
  try {
    const getUserUseCase = makeGetUser();
    const { user } = await getUserUseCase.execute({ id: request.user.sub });
    return reply.status(200).send({ ...user, password_hash: void 0 });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }
  }
}

// src/http/middlewares/verify-jwt.ts
async function verifyJWT(request, reply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    return reply.status(401).send({ message: "N\xE3o autorizado." });
  }
}

// src/http/controllers/user/routes.ts
async function userRoutes(app2) {
  app2.post("/user/register", register);
  app2.post("/user/session", authenticate);
  app2.get("/user", { onRequest: [verifyJWT] }, getUser);
}

// src/app.ts
var import_jwt = __toESM(require("@fastify/jwt"));
var app = (0, import_fastify.default)();
app.register(import_jwt.default, {
  secret: env.JWT_SECRET
});
app.register(userRoutes);
app.get("/", (_, reply) => {
  return reply.send("API in running! \u{1F680}");
});
app.listen({
  port: env.PORT
}).then(() => console.log("Server is running http://localhost:" + env.PORT));
