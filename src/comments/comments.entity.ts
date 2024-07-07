import { Field, ObjectType } from "@nestjs/graphql";
import { Table,Column, Model, PrimaryKey, DataType, AutoIncrement, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Posts } from "src/posts/post.entity";
import { User } from "src/user/user.entity";

@Table
@ObjectType()
export class Comments extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id:string;

    @ForeignKey(()=>User)
    @Column
    @Field({nullable:false})
    userId:string;

    @BelongsTo(()=>User)
    user:User

    @ForeignKey(()=>Posts)
    @Column
    @Field({nullable:false})
    postId:string;

    @Column
    @Field({nullable:true})
    comment:string;

    @Column
    @Field({nullable:true})
    image:string
}