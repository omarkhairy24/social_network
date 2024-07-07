import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class UpdatePass {
    @Field({nullable:false})
    @IsNotEmpty()
    currentPassword:string

    @Field({nullable:false})
    @IsNotEmpty()
    newPassword:string
}