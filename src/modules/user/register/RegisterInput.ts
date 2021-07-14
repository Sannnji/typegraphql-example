import { Length, IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExist";

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 255, {message: "Name must have at least one or more characters"})
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  //Custom Validator
  @IsEmailAlreadyExist({message: "Email already exists"})
  email: string;

  @Field()
  password: string;
}
