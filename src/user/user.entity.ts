import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Table,Model, Column, DataType, Unique, BeforeSave, HasMany, BelongsToMany } from "sequelize-typescript";
import { Comments } from "src/comments/comments.entity";
import { Follow } from "src/follow/follow.entity";
import { Like } from "src/like/like.entity";
import { Posts } from "src/posts/post.entity";


export enum Gender{
    Male = 'Male',
    Female = 'Female'
}

registerEnumType(Gender,{name:'Gender'})


@Table
@ObjectType()
export class User extends Model{
    @Column({
        primaryKey:true,
        defaultValue:DataType.UUIDV4,
        type:DataType.UUID
    })
    @Field()
    id:string;

    @Unique
    @Column({allowNull:false})
    @Field({nullable:false})
    username:string;

    @Column({allowNull:false})
    @Field({nullable:false})
    name:string;

    @Unique
    @Column({ allowNull:false })
    @Field({nullable:false})
    email: string;

    @Column({ allowNull:false })
    @Field({nullable:false})
    password: string;
    
    @Column
    @Field({nullable:true})
    image: string;

    @Column
    @Field(()=>Gender)
    gender:Gender

    @Column
    passwordChangedAt:Date;

    @HasMany(()=>Posts)
    posts:Promise<Posts[]>

    @HasMany(() => Like)
    like:Like[];

    @BelongsToMany(() => User, () => Follow, 'followingId' ,'followerId')
    @Field(() => [User])
    following: Promise<User[]>;
  
    @BelongsToMany(() => User, () => Follow, 'followerId' , 'followingId')
    @Field(() => [User])
    followers: Promise<User[]>;

    @HasMany(() => Comments)
    comments:Comments[];

    @BeforeSave
    static async setPasswordChangedAt(user:User){
        if(!user.isNewRecord && user.changed('password')){
            user.setDataValue('passwordChangedAt',Date.now() - 1000);
        }
    }
}