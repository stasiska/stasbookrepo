import * as schema from '../schema/schema';
import { users } from '../../drizzle/schema/schema'; 

import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export type DrizzleDB = NodePgDatabase<typeof schema>;

export type User = InferSelectModel<typeof users>;

export type UserRole = "REGULAR" | "ADMIN"

export type TokenType = "VERIFICATION" | "TWO_FACTOR" | "PASSWORD_RESET"