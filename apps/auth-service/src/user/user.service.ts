import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import * as schema from '../drizzle/schema/schema';
import { eq } from 'drizzle-orm';
import { CreateUserDto } from './dto/CreateUser.dto';
import { hash } from 'argon2';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { GrpcNotFound } from '@lib/shared/dist';

@Injectable()
export class UserService {
    public constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }

    public async getAllUsers() {
        const users = await this.db.select().from(schema.users)
        return users
    }

    public async findById(id: string) {
        const user = await this.db.select().from(schema.users).where(eq(schema.users.id, id))
        return user[0];
    }

    public async findByEmail(email: string) {
        const user = await this.db.select().from(schema.users).where(eq(schema.users.email, email))
        return user[0]
    }

    public async create(user: CreateUserDto) {
        const hashPassword = user.password ? await hash(user.password) : ''

        user.password = hashPassword
        const newUser = await this.db.insert(schema.users).values(user).returning()
        return newUser[0]
    }

    public async updateProfile(userId: string, dto: UpdateUserDto) {
        const updateUser = await this.db.update(schema.users).set({ [schema.users.isVerified.name]: true }).where(eq(schema.users.id, userId)).returning()
        return updateUser[0]
    }


    public async checkProfile(id: string){
        const user = await this.db.select().from(schema.users).where(eq(schema.users.id, id))

        if (!user[0]) {
            throw GrpcNotFound('Пользователь не найден. Пожалуйста, проверте входные данные.')

        }

        return user[0]
    }
}
