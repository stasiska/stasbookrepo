import { relations } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  boolean,
  integer,
  timestamp,
  pgEnum,
  text,
} from "drizzle-orm/pg-core";
import { account } from './account.schema';

export const userRoleEnum = pgEnum("user_role", ["REGULAR", "ADMIN"])
export const authMethodEnum = pgEnum("auth_method", ["CREDENTIALS", 'GOOGLE'])

export const users = pgTable(
  'users',
  {
    id: uuid("id").defaultRandom().primaryKey(),
    displayName: varchar('name', {length: 255}).notNull(),
    email: varchar('email', {length: 255}).unique().notNull(),
    password: varchar('password', {length: 255}),
    picture: text('picture').default('...'),
    role: userRoleEnum('role').default('REGULAR').notNull(),
    isVerified: boolean('isVerified').default(false).notNull(),
    isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(false).notNull(),
    method: authMethodEnum('method').notNull()
  }
);

export const usersRelations = relations(users, ({ many }) => ({
   account: many(account)
}))

