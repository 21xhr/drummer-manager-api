-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "user_platform_id" TEXT NOT NULL,
    "platform_name" TEXT NOT NULL,
    "last_known_balance" INTEGER NOT NULL DEFAULT 0,
    "last_balance_update" TIMESTAMP(3),
    "last_activity_timestamp" TIMESTAMP(3),
    "last_live_activity_timestamp" TIMESTAMP(3),
    "last_seen_stream_day" INTEGER NOT NULL DEFAULT 0,
    "active_offline_days_count" INTEGER NOT NULL DEFAULT 0,
    "active_stream_days_count" INTEGER NOT NULL DEFAULT 0,
    "daily_challenge_count" INTEGER NOT NULL DEFAULT 0,
    "daily_challenge_reset_at" TIMESTAMP(3) NOT NULL,
    "total_numbers_spent_game_wide" INTEGER NOT NULL DEFAULT 0,
    "total_challenges_submitted" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "stream_stats" (
    "id" SERIAL NOT NULL,
    "stream_days_since_inception" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "stream_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenges" (
    "challenge_id" SERIAL NOT NULL,
    "challenge_text" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "duration_type" TEXT NOT NULL,
    "proposer_user_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "is_executing" BOOLEAN NOT NULL DEFAULT false,
    "has_been_auctioned" BOOLEAN NOT NULL DEFAULT false,
    "has_been_digged_out" BOOLEAN NOT NULL DEFAULT false,
    "auction_cost" INTEGER NOT NULL,
    "push_price" INTEGER NOT NULL,
    "disrupt_count" INTEGER NOT NULL DEFAULT 0,
    "numbers_raised" INTEGER NOT NULL DEFAULT 0,
    "total_numbers_spent" INTEGER NOT NULL DEFAULT 0,
    "total_push" INTEGER NOT NULL DEFAULT 0,
    "stream_days_since_activation" INTEGER NOT NULL DEFAULT 0,
    "timestamp_submitted" TIMESTAMP(3) NOT NULL,
    "timestamp_last_activation" TIMESTAMP(3) NOT NULL,
    "timestamp_completed" TIMESTAMP(3),
    "unique_pusher" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("challenge_id")
);

-- CreateTable
CREATE TABLE "pushes" (
    "push_id" SERIAL NOT NULL,
    "challenge_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "cost" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pushes_pkey" PRIMARY KEY ("push_id")
);

-- CreateTable
CREATE TABLE "temp_quotes" (
    "quote_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "challenge_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "quoted_cost" INTEGER NOT NULL,
    "timestamp_created" TIMESTAMP(3) NOT NULL,
    "is_locked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "temp_quotes_pkey" PRIMARY KEY ("quote_id")
);

-- CreateTable
CREATE TABLE "streams" (
    "stream_session_id" SERIAL NOT NULL,
    "current_stream_number" INTEGER NOT NULL,
    "start_timestamp" TIMESTAMP(3) NOT NULL,
    "end_timestamp" TIMESTAMP(3),
    "duration_minutes" INTEGER,
    "total_pushes_in_session" INTEGER NOT NULL DEFAULT 0,
    "total_numbers_spent_on_push" INTEGER NOT NULL DEFAULT 0,
    "total_digouts_in_session" INTEGER NOT NULL DEFAULT 0,
    "total_numbers_spent_on_digout" INTEGER NOT NULL DEFAULT 0,
    "total_disrupts_in_session" INTEGER NOT NULL DEFAULT 0,
    "total_numbers_spent_on_disrupt" INTEGER NOT NULL DEFAULT 0,
    "total_numbers_spent_in_session" INTEGER NOT NULL DEFAULT 0,
    "has_been_processed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "streams_pkey" PRIMARY KEY ("stream_session_id")
);

-- CreateTable
CREATE TABLE "missions" (
    "mission_id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_value" INTEGER NOT NULL,
    "current_value" INTEGER NOT NULL DEFAULT 0,
    "is_executing" BOOLEAN NOT NULL DEFAULT false,
    "date_created" TIMESTAMP(3) NOT NULL,
    "date_completed" TIMESTAMP(3),

    CONSTRAINT "missions_pkey" PRIMARY KEY ("mission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_platform_id_key" ON "users"("user_platform_id");

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_proposer_user_id_fkey" FOREIGN KEY ("proposer_user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pushes" ADD CONSTRAINT "pushes_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("challenge_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pushes" ADD CONSTRAINT "pushes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temp_quotes" ADD CONSTRAINT "temp_quotes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temp_quotes" ADD CONSTRAINT "temp_quotes_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("challenge_id") ON DELETE RESTRICT ON UPDATE CASCADE;
