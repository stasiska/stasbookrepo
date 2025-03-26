CREATE TYPE "public"."token_type" AS ENUM('VERIFICATION', 'TWO_FACTOR', 'PASSWORD_RESET');--> statement-breakpoint
CREATE TYPE "public"."auth_method" AS ENUM('CREDENTIALS', 'GOOGLE');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('REGULAR', 'ADMIN');--> statement-breakpoint
CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp DEFAULT now() NOT NULL,
	"expires_in" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"type" "token_type" NOT NULL,
	"expires_in" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"picture" text DEFAULT '...',
	"role" "user_role" DEFAULT 'REGULAR' NOT NULL,
	"isVerified" boolean DEFAULT false NOT NULL,
	"isTwoFactorEnabled" boolean DEFAULT false NOT NULL,
	"method" "auth_method" NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;