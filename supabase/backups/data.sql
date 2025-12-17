SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict 9eXhoVSYsVV1FCGX3EyYvXf8JA7pZzsMiIhvpSmCR2nFeJxrmsfIiocOZVEpeEf

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_clients" ("id", "client_secret_hash", "registration_type", "redirect_uris", "grant_types", "client_name", "client_uri", "logo_uri", "created_at", "updated_at", "deleted_at", "client_type") FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid", "last_webauthn_challenge_data") FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_authorizations" ("id", "authorization_id", "client_id", "user_id", "redirect_uri", "scope", "state", "resource", "code_challenge", "code_challenge_method", "response_type", "status", "authorization_code", "created_at", "expires_at", "approved_at", "nonce") FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_client_states" ("id", "provider_type", "code_verifier", "created_at") FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_consents" ("id", "user_id", "client_id", "scopes", "granted_at", "revoked_at") FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at", "disabled") FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count") FROM stdin;
ed945272-0596-4c98-9116-4edc2b9cf76e	efd00fbf274cb3a304f8644ee1dc77027ad4637fb5a8da3fd880702bb8568289	2025-12-07 10:09:01.162651+00	20251107154037_add_total_disrupts_executed_to_user	\N	\N	2025-12-07 10:09:00.93174+00	1
dddd1c5e-d906-4316-b489-621be83e4541	c2a5eb421717daff42ce9e358ff0ae32b328b80c79f490e89af25e2858d271a6	2025-12-07 10:08:57.257967+00	20251030151117_init	\N	\N	2025-12-07 10:08:57.001386+00	1
7f43a84d-9a4c-404b-96f1-1c2b4cac403f	3c524fe632534d5c72d5612949c1a76bc60f0bac992061ba718a3e36eddd5a27	2025-12-07 10:08:57.581759+00	20251030205840_add_quantity_to_pushes	\N	\N	2025-12-07 10:08:57.35055+00	1
1f19d814-dfbf-431a-9927-a94377d7c629	b3c0a3d2c07d035cd5d5db787aa204aa2f3d48000f7599537460427f694f9651	2025-12-07 10:09:03.750996+00	20251112144235_add_enum_duration_type	\N	\N	2025-12-07 10:09:03.519242+00	1
9d8e1b0d-0ff3-4703-8702-83daa751b191	0ce26b3bdccdea1459365e03e0ffd19eb647f6dbffb21f5f2fd24368200a6b64	2025-12-07 10:08:57.907031+00	20251030211646_add_push_timestamp_default	\N	\N	2025-12-07 10:08:57.674169+00	1
80de80df-ffcf-40e8-9c9a-23fb68a92037	03f63fe5d120c21099c9b3fb0ba3b2e5f5140df553f38ad6afd364ef1ffb395c	2025-12-07 10:09:01.486139+00	20251107231642_add_daily_submission_count	\N	\N	2025-12-07 10:09:01.254652+00	1
1cbf2cfb-37fd-4ebd-bf00-ca2175f27223	89c13fc203d009ebddef371d74c723c049ac1ef3dd4097763169ee3607192f70	2025-12-07 10:08:58.23721+00	20251031171528_rename_push_price_to_base_cost	\N	\N	2025-12-07 10:08:58.000479+00	1
d0c2b936-bb0d-4b51-b3b9-413dcc75040a	612630e8046c663e06236ae13adaec124467812c221e2702f8de8ee479198260	2025-12-07 10:08:58.564162+00	20251031213113_rename_push_price_final	\N	\N	2025-12-07 10:08:58.332194+00	1
306c30a6-f4b2-4e9f-8331-cebaab07310b	30d0d473df8063504f3557129587900d2274324159dfc0191696aded92db0e59	2025-12-07 10:08:58.891246+00	20251104185602_add_new_ledger_and_stream_fields	\N	\N	2025-12-07 10:08:58.656141+00	1
4a714b34-d60b-47d0-8b45-c2c0d2c10891	f8ad150eb09e6a9cb81950e391ac83600b24f5decc7736d3f39dc0e08bdac87d	2025-12-07 10:09:01.807967+00	20251108183134_add_real_world_day_counter	\N	\N	2025-12-07 10:09:01.577877+00	1
cb1a43aa-ff82-4a71-926c-a3c7726a9692	88f28fd8f86f50221605da42a80b399a301bab565341a0b16e2ffc6111b18419	2025-12-07 10:08:59.216476+00	20251104220039_corrected	\N	\N	2025-12-07 10:08:58.984718+00	1
0da73d57-c252-4ee5-988f-36904fa650dd	44324590d6c2af2075f00fcb4d9304c115532f76cefc67c5420ec6234e97108a	2025-12-07 10:08:59.54292+00	20251105154712_fix_user_composite_key_and_final_ledger	\N	\N	2025-12-07 10:08:59.310284+00	1
6e05de55-c04c-4212-b474-0be19bd5ad6c	25cdf53acc162d502eca3a7b03dddc67d1a8513bc306f38f5db897d8020404d3	2025-12-07 10:08:59.870202+00	20251105175653_feature_stream_finalization_and_enum_status	\N	\N	2025-12-07 10:08:59.634803+00	1
c752c509-6768-43d8-8421-34bbd6fb1608	199bb2ce2d93f9007492483851377afa127eb4ec619b1cfac0c466bc63498f52	2025-12-07 10:09:02.131288+00	20251109145837_add_last_stream_tick_at	\N	\N	2025-12-07 10:09:01.900368+00	1
12a732cc-b1e7-4562-aa59-e37a5339a034	ff167d5323f7c6d01f0925e94857f54c36273a75a09aaefb179bb981edb7e683	2025-12-07 10:09:00.19193+00	20251106150551_add_total_digouts_executed	\N	\N	2025-12-07 10:08:59.962795+00	1
d0ead791-9813-4b0f-96d8-bc5427e32b0d	d5199dd80e8b776502d6274a1d007c2b7361a01b26f12da7c1aa260211c8d2f3	2025-12-07 10:09:00.515634+00	20251106214950_add_total_pushes_executed	\N	\N	2025-12-07 10:09:00.283752+00	1
6077e6b5-ea24-434f-93b5-62a09d354dc4	732a96f9f2705e8eb81e39ac75071b021c513ce66265707c5193aeecd330294b	2025-12-07 10:09:04.074962+00	20251112171923_add_challenges_fields_failed_and_failure_reason	\N	\N	2025-12-07 10:09:03.843527+00	1
59befd24-3003-4966-8167-94ac84c64b8a	e24755cbc200a4cc2f75c58f274c00824d8da7913ecacc119e3986e883d2039e	2025-12-07 10:09:00.83957+00	20251106220052_remove_daily_challenge_count	\N	\N	2025-12-07 10:09:00.607776+00	1
7938d23c-9f57-4b70-8cc5-ca07c897aa17	b647114687bc74a425982d3e07d55cc4021a027469c63dd0eb9fb10c859d9555	2025-12-07 10:09:02.455344+00	20251109150713_rename_last_stream_tick_at_to_timestamp_last_stream_day_ticked	\N	\N	2025-12-07 10:09:02.223915+00	1
899083a4-c1a4-4603-9d76-3a333e475f53	d4d0a6a0f6d50294850faf918030f9141f1f0be6e4d10d5761c1b84e7767e664	2025-12-09 19:23:43.257462+00	20251209192342_add_account_username	\N	\N	2025-12-09 19:23:43.023706+00	1
60dff043-7d07-4289-92b3-2c974a38ccc0	1af6b4f65c8418e7d13e927f2d6828d91866e7fc35a0d28d0ac78923d3ae0691	2025-12-07 10:09:02.777956+00	20251109224533_add_total_caused_by_removals	\N	\N	2025-12-07 10:09:02.548093+00	1
3d4cf91e-228e-4195-9ec7-2df2573155b6	4d38f852a9934dbefbe83a26ec3660b0626cc370ebc72e10839223d6f58ed784	2025-12-07 10:09:04.400677+00	20251117181252_refactor_enum_casing_and_user_platform	\N	\N	2025-12-07 10:09:04.166796+00	1
f381db85-b5e1-4031-bd8e-1ff0051a3a83	05395359e0eb09217e9076ed5681381e9b4de577573e37cfde566a7914ebce18	2025-12-07 10:09:03.104068+00	20251109224838_add_removal_liability_breakdown	\N	\N	2025-12-07 10:09:02.870454+00	1
2dccc111-8ef5-41d4-b1e2-c6fcb198af12	c14ee1fe940dc277bc73687f080aa4b8826980b336695c7fa42085ad7f5fad86	2025-12-07 10:09:03.427357+00	20251110221328_add_challenge_session_fields	\N	\N	2025-12-07 10:09:03.196159+00	1
db243dcb-77c7-4f91-8634-f5416e4cba21	42e024d17af0013c17f85bb5b026f2b135a6d44854f7f43bd6fff8c971a72013	2025-12-07 10:09:37.584074+00	20251207100937_final_user_account_split	\N	\N	2025-12-07 10:09:37.339885+00	1
154e6c6a-35c6-489a-b8ba-b54d9cd615d4	a8255e4a87b5cd192d36fb929da4ceaad8146cb386622bd660efc7c04b31eac8	2025-12-07 10:09:04.72623+00	20251119212320_add_cadence_fields	\N	\N	2025-12-07 10:09:04.492577+00	1
ddccfaf5-14a2-424e-bc22-c856a893edae	9f6221debe44f9f251310c40101b6a6bee28c0324be9c9c761718d3fe7db43ea	2025-12-07 10:09:05.049099+00	20251120153459_add_cadence_required_count	\N	\N	2025-12-07 10:09:04.818149+00	1
b67c0c97-9c27-4287-91ad-f226c7802b74	6d57cd7032d4bac799c79192deec9dea2c59577f74bb64e2eff83e9d3660d9fb	2025-12-07 15:15:06.871914+00	20251207151506_add_challenge_session_tick	\N	\N	2025-12-07 15:15:06.595832+00	1
5899138f-e8f8-457d-9349-3fe386050030	e6dc491bf2f1b3c05dbf5618f71faa349e77198e85201b76ac034d14dce1a0f8	2025-12-07 10:09:05.37493+00	20251207085248_remove_missions_table	\N	\N	2025-12-07 10:09:05.142076+00	1
76c40a85-b615-4d1a-8df6-cb4aaf1eff01	26e8cc4d3e5b8f62004bcc5eb8038be67dcb76a4daee596603fcda675b3675aa	2025-12-12 21:44:03.529355+00	20251212214401_fix_streamstat_id_for_upsert	\N	\N	2025-12-12 21:44:02.207067+00	1
b157ed96-fea8-4ec4-9a6b-e580ebac4b2b	f7d8269b6e5937d739897603482393e95467e0c9e0b558400cb8092557861dab	2025-12-08 22:16:28.515969+00	20251208221628_add_challenge_submission_cost	\N	\N	2025-12-08 22:16:28.282136+00	1
168b1da0-ad26-40dd-b727-a9da865066b6	9de33ca1ccecf0c2974097fd20ad7424e27b23b658b7508bbed5fa34c9b730ba	2025-12-11 22:20:46.684909+00	20251211222044_feature_bigint_ledger_totals	\N	\N	2025-12-11 22:20:45.635169+00	1
fd6ec8e8-4ce1-415d-9dd3-a0ce0325eea6	f383664ac2466d0ba3601ae905dfb9ba039dc998e8b2294f0299cac73e3ea220	2025-12-13 22:19:20.709713+00	20251213221920_challenge_text_to_json	\N	\N	2025-12-13 22:19:20.464417+00	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."users" ("user_id", "last_activity_timestamp", "last_live_activity_timestamp", "last_seen_stream_day", "active_offline_days_count", "active_stream_days_count", "daily_challenge_reset_at", "total_numbers_spent_game_wide", "total_challenges_submitted", "total_numbers_returned_from_removals_game_wide", "total_numbers_spent", "total_received_from_removals", "total_removals_executed", "total_digouts_executed", "totalPushesExecuted", "totalDisruptsExecuted", "daily_submission_count", "total_caused_by_removals", "total_to_community_chest", "total_to_pushers") FROM stdin;
21	2025-12-15 23:08:48.322	\N	0	0	0	2025-12-16 21:00:00	0	10	0	21336	0	0	0	6	1	4	0	0	0
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."accounts" ("account_id", "user_id", "platform_id", "platform_name", "current_balance", "last_balance_update", "last_activity_timestamp", "last_live_activity_timestamp", "username") FROM stdin;
20	21	686071308	KICK	21000000	\N	\N	\N	21xhr
21	21	686071308	TWITCH	99996639	\N	2025-12-16 22:04:37.26	2025-12-09 21:40:20.228	21xhr
\.


--
-- Data for Name: challenges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."challenges" ("challenge_id", "category", "proposer_user_id", "status", "is_executing", "has_been_auctioned", "has_been_digged_out", "auction_cost", "disrupt_count", "numbers_raised", "total_numbers_spent", "total_push", "stream_days_since_activation", "timestamp_submitted", "timestamp_last_activation", "timestamp_completed", "unique_pusher", "push_base_cost", "timestampLastStreamDayTicked", "current_session_count", "session_start_timestamp", "total_sessions", "duration_type", "failure_reason", "cadence_period_start", "cadence_progress_counter", "cadence_unit", "session_cadence_text", "cadence_required_count", "timestamp_last_session_tick", "submission_cost", "challenge_text") FROM stdin;
17	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2025-12-15 19:16:33.044	2025-12-15 19:16:33.044	\N	0	21	2025-12-15 19:16:33.817	0	\N	98	RECURRING	\N	\N	0	WEEKLY	49 sessions per week for 2 weeks	49	\N	210	"qd&lt;sdfwsdfqwsfefzqef"
18	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2025-12-15 19:16:36.106	2025-12-15 19:16:36.106	\N	0	21	2025-12-15 19:16:36.335	0	\N	98	RECURRING	\N	\N	0	WEEKLY	49 sessions per week for 2 weeks	49	\N	840	"qd&lt;sdfwsdfqwsfefzqef"
19	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2025-12-15 19:16:38.275	2025-12-15 19:16:38.275	\N	0	21	2025-12-15 19:16:38.502	0	\N	98	RECURRING	\N	\N	0	WEEKLY	49 sessions per week for 2 weeks	49	\N	1890	"qd&lt;sdfwsdfqwsfefzqef"
20	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2025-12-15 19:16:41.754	2025-12-15 19:16:41.754	\N	0	21	2025-12-15 19:16:42.007	0	\N	98	RECURRING	\N	\N	0	WEEKLY	49 sessions per week for 2 weeks	49	\N	3360	"qd&lt;sdfwsdfqwsfefzqef"
21	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2025-12-15 19:16:46.174	2025-12-15 19:16:46.174	\N	0	21	2025-12-15 19:16:46.449	0	\N	82	RECURRING	\N	\N	0	WEEKLY	41 sessions per week for 2 weeks	41	\N	5250	"qd&lt;sdfwsdfqwsfefzqef"
22	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2025-12-15 22:13:37.685	2025-12-15 22:13:37.685	\N	0	21	2025-12-15 22:13:38.427	0	\N	2	RECURRING	\N	\N	0	DAILY	1 session per day for 2 days	1	\N	210	"s&lt;d&lt;sd&lt;sdc&lt;sdc"
23	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2025-12-15 22:21:32.849	2025-12-15 22:21:32.849	\N	0	21	2025-12-15 22:21:33.86	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	840	"qzsdfqsdfqdfq"
24	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2025-12-15 23:05:27.512	2025-12-15 23:05:27.512	\N	0	21	2025-12-15 23:05:28.198	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	1890	"qzdfqdfsqsdfqf"
25	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2025-12-15 23:08:47.592	2025-12-15 23:08:47.592	\N	0	21	2025-12-15 23:08:48.231	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	3360	"qzdfqdfsqsdfqf"
\.


--
-- Data for Name: pushes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."pushes" ("push_id", "challenge_id", "user_id", "cost", "timestamp", "quantity") FROM stdin;
\.


--
-- Data for Name: stream_stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."stream_stats" ("id", "stream_days_since_inception", "days_since_inception") FROM stdin;
1	1	0
\.


--
-- Data for Name: streams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."streams" ("stream_session_id", "current_stream_number", "start_timestamp", "end_timestamp", "duration_minutes", "total_pushes_in_session", "total_numbers_spent_on_push", "total_digouts_in_session", "total_numbers_spent_on_digout", "total_disrupts_in_session", "total_numbers_spent_on_disrupt", "total_numbers_spent_in_session", "has_been_processed", "total_challenges_submitted_in_session", "total_numbers_returned_from_removals_in_session", "total_removals_in_session") FROM stdin;
1	1	2025-12-15 18:56:44.704	2025-12-15 18:59:01.201	2	0	0	0	0	0	0	0	t	0	0	0
\.


--
-- Data for Name: temp_quotes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."temp_quotes" ("quote_id", "user_id", "challenge_id", "quantity", "quoted_cost", "timestamp_created", "is_locked") FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_analytics" ("name", "type", "format", "created_at", "updated_at", "id", "deleted_at") FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_vectors" ("id", "type", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata", "level") FROM stdin;
\.


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."prefixes" ("bucket_id", "name", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."vector_indexes" ("id", "name", "bucket_id", "data_type", "dimension", "distance_metric", "metadata_configuration", "created_at", "updated_at") FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: accounts_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."accounts_account_id_seq"', 4, true);


--
-- Name: challenges_challenge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."challenges_challenge_id_seq"', 25, true);


--
-- Name: pushes_push_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."pushes_push_id_seq"', 2, true);


--
-- Name: streams_stream_session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."streams_stream_session_id_seq"', 1, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."users_user_id_seq"', 4, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict 9eXhoVSYsVV1FCGX3EyYvXf8JA7pZzsMiIhvpSmCR2nFeJxrmsfIiocOZVEpeEf

RESET ALL;
