CREATE TABLE "conversations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "conversations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" varchar(255) NOT NULL,
	"conversationId" varchar(255) NOT NULL,
	"agentId" varchar(255) NOT NULL,
	"status" varchar(50) NOT NULL,
	"transcript" jsonb,
	"analysis" jsonb,
	"summary" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "conversations_conversationId_unique" UNIQUE("conversationId")
);
