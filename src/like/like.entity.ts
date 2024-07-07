import { Field, ObjectType } from "@nestjs/graphql";
import { Table, Column, DataType, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement, Model } from "sequelize-typescript";
import { User } from "src/user/user.entity"; 
import { Posts } from "src/posts/post.entity"; 

@Table
@ObjectType()
export class Like extends Model{

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id:string;


    @ForeignKey(() => User)
    @Column({ allowNull: false })
    @Field({nullable:false})
    userId: string;

    @ForeignKey(() => Posts)
    @Column({ allowNull: false })
    @Field({nullable:false})
    postId: string;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Posts)
    post: Posts;
}