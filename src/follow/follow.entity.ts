import { Field, ObjectType } from "@nestjs/graphql";
import {  BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/user/user.entity";

@Table
@ObjectType()
export class Follow extends Model{
    @ForeignKey(() => User)
    @Column
    @Field()
    followerId: string;
    
    @BelongsTo(() => User)
    follower: User;
    
    @ForeignKey(() => User)
    @Column
    @Field()
    followingId: string;

    @BelongsTo(() => User)
    following: User;
}