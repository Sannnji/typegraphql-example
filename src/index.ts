import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";

import { RegisterResolver } from "./modules/user/Register";
import { redis } from "./redis";
import { LoginResolver } from "./modules/user/Login";
import { MeResolver } from "./modules/user/Me";
import { LogoutResolver } from "./modules/user/Logout";

declare module "express-session" {
  interface SessionData {
    userId: any;
    cookie: Cookie;
    [key: string]: any;
  }
}

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver, MeResolver, LogoutResolver],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

  //this should always be applied before apollo middleware
  app.use(
    session({
      store: new RedisStore({ client: redis as any }),
      name: "qid",
      secret: "asd123",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );

  apolloServer.applyMiddleware({ app });

  app.listen(9000, () => {
    console.log("Server started on http://localhost:9000/graphql");
  });
};

main();
