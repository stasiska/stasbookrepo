import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { AuthorIdDto, CreateGroupDto, EmptyRes, FollowDto, FollowRes, FriendDto, FriendRes, GroupActionDto, GroupList, GroupRes, SOCIAL_SERVICE_NAME, SOCIAL_SERVICE_PACKAGE_NAME, SocialServiceClient, UserIdReq, UserList } from "../typings/social_service";
import { Observable } from "rxjs";
import { ClientGrpc } from "@nestjs/microservices";

@Injectable()
export class SocialServiceClientService implements SocialServiceClient, OnModuleInit {
    private socialServiceClient: SocialServiceClient;
    
    constructor(@Inject(SOCIAL_SERVICE_PACKAGE_NAME) private client: ClientGrpc) {}
    sendUserIdForNotification(request: UserIdReq): Observable<UserList> {
        return this.socialServiceClient.sendUserIdForNotification(request);
    }

    follow(request: FollowDto): Observable<FollowRes> {
        return this.socialServiceClient.follow(request);
    }
    unFollow(request: FollowDto): Observable<FollowRes> {
        return this.socialServiceClient.unFollow(request);
    }
    addFriend(request: FriendDto): Observable<FriendRes> {
        return this.socialServiceClient.addFriend(request);
    }
    removeFriend(request: FriendDto): Observable<FriendRes> {
        return this.socialServiceClient.removeFriend(request);
    }
    createGroup(request: CreateGroupDto): Observable<GroupRes> {
        return this.socialServiceClient.createGroup(request);
    }
    joinGroup(request: GroupActionDto): Observable<GroupRes> {
        return this.socialServiceClient.joinGroup(request);
    }
    leaveGroup(request: GroupActionDto): Observable<GroupRes> {
        return this.socialServiceClient.leaveGroup(request);
    }
    getUserFriends(request: UserIdReq): Observable<UserList> {
        return this.socialServiceClient.getUserFriends(request);
    }
    getUserFollowers(request: UserIdReq): Observable<UserList> {
        return this.socialServiceClient.getUserFollowers(request);
    }
    getUserGroups(request: UserIdReq): Observable<GroupList> {
        return this.socialServiceClient.getUserGroups(request);
    }
    onModuleInit() {
        this.socialServiceClient = this.client.getService<SocialServiceClient>(SOCIAL_SERVICE_NAME);
    }
}