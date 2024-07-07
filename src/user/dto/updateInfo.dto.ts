import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsOptional } from "class-validator";
import { FileUpload } from "graphql-upload-ts/dist/Upload";
import { GraphQLUpload } from "graphql-upload-ts/dist/GraphQLUpload";

@InputType()
export class UpdateInfo{

    @IsOptional()
    @Field({nullable:true})
    username:string;

    @IsOptional()
    @Field({nullable:true})
    name:string;

    @IsOptional()
    @Field({nullable:true})
    @IsEmail()
    email:string;
}