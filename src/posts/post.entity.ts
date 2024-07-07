import { Field, ObjectType } from "@nestjs/graphql";
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Comments } from "src/comments/comments.entity";
import { Like } from "src/like/like.entity";
import { User } from "src/user/user.entity";

@ObjectType()
@Table
export class Posts extends Model{

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    @Field()
    id:string;

    @Column
    @Field({nullable:true})
    header:string

    @Column
    @Field({nullable:true})
    description:string

    @Column(DataType.JSON)
    @Field(()=>[String],{nullable:true})
    images:string[]

    @Column({allowNull:false})
    @ForeignKey(()=>User)
    userId:string

    @BelongsTo(()=>User)
    user:User

    @HasMany(() => Like)
    like:Like[];

    @HasMany(() => Comments)
    comments:Comments[];
}