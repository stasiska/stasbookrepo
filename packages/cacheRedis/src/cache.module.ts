import {CacheModule, Module, Global } from '@nestjs/common';
import { default as IORedis } from 'ioredis'
import RedisStore from 'connect-redis';

@Global()
@Module({
    CacheModule
})