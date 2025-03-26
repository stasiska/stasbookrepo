import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService) { }


    @MessagePattern("create_user")
    async createUser(@Body() dto: CreateUserDto) {
      return this.userService.create(dto)
    } 
  
  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('by-id/:id')
  public async findById(@Param('id') id: string) {
    return this.userService.findById(id)
  }

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers()
  }


  @Patch('profile')
  async update(@Authorized('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(userId, dto)
  }

  @MessagePattern("checkProfile")
  public async findProfile(userId: string) {
    return this.userService.checkProfile(userId)
  }

}
