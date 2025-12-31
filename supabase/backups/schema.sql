


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;




ALTER SCHEMA "public" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."CadenceUnit" AS ENUM (
    'DAILY',
    'WEEKLY',
    'MONTHLY',
    'CUSTOM_DAYS'
);


ALTER TYPE "public"."CadenceUnit" OWNER TO "postgres";


CREATE TYPE "public"."ChallengeStatus" AS ENUM (
    'ACTIVE',
    'ARCHIVED',
    'AUCTIONED',
    'COMPLETED',
    'FAILED',
    'IN_PROGRESS',
    'REMOVED'
);


ALTER TYPE "public"."ChallengeStatus" OWNER TO "postgres";


CREATE TYPE "public"."DurationType" AS ENUM (
    'ONE_OFF',
    'RECURRING'
);


ALTER TYPE "public"."DurationType" OWNER TO "postgres";


CREATE TYPE "public"."PlatformName" AS ENUM (
    'GAME_MASTER',
    'KICK',
    'TWITCH',
    'YOUTUBE'
);


ALTER TYPE "public"."PlatformName" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."_prisma_migrations" (
    "id" character varying(36) NOT NULL,
    "checksum" character varying(64) NOT NULL,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) NOT NULL,
    "logs" "text",
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "applied_steps_count" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."_prisma_migrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."accounts" (
    "account_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "platform_id" "text" NOT NULL,
    "platform_name" "public"."PlatformName" NOT NULL,
    "current_balance" integer DEFAULT 0 NOT NULL,
    "last_balance_update" timestamp(3) without time zone,
    "last_activity_timestamp" timestamp(3) without time zone,
    "last_live_activity_timestamp" timestamp(3) without time zone,
    "username" "text"
);


ALTER TABLE "public"."accounts" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."accounts_account_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."accounts_account_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."accounts_account_id_seq" OWNED BY "public"."accounts"."account_id";



CREATE TABLE IF NOT EXISTS "public"."challenges" (
    "challenge_id" integer NOT NULL,
    "category" "text" NOT NULL,
    "proposer_user_id" integer NOT NULL,
    "status" "public"."ChallengeStatus" NOT NULL,
    "is_executing" boolean DEFAULT false NOT NULL,
    "has_been_auctioned" boolean DEFAULT false NOT NULL,
    "has_been_digged_out" boolean DEFAULT false NOT NULL,
    "auction_cost" integer DEFAULT 0 NOT NULL,
    "disrupt_count" integer DEFAULT 0 NOT NULL,
    "numbers_raised" integer DEFAULT 0 NOT NULL,
    "total_numbers_spent" bigint DEFAULT 0 NOT NULL,
    "total_push" integer DEFAULT 0 NOT NULL,
    "stream_days_since_activation" integer DEFAULT 0 NOT NULL,
    "timestamp_submitted" timestamp(3) without time zone NOT NULL,
    "timestamp_last_activation" timestamp(3) without time zone NOT NULL,
    "timestamp_completed" timestamp(3) without time zone,
    "unique_pusher" integer DEFAULT 0 NOT NULL,
    "push_base_cost" integer DEFAULT 21 NOT NULL,
    "timestampLastStreamDayTicked" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "current_session_count" integer DEFAULT 0 NOT NULL,
    "session_start_timestamp" timestamp(3) without time zone,
    "total_sessions" integer NOT NULL,
    "duration_type" "public"."DurationType" NOT NULL,
    "failure_reason" "text",
    "cadence_period_start" timestamp(3) without time zone,
    "cadence_progress_counter" integer DEFAULT 0 NOT NULL,
    "cadence_unit" "public"."CadenceUnit",
    "session_cadence_text" "text",
    "cadence_required_count" integer DEFAULT 1,
    "timestamp_last_session_tick" timestamp(3) without time zone,
    "submission_cost" integer NOT NULL,
    "challenge_text" "jsonb" NOT NULL
);


ALTER TABLE "public"."challenges" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."challenges_challenge_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."challenges_challenge_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."challenges_challenge_id_seq" OWNED BY "public"."challenges"."challenge_id";



CREATE TABLE IF NOT EXISTS "public"."pushes" (
    "push_id" integer NOT NULL,
    "challenge_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "cost" integer NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "quantity" integer DEFAULT 1 NOT NULL
);


ALTER TABLE "public"."pushes" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."pushes_push_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."pushes_push_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."pushes_push_id_seq" OWNED BY "public"."pushes"."push_id";



CREATE TABLE IF NOT EXISTS "public"."stream_stats" (
    "id" integer NOT NULL,
    "stream_days_since_inception" integer DEFAULT 0 NOT NULL,
    "days_since_inception" integer DEFAULT 0 NOT NULL,
    "last_maintenance_at" timestamp(3) without time zone
);


ALTER TABLE "public"."stream_stats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."streams" (
    "stream_session_id" integer NOT NULL,
    "current_stream_number" integer NOT NULL,
    "start_timestamp" timestamp(3) without time zone NOT NULL,
    "end_timestamp" timestamp(3) without time zone,
    "duration_minutes" integer,
    "total_pushes_in_session" integer DEFAULT 0 NOT NULL,
    "total_numbers_spent_on_push" integer DEFAULT 0 NOT NULL,
    "total_digouts_in_session" integer DEFAULT 0 NOT NULL,
    "total_numbers_spent_on_digout" integer DEFAULT 0 NOT NULL,
    "total_disrupts_in_session" integer DEFAULT 0 NOT NULL,
    "total_numbers_spent_on_disrupt" integer DEFAULT 0 NOT NULL,
    "total_numbers_spent_in_session" integer DEFAULT 0 NOT NULL,
    "has_been_processed" boolean DEFAULT false NOT NULL,
    "total_challenges_submitted_in_session" integer DEFAULT 0 NOT NULL,
    "total_numbers_returned_from_removals_in_session" integer DEFAULT 0 NOT NULL,
    "total_removals_in_session" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."streams" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."streams_stream_session_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."streams_stream_session_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."streams_stream_session_id_seq" OWNED BY "public"."streams"."stream_session_id";



CREATE TABLE IF NOT EXISTS "public"."temp_quotes" (
    "quote_id" "text" NOT NULL,
    "user_id" integer NOT NULL,
    "challenge_id" integer NOT NULL,
    "quantity" integer NOT NULL,
    "quoted_cost" integer NOT NULL,
    "timestamp_created" timestamp(3) without time zone NOT NULL,
    "is_locked" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."temp_quotes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "user_id" integer NOT NULL,
    "last_activity_timestamp" timestamp(3) without time zone,
    "last_live_activity_timestamp" timestamp(3) without time zone,
    "last_seen_stream_day" integer DEFAULT 0 NOT NULL,
    "active_offline_days_count" integer DEFAULT 0 NOT NULL,
    "active_stream_days_count" integer DEFAULT 0 NOT NULL,
    "daily_challenge_reset_at" timestamp(3) without time zone NOT NULL,
    "total_numbers_spent_game_wide" bigint DEFAULT 0 NOT NULL,
    "total_challenges_submitted" integer DEFAULT 0 NOT NULL,
    "total_numbers_returned_from_removals_game_wide" bigint DEFAULT 0 NOT NULL,
    "total_numbers_spent" bigint DEFAULT 0 NOT NULL,
    "total_received_from_removals" integer DEFAULT 0 NOT NULL,
    "total_removals_executed" integer DEFAULT 0 NOT NULL,
    "total_digouts_executed" integer DEFAULT 0 NOT NULL,
    "totalPushesExecuted" integer DEFAULT 0 NOT NULL,
    "totalDisruptsExecuted" integer DEFAULT 0 NOT NULL,
    "daily_submission_count" integer DEFAULT 0 NOT NULL,
    "total_caused_by_removals" bigint DEFAULT 0 NOT NULL,
    "total_to_community_chest" bigint DEFAULT 0 NOT NULL,
    "total_to_pushers" bigint DEFAULT 0 NOT NULL,
    "lastProcessedDay" integer DEFAULT 0 NOT NULL,
    "lastSeenDay" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."users_user_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."users_user_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."users_user_id_seq" OWNED BY "public"."users"."user_id";



ALTER TABLE ONLY "public"."accounts" ALTER COLUMN "account_id" SET DEFAULT "nextval"('"public"."accounts_account_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."challenges" ALTER COLUMN "challenge_id" SET DEFAULT "nextval"('"public"."challenges_challenge_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."pushes" ALTER COLUMN "push_id" SET DEFAULT "nextval"('"public"."pushes_push_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."streams" ALTER COLUMN "stream_session_id" SET DEFAULT "nextval"('"public"."streams_stream_session_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."users" ALTER COLUMN "user_id" SET DEFAULT "nextval"('"public"."users_user_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."_prisma_migrations"
    ADD CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("account_id");



ALTER TABLE ONLY "public"."challenges"
    ADD CONSTRAINT "challenges_pkey" PRIMARY KEY ("challenge_id");



ALTER TABLE ONLY "public"."pushes"
    ADD CONSTRAINT "pushes_pkey" PRIMARY KEY ("push_id");



ALTER TABLE ONLY "public"."stream_stats"
    ADD CONSTRAINT "stream_stats_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."streams"
    ADD CONSTRAINT "streams_pkey" PRIMARY KEY ("stream_session_id");



ALTER TABLE ONLY "public"."temp_quotes"
    ADD CONSTRAINT "temp_quotes_pkey" PRIMARY KEY ("quote_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("user_id");



CREATE UNIQUE INDEX "accounts_platform_id_platform_name_key" ON "public"."accounts" USING "btree" ("platform_id", "platform_name");



ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."challenges"
    ADD CONSTRAINT "challenges_proposer_user_id_fkey" FOREIGN KEY ("proposer_user_id") REFERENCES "public"."users"("user_id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."pushes"
    ADD CONSTRAINT "pushes_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("challenge_id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."pushes"
    ADD CONSTRAINT "pushes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."temp_quotes"
    ADD CONSTRAINT "temp_quotes_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("challenge_id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."temp_quotes"
    ADD CONSTRAINT "temp_quotes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON UPDATE CASCADE ON DELETE RESTRICT;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;







































































































































































































