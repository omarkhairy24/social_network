import * as DataLoader from 'dataloader';
import { Injectable } from "@nestjs/common";
import { UsersService } from "./user/user.service";
import { PostsService } from './posts/post.service';
import { FollowService } from './follow/follow.service';
import { User } from './user/user.entity';
import { LikeService } from './like/like.service';
import { Posts } from './posts/post.entity';
import { Like } from './like/like.entity';
import { CommentService } from './comments/comments.service';


@Injectable()
export class Dataloader {
    constructor(
        private userService:UsersService,
        private postService:PostsService,
        private followService:FollowService,
        private likeService:LikeService,
        private commentService:CommentService
    ){}

    public userLoader = new DataLoader<string, any>(async (userIds: string[]) => {
        const users = await this.userService.findByIds(userIds);
        const usersMap = new Map(users.map(user => [user.id, user]));
        return userIds.map(userId => usersMap.get(userId));
    })

    public postLoader = new DataLoader<string, any>(async (userIds: string[]) => {
        const posts = await this.postService.findByUserIds(userIds);
        const postsMap = new Map(userIds.map(userId => [userId, posts.filter(post => post.userId === userId)]));
        return userIds.map(userId => postsMap.get(userId));
    });

    public likeLoader = new DataLoader<string, any>(async (postIds:string[]) =>{
        const likes = await this.likeService.findAllByIds(postIds)
        const likesMap = new Map<string, Like[]>();
        postIds.forEach(postId => {
            likesMap.set(postId.toString(), []);
        });

        likes.forEach(like => {
            const postId = like.postId.toString();
            const currentLikes = likesMap.get(postId) || [];
            likesMap.set(postId, [...currentLikes, like]);
        });
        return postIds.map(postId => likesMap.get(postId.toString()) || []);
    });

    public commentLoader = new DataLoader<string , any>(async (postsIds:string[]) =>{
        const comments = await this.commentService.findAllByIds(postsIds);
        const commentsMap = new Map();
        postsIds.forEach(postId =>{
            commentsMap.set(postId.toString() , [])
        })

        comments.forEach(comment =>{
            const postId = comment.postId.toString();
            const currentComments = commentsMap.get(postId) || [];
            commentsMap.set(postId , [...currentComments,comment])
        });
        return postsIds.map(postId => commentsMap.get(postId.toString()))
    })

    public followerLoader = new DataLoader(async(userIds: string[]) =>{
        const followers = await this.followService.findFollowers(userIds);

        const followingMap = new Map<string, User[]>();

        const FollowersIds = [...followers.map(follow => follow.followerId)];

        const users = await this.userService.findByIds(FollowersIds);

        const userMap = new Map(users.map(user => [user.id, user]));

        followers.forEach(follow => {
            const user = userMap.get(follow.followerId);
            if (!user) return;

            if (!followingMap.has(follow.followingId)) {
                followingMap.set(follow.followingId, []);
            }

            followingMap.get(follow.followingId).push(user);
        });
        return userIds.map(userId => followingMap.get(userId) || []);
    });

    public followingLoader = new DataLoader(async(userIds: string[]) =>{
        const followings = await this.followService.findFollowing(userIds);

        const followingMap = new Map<string, User[]>();

        const FollowingIds = [...followings.map(follow => follow.followingId)];

        const users = await this.userService.findByIds(FollowingIds);

        const userMap = new Map(users.map(user => [user.id, user]));

        followings.forEach(follow => {
            const user = userMap.get(follow.followingId);
            if (!user) return;

            if (!followingMap.has(follow.followerId)) {
                followingMap.set(follow.followerId, []);
            }

            followingMap.get(follow.followerId).push(user);
        });
        return userIds.map(userId => followingMap.get(userId) || []);
  });
}