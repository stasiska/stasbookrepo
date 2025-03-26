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
  import { relations } from "drizzle-orm";import { users } from './users.schema';


export const account = pgTable(
  'account',
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    refreshToken: text('refresh_token').notNull(),
    accessToken: text('access_token').notNull(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade'}),
    createdAt: timestamp("expires_at").defaultNow().notNull(),
    expiresIn: timestamp("expires_in", {mode: "string"}).notNull(),
  }
);

export const accountRelations = relations(account, ({ one }) => ({
    user: one(users, { fields: [account.userId], references: [users.id]})
}))
