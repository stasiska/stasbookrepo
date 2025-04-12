import { CreateGroupDto, FollowDto, FollowRes, FriendDto, FriendRes, GroupActionDto, GroupList, GroupRes, SocialServiceController, UserIdReq, UserList } from '@lib/grpc/dist/typings/social_service';
import { SocialService } from './social.service';
import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import { Observable } from 'rxjs';


@GrpcService()
export class SocialController implements SocialServiceController {
  constructor(private readonly socialService: SocialService) {}
  
  @GrpcMethod('SocialService', "Follow")
  follow(request: FollowDto): Promise<FollowRes> | Observable<FollowRes> | FollowRes {
    throw new Error('Method not implemented.');
  }

  @GrpcMethod('SocialService', "UnFollow")
  unFollow(request: FollowDto): Promise<FollowRes> | Observable<FollowRes> | FollowRes {
    throw new Error('Method not implemented.');
  }

  @GrpcMethod('SocialService', "AddFriend")
  addFriend(request: FriendDto): Promise<FriendRes> | Observable<FriendRes> | FriendRes {
    throw new Error('Method not implemented.');
  }

  @GrpcMethod('SocialService', "RemoveFriend")
  removeFriend(request: FriendDto): Promise<FriendRes> | Observable<FriendRes> | FriendRes {
    throw new Error('Method not implemented.');
  }

  @GrpcMethod('SocialService', "CreateGroup")
  createGroup(request: CreateGroupDto): Promise<GroupRes> | Observable<GroupRes> | GroupRes {
    throw new Error('Method not implemented.');
  }

  @GrpcMethod('SocialService', "JoinGroup")
  joinGroup(request: GroupActionDto): Promise<GroupRes> | Observable<GroupRes> | GroupRes {
    throw new Error('Method not implemented.');
  }

  @GrpcMethod('SocialService', "LeaveGroup")
  leaveGroup(request: GroupActionDto): Promise<GroupRes> | Observable<GroupRes> | GroupRes {
    throw new Error('Method not implemented.');
  }

  @GrpcMethod('SocialService', "GetUserFriends")
  getUserFriends(request: UserIdReq): Promise<UserList> | Observable<UserList> | UserList {
    throw new Error('Method not implemented.');
  }

  @GrpcMethod('SocialService', "GetUserFollowers")
  getUserFollowers(request: UserIdReq): Promise<UserList> | Observable<UserList> | UserList {
    throw new Error('Method not implemented.');
  }

  @GrpcMethod('SocialService', "GetUserGroups")
  getUserGroups(request: UserIdReq): Promise<GroupList> | Observable<GroupList> | GroupList {
    throw new Error('Method not implemented.');
  }

  
}
