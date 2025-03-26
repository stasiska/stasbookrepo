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

export const tokenTypeEnum = pgEnum("token_type", ["VERIFICATION", "TWO_FACTOR", "PASSWORD_RESET"]);

export const tokens = pgTable(
  'tokens',
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar('email', {length: 255}).notNull(),
    token: varchar('token', {length: 255}).unique().notNull(),
    type: tokenTypeEnum('type').notNull(),
    expiresIn: timestamp("expires_in").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }
);



