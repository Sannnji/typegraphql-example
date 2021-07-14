import { MyContext } from "../../types/MyContext";
import { MiddlewareFn } from "type-graphql";

declare module "express-session" {
  interface SessionData {
    userId: any;
  }
}

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("not authenticated");
  }
  return next(); // this will go to the next middleware if applicable 
};
