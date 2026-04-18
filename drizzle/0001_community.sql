CREATE TABLE "community" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "community_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"invite_code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "community_invite_code_unique" UNIQUE("invite_code")
);
--> statement-breakpoint
CREATE TABLE "community_member" (
	"user_id" bigint PRIMARY KEY NOT NULL,
	"community_id" bigint NOT NULL,
	"role" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "community_member" ADD CONSTRAINT "community_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "community_member" ADD CONSTRAINT "community_member_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "community_member_community_id_idx" ON "community_member" USING btree ("community_id");
--> statement-breakpoint
ALTER TABLE "shifts" ADD COLUMN "community_id" bigint;
--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE cascade ON UPDATE no action;
