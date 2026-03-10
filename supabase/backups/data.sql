SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict xTzjwTald9gV9S2Dqr4UMevgjGuLOczCUguSfWhjMVbcP6Dze1FkxGeb3zzCzE6

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

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at", "invite_token", "referrer", "oauth_client_state_id", "linking_target_id", "email_optional") FROM stdin;
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

COPY "auth"."oauth_clients" ("id", "client_secret_hash", "registration_type", "redirect_uris", "grant_types", "client_name", "client_uri", "logo_uri", "created_at", "updated_at", "deleted_at", "client_type", "token_endpoint_auth_method") FROM stdin;
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
9ce3a770-0831-465c-8a37-df2107ef0043	5d9c31723ecefc935181596a4bd3ccc988b3854279565c2b668ab9c6ce8548b8	2025-12-17 21:54:06.52012+00	20251217215406_add_last_maintenance_at	\N	\N	2025-12-17 21:54:06.283966+00	1
708aa1e2-6920-413b-b0d1-50bd3ad6ee0f	822d1e230d706234da1e00d6407b560e26ef17f717d04e5e65ca09e84a7514ba	2025-12-30 21:57:34.501589+00	20251230215733_add_user_watermarks	\N	\N	2025-12-30 21:57:34.135564+00	1
afccbf26-dc6d-44bf-b97a-0d2e753cd441	6ed63d159c7b3999c98a6c4c5a431297900c7bf665ece8128789b7e4bea5d620	2026-01-26 21:17:17.519627+00	20260126211717_add_last_explorer_deduction	\N	\N	2026-01-26 21:17:17.276953+00	1
4c444378-a434-42de-9da8-c1e4aa6186f8	3f1ba522983e6a7351225dc2062b9a2d4764cad351513b6e5f4a01ad9b4f3996	2026-03-04 17:48:15.543247+00	20260304174815_add_perennial_tokens	\N	\N	2026-03-04 17:48:15.272229+00	1
64cb8f0f-6457-4a9c-80b3-95cb8c875dd7	403b0d8385162a8a3d097d968579b22f1c15d5821217c19d3fa6d9f6c99cb6f6	2026-03-04 21:49:40.323658+00	20260304214939_link_perennial_tokens_to_accounts	\N	\N	2026-03-04 21:49:40.084726+00	1
3870a50f-e3de-4f29-8544-91aab19359ba	1b82d14a83a7424c32d1f72e86e395417032d06bedaef50a24ec8bcd85f9ddc2	2026-03-08 10:30:48.033489+00	20260308103047_add_under_review_status	\N	\N	2026-03-08 10:30:47.794537+00	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."users" ("user_id", "last_activity_timestamp", "last_live_activity_timestamp", "last_seen_stream_day", "active_offline_days_count", "active_stream_days_count", "daily_challenge_reset_at", "total_numbers_spent_game_wide", "total_challenges_submitted", "total_numbers_returned_from_removals_game_wide", "total_numbers_spent", "total_received_from_removals", "total_removals_executed", "total_digouts_executed", "totalPushesExecuted", "totalDisruptsExecuted", "daily_submission_count", "total_caused_by_removals", "total_to_community_chest", "total_to_pushers", "lastProcessedDay", "lastSeenDay", "last_explorer_deduction") FROM stdin;
6	2026-03-07 21:27:41.654	\N	0	0	0	2026-03-08 21:00:00	0	4	0	905348	0	0	0	15	0	4	0	0	0	0	0	\N
7	2026-03-07 21:27:43.831	\N	0	0	0	2026-03-08 21:00:00	0	4	0	197087	0	0	0	2	0	4	0	0	0	0	0	\N
8	2026-03-07 21:27:46.082	\N	0	0	0	2026-03-08 21:00:00	0	4	0	1040904	0	0	0	16	0	4	0	0	0	0	0	\N
9	2026-03-07 21:27:48.512	\N	0	0	0	2026-03-08 21:00:00	0	4	0	150187	0	0	0	1	0	4	0	0	0	0	0	\N
10	2026-03-07 21:27:50.685	\N	0	0	0	2026-03-08 21:00:00	0	4	0	549005	0	0	0	10	0	4	0	0	0	0	0	\N
11	2026-03-07 21:27:52.86	\N	0	0	0	2026-03-08 21:00:00	0	4	0	72374	0	0	0	1	0	4	0	0	0	0	0	\N
13	2026-03-07 21:27:57.208	\N	0	0	0	2026-03-08 21:00:00	0	4	0	211065	0	0	0	2	0	4	0	0	0	0	0	\N
14	2026-03-07 21:27:59.385	\N	0	0	0	2026-03-08 21:00:00	0	4	0	174542	0	0	0	2	0	4	0	0	0	0	0	\N
16	2026-03-07 21:28:03.864	\N	0	0	0	2026-03-08 21:00:00	0	4	0	78104	0	0	0	1	0	4	0	0	0	0	0	\N
17	2026-03-07 21:28:05.504	\N	0	0	0	2026-03-08 21:00:00	0	3	0	129089	0	0	0	1	0	3	0	0	0	0	0	\N
18	\N	\N	0	0	0	2026-03-07 21:27:22.094	0	0	0	7722655	0	0	0	40	0	0	0	0	0	0	0	\N
19	\N	\N	0	0	0	2026-03-07 21:27:22.094	0	0	0	6769096	0	0	0	42	0	0	0	0	0	0	0	\N
12	2026-03-07 21:27:55.037	\N	0	0	0	2026-03-08 21:00:00	0	4	0	6300	0	0	0	0	0	4	0	0	0	0	0	\N
20	\N	\N	0	0	0	2026-03-07 21:27:22.094	0	0	0	9374089	0	0	0	41	0	0	0	0	0	0	0	\N
1	\N	\N	0	0	0	2026-03-07 21:27:22.094	29733803	0	0	0	0	0	0	0	0	0	0	0	0	0	0	\N
21	2026-03-10 18:07:02.285	\N	0	0	0	2026-03-11 21:00:00	0	14	0	54600	0	0	0	0	0	0	0	0	0	0	0	2026-03-10 21:08:44.364
15	2026-03-07 21:28:01.645	\N	0	0	0	2026-03-08 21:00:00	0	4	0	6300	0	0	0	0	0	4	0	0	0	0	0	\N
2	2026-03-07 21:27:32.654	\N	0	0	0	2026-03-08 21:00:00	0	4	0	910239	0	0	0	21	0	4	0	0	0	0	0	\N
3	2026-03-07 21:27:34.865	\N	0	0	0	2026-03-08 21:00:00	0	4	0	78105	0	0	0	1	0	4	0	0	0	0	0	\N
4	2026-03-07 21:27:37.042	\N	0	0	0	2026-03-08 21:00:00	0	4	0	1119240	0	0	0	20	0	4	0	0	0	0	0	\N
5	2026-03-07 21:27:39.241	\N	0	0	0	2026-03-08 21:00:00	0	4	0	185474	0	0	0	2	0	4	0	0	0	0	0	\N
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."accounts" ("account_id", "user_id", "platform_id", "platform_name", "current_balance", "last_balance_update", "last_activity_timestamp", "last_live_activity_timestamp", "username") FROM stdin;
2	21	53255028	KICK	21000000	\N	\N	\N	21xhr
3	21	dTQg5JKFl-YiPzg0UQdqng	YOUTUBE	21000000	\N	\N	\N	21xhr
5	2	linked_youtube_2	YOUTUBE	21000000	\N	\N	\N	Triple_YOUTUBE_2
6	2	linked_kick_2	KICK	21000000	\N	\N	\N	Triple_KICK_2
12	7	linked_kick_7	KICK	21000000	\N	\N	\N	Duo_KICK_7
15	9	linked_twitch_9	TWITCH	21000000	\N	\N	\N	Triple_TWITCH_9
16	9	linked_kick_9	KICK	21000000	\N	\N	\N	Triple_KICK_9
19	11	linked_kick_11	KICK	21000000	\N	\N	\N	Triple_KICK_11
20	11	linked_youtube_11	YOUTUBE	21000000	\N	\N	\N	Triple_YOUTUBE_11
22	12	linked_kick_12	KICK	21000000	\N	\N	\N	Duo_KICK_12
25	14	linked_youtube_14	YOUTUBE	21000000	\N	\N	\N	Duo_YOUTUBE_14
27	15	linked_kick_15	KICK	21000000	\N	\N	\N	Duo_KICK_15
29	16	linked_kick_16	KICK	21000000	\N	\N	\N	Duo_KICK_16
31	18	linked_kick_18	KICK	21000000	\N	\N	\N	Duo_KICK_18
32	18	linked_twitch_18	TWITCH	21000000	\N	\N	\N	Duo_TWITCH_18
33	19	solo_kick_19	KICK	21000000	\N	\N	\N	Solo_KICK_19
34	20	linked_twitch_20	TWITCH	21000000	\N	\N	\N	Triple_TWITCH_20
35	20	linked_youtube_20	YOUTUBE	21000000	\N	\N	\N	Triple_YOUTUBE_20
36	20	linked_kick_20	KICK	21000000	\N	\N	\N	Triple_KICK_20
24	14	linked_kick_14	KICK	99996639	\N	\N	\N	Duo_KICK_14
4	2	linked_twitch_2	TWITCH	99996639	\N	\N	\N	Triple_TWITCH_2
26	15	linked_youtube_15	YOUTUBE	99996639	\N	\N	\N	Duo_YOUTUBE_15
7	3	solo_kick_3	KICK	99996639	\N	\N	\N	Solo_KICK_3
8	4	solo_youtube_4	YOUTUBE	99996639	\N	\N	\N	Solo_YOUTUBE_4
28	16	linked_twitch_16	TWITCH	99996639	\N	\N	\N	Duo_TWITCH_16
9	5	solo_twitch_5	TWITCH	99996639	\N	\N	\N	Solo_TWITCH_5
30	17	solo_twitch_17	TWITCH	99998109	\N	\N	\N	Solo_TWITCH_17
10	6	solo_twitch_6	TWITCH	99996639	\N	\N	\N	Solo_TWITCH_6
11	7	linked_twitch_7	TWITCH	99996639	\N	\N	\N	Duo_TWITCH_7
13	8	solo_twitch_8	TWITCH	99996639	\N	\N	\N	Solo_TWITCH_8
14	9	linked_youtube_9	YOUTUBE	99996639	\N	\N	\N	Triple_YOUTUBE_9
17	10	solo_youtube_10	YOUTUBE	99996639	\N	\N	\N	Solo_YOUTUBE_10
18	11	linked_twitch_11	TWITCH	99996639	\N	\N	\N	Triple_TWITCH_11
21	12	linked_youtube_12	YOUTUBE	99996639	\N	\N	\N	Duo_YOUTUBE_12
23	13	solo_youtube_13	YOUTUBE	99996639	\N	\N	\N	Solo_YOUTUBE_13
1	21	686071308	TWITCH	99986559	\N	2026-03-10 21:08:37.733	\N	21xhr
\.


--
-- Data for Name: challenges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."challenges" ("challenge_id", "category", "proposer_user_id", "status", "is_executing", "has_been_auctioned", "has_been_digged_out", "auction_cost", "disrupt_count", "numbers_raised", "total_numbers_spent", "total_push", "stream_days_since_activation", "timestamp_submitted", "timestamp_last_activation", "timestamp_completed", "unique_pusher", "push_base_cost", "timestampLastStreamDayTicked", "current_session_count", "session_start_timestamp", "total_sessions", "duration_type", "failure_reason", "cadence_period_start", "cadence_progress_counter", "cadence_unit", "session_cadence_text", "cadence_required_count", "timestamp_last_session_tick", "submission_cost", "challenge_text") FROM stdin;
3	General	2	ACTIVE	f	f	f	0	0	0	3792162	34	14	2026-03-07 21:27:32.119	2026-03-07 21:27:32.119	\N	11	21	2026-03-07 21:27:32.336	0	\N	10	RECURRING	\N	\N	0	DAILY	1 session per day for 10 days	1	\N	1890	{"goal": "Solidify your Jazz Swing Feel and Ride placement.", "references": [{"url": "https://en.wikipedia.org/wiki/Elvin_Jones", "type": "musician", "label": "Elvin Jones (Wikipedia)"}, {"url": "https://www.youtube.com/watch?v=PWBn7uuxSgk", "type": "concept", "label": "The Concept of Feathering"}], "constraints": ["Feathered kick drum mandatory", "Brushes or light sticks only"], "instructions": "Play the standard 'spang-a-lang' jazz pattern. Keep the ride cymbal dancing and add occasional light snare comping. Try to 'feather' the bass drum on every quarter note so softly that it is felt rather than heard."}
4	General	2	ACTIVE	f	f	f	0	0	0	4528244	22	19	2026-03-07 21:27:32.654	2026-03-07 21:27:32.654	\N	8	21	2026-03-07 21:27:32.872	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	3360	{"goal": "Double Stroke Roll speed and consistency (32nd notes).", "references": [{"url": "https://example.com/stick-control", "type": "book", "label": "Stick Control (Gladstone Technique)"}, {"url": "https://youtube.com/finger-control-technique", "type": "video"}], "constraints": ["Must maintain 85bpm minimum", "Practice on a practice pad"], "instructions": "This is a stamina drill. Play continuous 32nd note double strokes for 30 seconds, then rest for 30 seconds. Use the 'Finger Control' method for the second stroke of each double. Start at 80bpm and increase by 5bpm every two minutes."}
6	General	3	ACTIVE	f	f	f	0	0	0	919646	4	9	2026-03-07 21:27:33.764	2026-03-07 21:27:33.764	\N	3	21	2026-03-07 21:27:33.98	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	840	{"goal": "Master the foundational 'alphabet' of drumming (N.A.R.D.).", "references": [{"url": "https://nard.us.com/N.A.R.D._Rudiments_files/NARD13Essential.pdf", "type": "other", "label": "Official N.A.R.D. 13 Essential Rudiments PDF"}], "constraints": ["No metronome (Internal clock practice)"], "instructions": "Cycle through the standard rudiments as defined by the National Association of Rudimental Drummers. Focus on 'Open-to-Closed-to-Open' (Slow to Fast to Slow). Pay attention to your stick heights—they should be consistent."}
7	General	3	ACTIVE	f	f	f	0	0	0	865607	9	5	2026-03-07 21:27:34.292	2026-03-07 21:27:34.292	\N	3	21	2026-03-07 21:27:34.511	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	1890	{"goal": "Turn human speech patterns into a drum groove.", "references": [{"url": "https://example.com/podcast-clip-rhythm", "type": "audio"}, {"url": "https://example.com/prosody-percussion", "type": "concept", "label": "Prosody in Percussion"}], "constraints": ["Blindfolded (Focus on ears)", "Snare only"], "instructions": "Listen to a podcast or a speech. Try to mirror the natural rhythm and 'cadence' of the speaker using your snare and toms. Don't worry about pitch, just the 'prosody' of the speech."}
1	General	2	ACTIVE	f	f	f	0	0	0	1675407	23	19	2026-03-07 21:27:29.955	2026-03-07 21:27:29.955	\N	9	21	2026-03-07 21:27:31.012	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	210	{"goal": "Master the Moeller 'whip' technique for effortless power.", "references": [{"url": "https://www.youtube.com/watch?v=Zj3-Lc7UWwg", "type": "video", "label": "Jojo Mayer: Moeller Stroke Lesson"}, {"url": "https://en.wikipedia.org/wiki/Moeller_method", "type": "concept", "label": "Moeller Method (Wikipedia)"}], "constraints": ["No rimshots allowed", "Must use matched grip"], "instructions": "Practice your Moeller strokes using alternating accents. Focus on the whip-like motion of the wrist and let the stick bounce naturally rather than gripping it tight. Your hand should feel like a wet towel being snapped. Focus on staying completely relaxed."}
2	General	2	ACTIVE	f	f	f	0	0	0	6260585	39	16	2026-03-07 21:27:31.589	2026-03-07 21:27:31.589	\N	7	21	2026-03-07 21:27:31.808	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	840	{"goal": "Balance ghost notes and backbeats in a funk pocket.", "references": [{"url": "https://en.wikipedia.org/wiki/Clyde_Stubblefield", "type": "musician", "label": "Clyde Stubblefield (Wikipedia)"}, {"url": "https://open.spotify.com/track/6M6v3Tid69FhO7z3", "type": "song", "label": "The Funky Drummer - James Brown"}], "constraints": ["Metronome set to 90bpm", "No cymbals, hi-hat only"], "instructions": "Play a funk groove where your ghost notes are barely audible 'whispers' on the snare, while your backbeats stay crisp and loud. Use the 'tip' of the stick for ghosts and the 'shoulder' for backbeats. Record yourself to ensure the volume gap is wide enough."}
5	General	3	ACTIVE	f	f	f	0	0	0	5278375	40	1	2026-03-07 21:27:33.186	2026-03-07 21:27:33.186	\N	9	21	2026-03-07 21:27:33.45	0	\N	15	RECURRING	\N	\N	0	DAILY	1 session per day for 15 days	1	\N	210	{"goal": "Clean double-tap kick patterns (Heel-Toe).", "references": [{"url": "https://youtube.com/heel-toe-technique", "type": "video"}, {"url": "https://example.com/lever-action-pedals", "type": "concept", "label": "Lever Action Mechanics"}], "constraints": ["Single pedal only", "Heel-up position"], "instructions": "Focus on the 'snap' of the second stroke using the heel-toe technique. Practice rapid double hits on the kick drum. Make sure both hits in the double sound identical in volume and timing."}
11	General	4	ACTIVE	f	f	f	0	0	0	520382	7	16	2026-03-07 21:27:36.512	2026-03-07 21:27:36.512	\N	3	21	2026-03-07 21:27:36.73	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	1890	{"goal": "Explore non-traditional sounds on your VAD module.", "references": [{"url": "https://youtube.com/roland-vad-sound-design", "type": "video", "label": "Roland VAD Sound Design"}], "constraints": ["Must use at least 1 non-instrumental object"], "instructions": "Switch to an industrial or electronic kit. Incorporate at least one 'found sound' or weird FX from the module into a 4/4 groove. This is inspired by industrial and experimental electronic music."}
9	General	4	ACTIVE	f	f	f	0	0	0	0	0	12	2026-03-07 21:27:35.403	2026-03-07 21:27:35.403	\N	0	21	2026-03-07 21:27:35.665	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	210	{"goal": "Use your drums to 'soundtrack' a silent movie scene.", "references": [{"url": "https://archive.org/silent-films", "type": "video", "label": "Silent Film Archive"}, {"url": "https://example.com/mickey-mousing", "type": "concept", "label": "Concept: Mickey Mousing"}], "constraints": ["No cymbals", "Continuous playing for 5 mins"], "instructions": "Watch an old silent film clip. Match your drumming to the physical movements and slapstick timing of the actors on screen. Use different drums to represent different characters."}
12	General	4	ACTIVE	f	f	f	0	0	0	871942	9	20	2026-03-07 21:27:37.042	2026-03-07 21:27:37.042	\N	5	21	2026-03-07 21:27:37.261	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	3360	{"goal": "Improve coordination by taking one limb away.", "references": [{"url": "https://example.com/limb-independence", "type": "concept"}], "constraints": ["Must maintain consistent hi-hat chick on beats 2 and 4 when not muted"], "instructions": "Play a complex groove, but intentionally 'mute' one limb (like your left foot) for 2 measures every 8, while the others keep going. This builds cognitive independence."}
14	General	5	ACTIVE	f	f	f	0	0	0	335652	3	18	2026-03-07 21:27:38.154	2026-03-07 21:27:38.154	\N	3	21	2026-03-07 21:27:38.387	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	840	{"goal": "Balance your kit volume physically, not through tech.", "references": [{"url": "https://example.com/internal-mixing", "type": "concept"}], "constraints": ["No post-processing allowed"], "instructions": "Turn off all EQ and compression on your module. Balance the volume of your snare versus your cymbals purely through your physical touch. Record and listen back to check the mix."}
15	General	5	ACTIVE	f	f	f	0	0	0	1259062	7	13	2026-03-07 21:27:38.711	2026-03-07 21:27:38.711	\N	3	21	2026-03-07 21:27:38.929	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	1890	{"goal": "Master the legendary half-time shuffle (Purdie Shuffle).", "references": [{"url": "https://youtube.com/purdie-shuffle", "type": "video"}, {"url": "https://open.spotify.com/track/HomeAtLast", "type": "song", "label": "Home At Last - Steely Dan"}], "constraints": ["Must use triplets", "Snare ghost notes required"], "instructions": "Focus on the 'bounce' of the ghost note triplets. It's all about that specific 'lazy' feel that Bernard Purdie is famous for. Listen to 'Home at Last' by Steely Dan for the reference pulse."}
13	General	5	ACTIVE	f	f	f	0	0	0	0	0	2	2026-03-07 21:27:37.574	2026-03-07 21:27:37.574	\N	0	21	2026-03-07 21:27:37.84	0	\N	7	RECURRING	\N	\N	0	DAILY	1 session per day for 7 days	1	\N	210	{"goal": "Play a rock beat against a Latin clave.", "references": [{"url": "https://en.wikipedia.org/wiki/Horacio_Hernandez", "type": "musician", "label": "Horacio Hernandez (Wikipedia)"}, {"url": "https://example.com/clave-patterns", "type": "book", "label": "The Clave Bible"}], "constraints": ["Left foot cowbell required"], "instructions": "Keep a standard 4/4 rock beat with your hands while your left foot keeps a 3-2 son clave going on a cowbell sound. Keep the rock beat heavy and the clave steady."}
32	General	9	ACTIVE	f	f	f	0	0	0	246790	2	3	2026-03-07 21:27:48.512	2026-03-07 21:27:48.512	\N	2	21	2026-03-07 21:27:48.729	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	3360	{"goal": "Practice locking in with a bassist.", "references": [{"url": "https://open.spotify.com/track/flea-bass-line", "type": "song"}], "constraints": ["No extra kick notes allowed"], "instructions": "Find a 'bass only' track. Make sure every single time the bassist hits a note, your kick drum is hitting exactly with them. Do not play any extra kick notes."}
33	General	10	ACTIVE	f	f	f	0	0	0	0	0	15	2026-03-07 21:27:49.042	2026-03-07 21:27:49.042	\N	0	21	2026-03-07 21:27:49.305	0	\N	7	RECURRING	\N	\N	0	DAILY	7 days of precision	7	\N	210	{"goal": "Play with the perfect timing of a machine.", "references": [{"url": "https://example.com/industrial-precision", "type": "concept"}], "constraints": ["Must be perfectly on the grid"], "instructions": "Use a dry, clicky kit. Focus on being so 'on the grid' that your hits perfectly overlap with the metronome. This is the opposite of micro-rhythm—it is pure metronomic precision."}
8	General	3	ACTIVE	f	f	f	0	0	0	1157126	5	8	2026-03-07 21:27:34.865	2026-03-07 21:27:34.865	\N	4	21	2026-03-07 21:27:35.089	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	3360	{"goal": "Groove along to the rhythm of a news anchor.", "references": [{"url": "https://archive.org/broadcast-sample", "type": "audio"}], "constraints": ["Must be a 4/4 time signature"], "instructions": "Turn on a news broadcast. Use the steady, serious rhythm of the anchor's voice as your metronome and build a groove around it. The 'headline' is your snare rhythm, and the 'weather report' is your hi-hat pattern."}
10	General	4	ACTIVE	f	f	f	0	0	0	341708	4	18	2026-03-07 21:27:35.979	2026-03-07 21:27:35.979	\N	3	21	2026-03-07 21:27:36.197	0	\N	4	RECURRING	\N	\N	0	MONTHLY	1 session per month for 4 months	1	\N	840	{"goal": "Improvise a soundtrack to changing natural environments.", "references": [{"url": "https://open.spotify.com/playlist/nature-sounds-reference", "type": "playlist", "label": "Natural Sound Reference Playlist"}], "constraints": ["Use mallets or brushes only", "Minimum 10 minutes per session"], "instructions": "Once a month, select a new nature soundscape (Rainfall, Thunderstorm, Ocean Waves, Forest Wind). Score the environment using appropriate dynamics—soft cymbal washes for rain, heavy toms for thunder."}
18	General	6	ACTIVE	f	f	f	0	0	0	120814	1	11	2026-03-07 21:27:40.586	2026-03-07 21:27:40.586	\N	1	21	2026-03-07 21:27:40.802	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	840	{"goal": "Play patterns where no two notes hit at once (Linear Gadd).", "references": [{"url": "https://youtube.com/gadd-linear", "type": "video"}, {"url": "https://open.spotify.com/track/fifty-ways-leave-lover", "type": "song", "label": "50 Ways to Leave Your Lover - Steve Gadd"}], "constraints": ["No unison hits allowed"], "instructions": "Play patterns where the hands and feet follow each other in a line (no simultaneous hits). Practice the K-R-L-K-R-L-R-L pattern. This creates that 'winding' Steve Gadd sound."}
19	General	6	ACTIVE	f	f	f	0	0	0	0	0	16	2026-03-07 21:27:41.116	2026-03-07 21:27:41.116	\N	0	21	2026-03-07 21:27:41.334	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	1890	{"goal": "Build independence with 3-against-4 polyrhythms.", "references": [{"url": "https://example.com/polyrhythm-math", "type": "concept", "label": "The Math of 4:3"}], "constraints": ["Kick/Snare must stay on the grid"], "instructions": "Play a steady 4/4 pulse on your kick and snare while your hi-hat (or ride) plays in 3/4. Don't let the counts pull each other off beat. This is a classic brain-splitter."}
20	General	6	ACTIVE	f	f	f	0	0	0	0	0	19	2026-03-07 21:27:41.654	2026-03-07 21:27:41.654	\N	0	21	2026-03-07 21:27:41.872	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	3360	{"goal": "Build endurance for high-velocity metal drumming.", "references": [{"url": "https://en.wikipedia.org/wiki/George_Kollias", "type": "musician", "label": "George Kollias (Wikipedia)"}], "constraints": ["Traditional grip for snare hand optional"], "instructions": "Practice fast, alternating hits between your kick and snare. Focus on staying relaxed so you don't tense up and slow down. Start at 120bpm and aim for stability over speed."}
21	General	7	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 21:27:42.185	2026-03-07 21:27:42.185	\N	0	21	2026-03-07 21:27:42.447	0	\N	7	RECURRING	\N	\N	0	DAILY	1 session per day for 7 days	1	\N	210	{"goal": "Master the 'empty' first beat of reggae (One-Drop).", "references": [{"url": "https://en.wikipedia.org/wiki/Carlton_Barrett", "type": "musician", "label": "Carlton Barrett (Wikipedia)"}, {"url": "https://open.spotify.com/track/one-drop-bob-marley", "type": "song", "label": "One Drop - Bob Marley"}], "constraints": ["Kick only on beat 3", "Cross-stick snare only"], "instructions": "In this style, the kick drum only hits on the 3rd beat. Keep the hi-hats eighth notes steady and the rim-click crisp. Use a cross-stick on the snare for that authentic woody sound."}
22	General	7	ACTIVE	f	f	f	0	0	0	0	0	6	2026-03-07 21:27:42.758	2026-03-07 21:27:42.758	\N	0	21	2026-03-07 21:27:42.976	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	840	{"goal": "Keep a steady 'baion' foot pattern (Bossa Nova).", "references": [{"url": "https://open.spotify.com/track/girl-from-ipanema", "type": "song", "label": "The Girl From Ipanema"}], "constraints": ["Consistent ride cymbal mandatory"], "instructions": "Keep your feet playing a constant '1... (and) 2' pattern (dotted 8th, 16th) while your hands play syncopated rim-clicks. It requires perfect timing between feet and hands."}
23	General	7	ACTIVE	f	f	f	0	0	0	0	0	16	2026-03-07 21:27:43.294	2026-03-07 21:27:43.294	\N	0	21	2026-03-07 21:27:43.511	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	1890	{"goal": "Create a 'wall of sound' cinematic swell.", "references": [{"url": "https://example.com/mallet-swells", "type": "concept", "label": "Cymbal Swell Techniques"}], "constraints": ["Mallets only", "Minimum 30s crescendo"], "instructions": "Use soft mallets to create smooth, atmospheric swells on your cymbals. Build the volume from a whisper to a roar gradually. Focus on the 'wash' of the sound."}
30	General	9	ACTIVE	f	f	f	0	0	0	0	0	13	2026-03-07 21:27:47.416	2026-03-07 21:27:47.416	\N	0	21	2026-03-07 21:27:47.634	0	\N	7	RECURRING	\N	\N	0	DAILY	7 days of funk	7	\N	840	{"goal": "Master the 'heavy' funk pocket (Half-Time).", "references": [{"url": "https://en.wikipedia.org/wiki/Questlove", "type": "musician", "label": "Questlove (Wikipedia)"}], "constraints": ["Slightly behind the beat (laid back)"], "instructions": "Play a funk groove but drop the snare backbeat to the '3.' Focus on making it feel deep and groovy. This creates a massive amount of 'air' in the beat."}
31	General	9	ACTIVE	f	f	f	0	0	0	0	0	5	2026-03-07 21:27:47.98	2026-03-07 21:27:47.98	\N	0	21	2026-03-07 21:27:48.2	0	\N	21	RECURRING	\N	\N	0	DAILY	21 days of double kick	21	\N	1890	{"goal": "Build sprinting speed with your feet.", "references": [{"url": "https://example.com/muscle-fatigue-management", "type": "concept"}], "constraints": ["Must maintain for 60 seconds without stopping"], "instructions": "Set a timer for 1 minute and play steady 16th notes on the double kick. Focus on keeping both feet sounding identical. If you break rhythm, stop and restart."}
16	General	5	ACTIVE	f	f	f	0	0	0	1309199	5	0	2026-03-07 21:27:39.241	2026-03-07 21:27:39.241	\N	4	21	2026-03-07 21:27:39.46	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	3360	{"goal": "Make 7/8 feel as natural as 4/4.", "references": [{"url": "https://open.spotify.com/track/money-pink-floyd", "type": "song", "label": "Money - Pink Floyd"}], "constraints": ["No metronome for the final 5 minutes"], "instructions": "Cycle a 7/8 groove (counting it as 2+2+3). Try to make it feel smooth enough that someone could dance to it. Avoid it feeling 'jagged.'"}
17	General	6	ACTIVE	f	f	f	0	0	0	99062	4	16	2026-03-07 21:27:39.919	2026-03-07 21:27:39.919	\N	1	21	2026-03-07 21:27:40.271	0	\N	10	RECURRING	\N	\N	0	DAILY	1 session per day for 10 days	1	\N	210	{"goal": "Make brush sweeps work on electronic drums.", "references": [{"url": "https://en.wikipedia.org/wiki/Jeff_Hamilton_(drummer)", "type": "musician", "label": "Jeff Hamilton (Wikipedia)"}], "constraints": ["Brushes only", "Tempo under 60bpm"], "instructions": "Use the brush-specific settings on your module. Practice the sweeping motions and 'swirls' used in jazz ballads. Ensure the sensitivity is set correctly to pick up the friction."}
24	General	7	ACTIVE	f	f	f	0	0	0	0	0	15	2026-03-07 21:27:43.831	2026-03-07 21:27:43.831	\N	0	21	2026-03-07 21:27:44.049	0	\N	10	RECURRING	\N	\N	0	DAILY	1 session per day for 10 days	1	\N	3360	{"goal": "Master the powerful R-L-K triplet pattern (Bonham).", "references": [{"url": "https://en.wikipedia.org/wiki/John_Bonham", "type": "musician", "label": "John Bonham (Wikipedia)"}, {"url": "https://youtube.com/bonham-triplets", "type": "video"}], "constraints": ["Must maintain consistent volume across hands and feet"], "instructions": "Practice the 'galloping' triplet (Right Hand, Left Hand, Kick). Focus on power and making the transition from hands to feet seamless. Speed it up until it sounds like a single instrument."}
25	General	8	ACTIVE	f	f	f	0	0	0	0	0	13	2026-03-07 21:27:44.361	2026-03-07 21:27:44.361	\N	0	21	2026-03-07 21:27:44.624	0	\N	5	RECURRING	\N	\N	0	DAILY	1 session per day for 5 days	1	\N	210	{"goal": "Test your timing by shifting the 'click'.", "references": [{"url": "https://example.com/internal-clock-theory", "type": "concept"}], "constraints": ["Start at 60bpm", "Record and check if you 'flipped' back"], "instructions": "Set your metronome to a steady pulse, but treat the click as the 'and' (the upbeat). Your goal is to keep a groove where your main beats land in the silences. This will feel like the metronome is fighting you."}
26	General	8	ACTIVE	f	f	f	0	0	0	0	0	1	2026-03-07 21:27:44.977	2026-03-07 21:27:44.977	\N	0	21	2026-03-07 21:27:45.194	0	\N	10	RECURRING	\N	\N	0	DAILY	10 days of hats	10	\N	840	{"goal": "Master the fast hi-hat 'zips' (Trap Rolls).", "references": [{"url": "https://open.spotify.com/playlist/trap-drums-reference", "type": "song", "label": "Trap Drums Reference"}], "constraints": ["Single hand for hi-hat only"], "instructions": "Practice 16th and 32nd note triplets on the hi-hat using one hand. Use your fingers to get that rapid-fire speed. Incorporate bursts and rolls found in trap music."}
27	General	8	ACTIVE	f	f	f	0	0	0	0	0	2	2026-03-07 21:27:45.51	2026-03-07 21:27:45.51	\N	0	21	2026-03-07 21:27:45.77	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	1890	{"goal": "Build a catchy groove without using snare or cymbals.", "references": [{"url": "https://youtube.com/tribal-tom-grooves", "type": "video", "label": "Tribal Drumming Concepts"}], "constraints": ["Absolutely no snare drum", "No cymbals"], "instructions": "Switch to a tom-heavy kit. You aren't allowed to use the snare—create the entire groove using just the toms and the kick. Use the toms as melodic voices."}
28	General	8	ACTIVE	f	f	f	0	0	0	0	0	10	2026-03-07 21:27:46.082	2026-03-07 21:27:46.082	\N	0	21	2026-03-07 21:27:46.343	0	\N	12	RECURRING	\N	\N	0	WEEKLY	3 sessions per week for 4 weeks	3	\N	3360	{"goal": "Fluidly blend visual flair with consistent timing.", "references": [{"url": "https://www.youtube.com/watch?v=MkK8qACn6xs", "type": "video", "label": "7 Favorite Drum Stick Tricks"}], "constraints": ["Must maintain consistent 2/4 backbeat"], "instructions": "Practice backsticking, twirls, or crossovers while maintaining a simple 2 and 4 backbeat. The trick must not interrupt the groove or tempo. Rotate through different tricks each session."}
29	General	9	ACTIVE	f	f	f	0	0	0	0	0	18	2026-03-07 21:27:46.662	2026-03-07 21:27:46.662	\N	0	21	2026-03-07 21:27:46.926	0	\N	14	RECURRING	\N	\N	0	DAILY	14 days of fills	14	\N	210	{"goal": "Use the R-L-R-R-L-L rudiment in a drum fill.", "references": [{"url": "https://example.com/paradiddle-diddle-notation", "type": "other"}], "constraints": ["Focus on even stick heights"], "instructions": "Practice the paradiddle-diddle moving across the toms. It’s a great way to move quickly without crossing your arms. Focus on even stick heights and making it sound fluid."}
34	General	10	ACTIVE	f	f	f	0	0	0	0	0	11	2026-03-07 21:27:49.624	2026-03-07 21:27:49.624	\N	0	21	2026-03-07 21:27:49.84	0	\N	14	RECURRING	\N	\N	0	DAILY	14 days of control	14	\N	840	{"goal": "Maintain energy and speed at a tiny volume (Whisper Metal).", "references": [{"url": "https://example.com/pianissimo-control", "type": "concept"}], "constraints": ["Sticks must not rise above 2 inches"], "instructions": "Play an aggressive heavy metal groove (blasts, double kick) as quietly as possible. Maintain the speed, but keep the volume at a 'whisper.' This forces efficiency of motion."}
35	General	10	ACTIVE	f	f	f	0	0	0	0	0	2	2026-03-07 21:27:50.153	2026-03-07 21:27:50.153	\N	0	21	2026-03-07 21:27:50.372	0	\N	8	RECURRING	\N	\N	0	CUSTOM_DAYS	2 sessions every 3 days then repeat this 4 times.	2	\N	1890	{"goal": "Build the habit of non-stop creative play.", "references": [{"url": "https://example.com/flow-state-guided-meditation", "type": "audio"}], "constraints": ["No stopping, no metronome"], "instructions": "Play for 21 minutes without stopping. Don't judge what you play; just keep the flow moving. If you run out of ideas, play a simple beat until a new idea comes."}
36	General	10	ACTIVE	f	f	f	0	0	0	0	0	1	2026-03-07 21:27:50.685	2026-03-07 21:27:50.685	\N	0	21	2026-03-07 21:27:50.903	0	\N	7	RECURRING	\N	\N	0	DAILY	7 days of ghost notes	7	\N	3360	{"goal": "Add busy-ness to a beat using quiet taps (Syncopation).", "references": [{"url": "https://youtube.com/ghost-note-masterclass", "type": "video"}], "constraints": ["Main backbeat must stay consistent"], "instructions": "Play a 16th note linear pattern where the snare ghost notes only occur on the 'e' and 'a' of the beat. This creates a complex, rolling texture."}
37	General	11	ACTIVE	f	f	f	0	0	0	0	0	9	2026-03-07 21:27:51.216	2026-03-07 21:27:51.216	\N	0	21	2026-03-07 21:27:51.478	0	\N	21	RECURRING	\N	\N	0	DAILY	21 days of sprints	21	\N	210	{"goal": "Practice quick foot sprints for metal (Double Kick).", "references": [{"url": "https://example.com/fast-twitch-activation", "type": "concept"}], "constraints": ["Maximum speed during bursts"], "instructions": "Play 5-second bursts of maximum speed 16th notes on the kick, then 5 seconds of rest. Repeat for the session. This builds 'fast twitch' muscle response."}
38	General	11	ACTIVE	f	f	f	0	0	0	0	0	18	2026-03-07 21:27:51.791	2026-03-07 21:27:51.791	\N	0	21	2026-03-07 21:27:52.009	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	840	{"goal": "Match the 'length' of the notes with a bassist.", "references": [{"url": "https://example.com/musical-sustain", "type": "concept"}], "constraints": ["Must use at least 2 different types of cymbal sustain"], "instructions": "Listen to a bass track. Short bass notes = short kick drum hits. Long bass notes = open cymbal hits. You are mimicking the 'sustain' of a melodic instrument."}
39	General	11	ACTIVE	f	f	f	0	0	0	0	0	2	2026-03-07 21:27:52.326	2026-03-07 21:27:52.326	\N	0	21	2026-03-07 21:27:52.547	0	\N	7	RECURRING	\N	\N	0	DAILY	7 days of unison	7	\N	1890	{"goal": "Make your hands and feet sound like one engine.", "references": [{"url": "https://example.com/vertical-alignment", "type": "concept"}], "constraints": ["Record and listen for unison accuracy"], "instructions": "Focus on the 'unison' of your hits. Your kick and snare should hit at the exact same time so they sound like one powerful instrument. Eliminate all 'flams' between limbs."}
40	General	11	ACTIVE	f	f	f	0	0	0	0	0	9	2026-03-07 21:27:52.86	2026-03-07 21:27:52.86	\N	0	21	2026-03-07 21:27:53.078	0	\N	14	RECURRING	\N	\N	0	DAILY	14 days of stealth speed	14	\N	3360	{"goal": "Build speed using fingers by limiting stick height.", "references": [{"url": "https://en.wikipedia.org/wiki/Derek_Roddy", "type": "musician", "label": "Derek Redy (Wikipedia)"}], "constraints": ["No arm movement allowed"], "instructions": "Play a fast metal groove but don't let your sticks go more than an inch off the drum. This relies entirely on finger control and wrist snap rather than arm movement."}
41	General	12	ACTIVE	f	f	f	0	0	0	0	0	18	2026-03-07 21:27:53.392	2026-03-07 21:27:53.392	\N	0	21	2026-03-07 21:27:53.655	0	\N	12	RECURRING	\N	\N	0	WEEKLY	3 sessions per week for 4 weeks	3	\N	210	{"goal": "Master high-tempo breakbeats and smooth ghost notes.", "references": [{"url": "https://open.spotify.com/track/amen-break-original", "type": "song", "label": "The Amen Break"}, {"url": "https://example.com/dnb-mechanics", "type": "concept", "label": "D&B Breakbeat Mechanics"}], "constraints": ["Tempo must stay above 165bpm"], "instructions": "Progress from the foundational 'Amen Break' to atmospheric, flowing grooves with snare hits that 'dance' around the main beat. Aim for high speed (175bpm+) endurance."}
42	General	12	ACTIVE	f	f	f	0	0	0	0	0	11	2026-03-07 21:27:53.97	2026-03-07 21:27:53.97	\N	0	21	2026-03-07 21:27:54.189	0	\N	7	RECURRING	\N	\N	0	DAILY	7 days	7	\N	840	{"goal": "Mastering Micro-Timing and Rhythmic Nuance.", "references": [{"url": "https://www.confidentdrummer.com/what-are-micro-rhythms-and-micro-timing-and-why-they-matter", "type": "concept", "label": "Article: What Are Micro-Rhythms and Micro-Timing?"}, {"url": "https://www.youtube.com/@LofiGirl", "type": "video", "label": "Lofi Girl", "details": "Modern Micro-Timing Examples"}, {"url": "https://en.wikipedia.org/wiki/J_Dilla", "type": "musician", "label": "J Dilla"}], "constraints": ["Use a high-pitch cowbell click for Phase 1", "Record sessions and compare the 'offset' of each hit"], "instructions": "Go beyond the rigid grid of western notation by exploring micro-rhythms—intentional deviations and subtleties that notation cannot accurately represent. \\n\\n- **Phase 1 (Sessions 1-3)**: Develop 'The Grid vs. The Feel'. Practice playing 'behind' and 'ahead' of a high-pitched cowbell click. Focus on the consistent space between the click and your strike. \\n- **Phase 2 (Sessions 4-6)**: Study the 'Unquantized Swing'. Play along to classic tracks by J Dilla or D'Angelo (e.g., 'Untitled'). Focus on the 'late' snare and 'drunken' kick placement that creates a human pocket. \\n- **Phase 3 (Session 7)**: Modern Lofi Application. Drum along to a lofi hip-hop stream. Incorporate everything learned to create a laid-back, personal 'feel' that flows with the unquantized samples."}
43	General	12	ARCHIVED	f	f	f	0	0	0	0	0	1	2026-03-07 21:27:54.505	2026-03-07 21:27:54.505	\N	0	21	2026-03-07 21:27:54.723	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	1890	{"goal": "[DIVERSIFIED] Master the Moeller 'whip' technique for effortless power.", "references": [{"url": "https://www.youtube.com/watch?v=Zj3-Lc7UWwg", "type": "video", "label": "Jojo Mayer: Moeller Stroke Lesson"}, {"url": "https://en.wikipedia.org/wiki/Moeller_method", "type": "concept", "label": "Moeller Method (Wikipedia)"}], "constraints": ["No rimshots allowed", "Must use matched grip"], "instructions": "Practice your Moeller strokes using alternating accents. Focus on the whip-like motion of the wrist and let the stick bounce naturally rather than gripping it tight. Your hand should feel like a wet towel being snapped. Focus on staying completely relaxed."}
44	General	12	COMPLETED	f	f	f	0	0	0	0	0	20	2026-03-07 21:27:55.037	2026-03-07 21:27:55.037	2026-03-07 21:27:55.522	0	21	2026-03-07 21:27:55.254	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	3360	{"goal": "[DIVERSIFIED] Balance ghost notes and backbeats in a funk pocket.", "references": [{"url": "https://en.wikipedia.org/wiki/Clyde_Stubblefield", "type": "musician", "label": "Clyde Stubblefield (Wikipedia)"}, {"url": "https://open.spotify.com/track/6M6v3Tid69FhO7z3", "type": "song", "label": "The Funky Drummer - James Brown"}], "constraints": ["Metronome set to 90bpm", "No cymbals, hi-hat only"], "instructions": "Play a funk groove where your ghost notes are barely audible 'whispers' on the snare, while your backbeats stay crisp and loud. Use the 'tip' of the stick for ghosts and the 'shoulder' for backbeats. Record yourself to ensure the volume gap is wide enough."}
45	General	13	ARCHIVED	f	f	f	0	0	0	0	0	16	2026-03-07 21:27:55.572	2026-03-07 21:27:55.572	\N	0	21	2026-03-07 21:27:55.837	0	\N	10	RECURRING	\N	\N	0	DAILY	1 session per day for 10 days	1	\N	210	{"goal": "[DIVERSIFIED] Solidify your Jazz Swing Feel and Ride placement.", "references": [{"url": "https://en.wikipedia.org/wiki/Elvin_Jones", "type": "musician", "label": "Elvin Jones (Wikipedia)"}, {"url": "https://www.youtube.com/watch?v=PWBn7uuxSgk", "type": "concept", "label": "The Concept of Feathering"}], "constraints": ["Feathered kick drum mandatory", "Brushes or light sticks only"], "instructions": "Play the standard 'spang-a-lang' jazz pattern. Keep the ride cymbal dancing and add occasional light snare comping. Try to 'feather' the bass drum on every quarter note so softly that it is felt rather than heard."}
46	General	13	COMPLETED	f	f	f	0	0	0	0	0	17	2026-03-07 21:27:56.148	2026-03-07 21:27:56.148	2026-03-07 21:27:56.633	0	21	2026-03-07 21:27:56.366	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	840	{"goal": "[DIVERSIFIED] Double Stroke Roll speed and consistency (32nd notes).", "references": [{"url": "https://example.com/stick-control", "type": "book", "label": "Stick Control (Gladstone Technique)"}, {"url": "https://youtube.com/finger-control-technique", "type": "video"}], "constraints": ["Must maintain 85bpm minimum", "Practice on a practice pad"], "instructions": "This is a stamina drill. Play continuous 32nd note double strokes for 30 seconds, then rest for 30 seconds. Use the 'Finger Control' method for the second stroke of each double. Start at 80bpm and increase by 5bpm every two minutes."}
47	General	13	IN_PROGRESS	f	f	f	0	0	0	0	0	12	2026-03-07 21:27:56.679	2026-03-07 21:27:56.679	\N	0	21	2026-03-07 21:27:56.893	0	\N	15	RECURRING	\N	\N	0	DAILY	1 session per day for 15 days	1	\N	1890	{"goal": "[DIVERSIFIED] Clean double-tap kick patterns (Heel-Toe).", "references": [{"url": "https://youtube.com/heel-toe-technique", "type": "video"}, {"url": "https://example.com/lever-action-pedals", "type": "concept", "label": "Lever Action Mechanics"}], "constraints": ["Single pedal only", "Heel-up position"], "instructions": "Focus on the 'snap' of the second stroke using the heel-toe technique. Practice rapid double hits on the kick drum. Make sure both hits in the double sound identical in volume and timing."}
48	General	13	ARCHIVED	f	f	f	0	0	0	0	0	4	2026-03-07 21:27:57.208	2026-03-07 21:27:57.208	\N	0	21	2026-03-07 21:27:57.428	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	3360	{"goal": "[DIVERSIFIED] Master the foundational 'alphabet' of drumming (N.A.R.D.).", "references": [{"url": "https://nard.us.com/N.A.R.D._Rudiments_files/NARD13Essential.pdf", "type": "other", "label": "Official N.A.R.D. 13 Essential Rudiments PDF"}], "constraints": ["No metronome (Internal clock practice)"], "instructions": "Cycle through the standard rudiments as defined by the National Association of Rudimental Drummers. Focus on 'Open-to-Closed-to-Open' (Slow to Fast to Slow). Pay attention to your stick heights—they should be consistent."}
49	General	14	COMPLETED	f	f	f	0	0	0	0	0	9	2026-03-07 21:27:57.748	2026-03-07 21:27:57.748	2026-03-07 21:27:58.277	0	21	2026-03-07 21:27:58.01	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	210	{"goal": "[DIVERSIFIED] Turn human speech patterns into a drum groove.", "references": [{"url": "https://example.com/podcast-clip-rhythm", "type": "audio"}, {"url": "https://example.com/prosody-percussion", "type": "concept", "label": "Prosody in Percussion"}], "constraints": ["Blindfolded (Focus on ears)", "Snare only"], "instructions": "Listen to a podcast or a speech. Try to mirror the natural rhythm and 'cadence' of the speaker using your snare and toms. Don't worry about pitch, just the 'prosody' of the speech."}
50	General	14	ARCHIVED	f	f	f	0	0	0	0	0	17	2026-03-07 21:27:58.322	2026-03-07 21:27:58.322	\N	0	21	2026-03-07 21:27:58.54	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	840	{"goal": "[DIVERSIFIED] Groove along to the rhythm of a news anchor.", "references": [{"url": "https://archive.org/broadcast-sample", "type": "audio"}], "constraints": ["Must be a 4/4 time signature"], "instructions": "Turn on a news broadcast. Use the steady, serious rhythm of the anchor's voice as your metronome and build a groove around it. The 'headline' is your snare rhythm, and the 'weather report' is your hi-hat pattern."}
51	General	14	COMPLETED	f	f	f	0	0	0	0	0	10	2026-03-07 21:27:58.852	2026-03-07 21:27:58.852	2026-03-07 21:27:59.337	0	21	2026-03-07 21:27:59.07	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	1890	{"goal": "[DIVERSIFIED] Use your drums to 'soundtrack' a silent movie scene.", "references": [{"url": "https://archive.org/silent-films", "type": "video", "label": "Silent Film Archive"}, {"url": "https://example.com/mickey-mousing", "type": "concept", "label": "Concept: Mickey Mousing"}], "constraints": ["No cymbals", "Continuous playing for 5 mins"], "instructions": "Watch an old silent film clip. Match your drumming to the physical movements and slapstick timing of the actors on screen. Use different drums to represent different characters."}
52	General	14	COMPLETED	f	f	f	0	0	0	0	0	12	2026-03-07 21:27:59.385	2026-03-07 21:27:59.385	2026-03-07 21:27:59.872	0	21	2026-03-07 21:27:59.607	0	\N	4	RECURRING	\N	\N	0	MONTHLY	1 session per month for 4 months	1	\N	3360	{"goal": "[DIVERSIFIED] Improvise a soundtrack to changing natural environments.", "references": [{"url": "https://open.spotify.com/playlist/nature-sounds-reference", "type": "playlist", "label": "Natural Sound Reference Playlist"}], "constraints": ["Use mallets or brushes only", "Minimum 10 minutes per session"], "instructions": "Once a month, select a new nature soundscape (Rainfall, Thunderstorm, Ocean Waves, Forest Wind). Score the environment using appropriate dynamics—soft cymbal washes for rain, heavy toms for thunder."}
53	General	15	COMPLETED	f	f	f	0	0	0	0	0	11	2026-03-07 21:27:59.918	2026-03-07 21:27:59.918	2026-03-07 21:28:00.45	0	21	2026-03-07 21:28:00.18	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	210	{"goal": "[DIVERSIFIED] Explore non-traditional sounds on your VAD module.", "references": [{"url": "https://youtube.com/roland-vad-sound-design", "type": "video", "label": "Roland VAD Sound Design"}], "constraints": ["Must use at least 1 non-instrumental object"], "instructions": "Switch to an industrial or electronic kit. Incorporate at least one 'found sound' or weird FX from the module into a 4/4 groove. This is inspired by industrial and experimental electronic music."}
54	General	15	IN_PROGRESS	f	f	f	0	0	0	0	0	3	2026-03-07 21:28:00.54	2026-03-07 21:28:00.54	\N	0	21	2026-03-07 21:28:00.757	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	840	{"goal": "[DIVERSIFIED] Improve coordination by taking one limb away.", "references": [{"url": "https://example.com/limb-independence", "type": "concept"}], "constraints": ["Must maintain consistent hi-hat chick on beats 2 and 4 when not muted"], "instructions": "Play a complex groove, but intentionally 'mute' one limb (like your left foot) for 2 measures every 8, while the others keep going. This builds cognitive independence."}
55	General	15	FAILED	f	f	f	0	0	0	0	0	6	2026-03-07 21:28:01.07	2026-03-07 21:28:01.07	\N	0	21	2026-03-07 21:28:01.332	0	\N	7	RECURRING	\N	\N	0	DAILY	1 session per day for 7 days	1	\N	1890	{"goal": "[DIVERSIFIED] Play a rock beat against a Latin clave.", "references": [{"url": "https://en.wikipedia.org/wiki/Horacio_Hernandez", "type": "musician", "label": "Horacio Hernandez (Wikipedia)"}, {"url": "https://example.com/clave-patterns", "type": "book", "label": "The Clave Bible"}], "constraints": ["Left foot cowbell required"], "instructions": "Keep a standard 4/4 rock beat with your hands while your left foot keeps a 3-2 son clave going on a cowbell sound. Keep the rock beat heavy and the clave steady."}
56	General	15	IN_PROGRESS	f	f	f	0	0	0	0	0	19	2026-03-07 21:28:01.645	2026-03-07 21:28:01.645	\N	0	21	2026-03-07 21:28:01.905	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	3360	{"goal": "[DIVERSIFIED] Balance your kit volume physically, not through tech.", "references": [{"url": "https://example.com/internal-mixing", "type": "concept"}], "constraints": ["No post-processing allowed"], "instructions": "Turn off all EQ and compression on your module. Balance the volume of your snare versus your cymbals purely through your physical touch. Record and listen back to check the mix."}
57	General	16	ARCHIVED	f	f	f	0	0	0	0	0	14	2026-03-07 21:28:02.221	2026-03-07 21:28:02.221	\N	0	21	2026-03-07 21:28:02.484	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	210	{"goal": "[DIVERSIFIED] Master the legendary half-time shuffle (Purdie Shuffle).", "references": [{"url": "https://youtube.com/purdie-shuffle", "type": "video"}, {"url": "https://open.spotify.com/track/HomeAtLast", "type": "song", "label": "Home At Last - Steely Dan"}], "constraints": ["Must use triplets", "Snare ghost notes required"], "instructions": "Focus on the 'bounce' of the ghost note triplets. It's all about that specific 'lazy' feel that Bernard Purdie is famous for. Listen to 'Home at Last' by Steely Dan for the reference pulse."}
58	General	16	IN_PROGRESS	f	f	f	0	0	0	0	0	2	2026-03-07 21:28:02.799	2026-03-07 21:28:02.799	\N	0	21	2026-03-07 21:28:03.017	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	840	{"goal": "[DIVERSIFIED] Make 7/8 feel as natural as 4/4.", "references": [{"url": "https://open.spotify.com/track/money-pink-floyd", "type": "song", "label": "Money - Pink Floyd"}], "constraints": ["No metronome for the final 5 minutes"], "instructions": "Cycle a 7/8 groove (counting it as 2+2+3). Try to make it feel smooth enough that someone could dance to it. Avoid it feeling 'jagged.'"}
59	General	16	FAILED	f	f	f	0	0	0	0	0	10	2026-03-07 21:28:03.328	2026-03-07 21:28:03.328	\N	0	21	2026-03-07 21:28:03.549	0	\N	10	RECURRING	\N	\N	0	DAILY	1 session per day for 10 days	1	\N	1890	{"goal": "[DIVERSIFIED] Make brush sweeps work on electronic drums.", "references": [{"url": "https://en.wikipedia.org/wiki/Jeff_Hamilton_(drummer)", "type": "musician", "label": "Jeff Hamilton (Wikipedia)"}], "constraints": ["Brushes only", "Tempo under 60bpm"], "instructions": "Use the brush-specific settings on your module. Practice the sweeping motions and 'swirls' used in jazz ballads. Ensure the sensitivity is set correctly to pick up the friction."}
60	General	16	FAILED	f	f	f	0	0	0	0	0	8	2026-03-07 21:28:03.864	2026-03-07 21:28:03.864	\N	0	21	2026-03-07 21:28:04.084	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	3360	{"goal": "[DIVERSIFIED] Play patterns where no two notes hit at once (Linear Gadd).", "references": [{"url": "https://youtube.com/gadd-linear", "type": "video"}, {"url": "https://open.spotify.com/track/fifty-ways-leave-lover", "type": "song", "label": "50 Ways to Leave Your Lover - Steve Gadd"}], "constraints": ["No unison hits allowed"], "instructions": "Play patterns where the hands and feet follow each other in a line (no simultaneous hits). Practice the K-R-L-K-R-L-R-L pattern. This creates that 'winding' Steve Gadd sound."}
61	General	17	FAILED	f	f	f	0	0	0	0	0	17	2026-03-07 21:28:04.403	2026-03-07 21:28:04.403	\N	0	21	2026-03-07 21:28:04.665	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	210	{"goal": "[DIVERSIFIED] Build independence with 3-against-4 polyrhythms.", "references": [{"url": "https://example.com/polyrhythm-math", "type": "concept", "label": "The Math of 4:3"}], "constraints": ["Kick/Snare must stay on the grid"], "instructions": "Play a steady 4/4 pulse on your kick and snare while your hi-hat (or ride) plays in 3/4. Don't let the counts pull each other off beat. This is a classic brain-splitter."}
62	General	17	ARCHIVED	f	f	f	0	0	0	0	0	7	2026-03-07 21:28:04.977	2026-03-07 21:28:04.977	\N	0	21	2026-03-07 21:28:05.192	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	840	{"goal": "[DIVERSIFIED] Build endurance for high-velocity metal drumming.", "references": [{"url": "https://en.wikipedia.org/wiki/George_Kollias", "type": "musician", "label": "George Kollias (Wikipedia)"}], "constraints": ["Traditional grip for snare hand optional"], "instructions": "Practice fast, alternating hits between your kick and snare. Focus on staying relaxed so you don't tense up and slow down. Start at 120bpm and aim for stability over speed."}
63	General	17	COMPLETED	f	f	f	0	0	0	0	0	14	2026-03-07 21:28:05.504	2026-03-07 21:28:05.504	2026-03-07 21:28:06.358	0	21	2026-03-07 21:28:05.718	0	\N	7	RECURRING	\N	\N	0	DAILY	1 session per day for 7 days	1	\N	1890	{"goal": "[DIVERSIFIED] Master the 'empty' first beat of reggae (One-Drop).", "references": [{"url": "https://en.wikipedia.org/wiki/Carlton_Barrett", "type": "musician", "label": "Carlton Barrett (Wikipedia)"}, {"url": "https://open.spotify.com/track/one-drop-bob-marley", "type": "song", "label": "One Drop - Bob Marley"}], "constraints": ["Kick only on beat 3", "Cross-stick snare only"], "instructions": "In this style, the kick drum only hits on the 3rd beat. Keep the hi-hats eighth notes steady and the rim-click crisp. Use a cross-stick on the snare for that authentic woody sound."}
64	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-08 17:33:04.685	2026-03-08 17:33:04.685	\N	0	21	2026-03-08 17:33:04.947	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	210	{"goal": "Ø", "system": {"version": "2.1", "requiresReview": false}, "references": [{"url": "https://www.youtube.com/@21xhr", "type": "VIDEO", "label": "Video Label", "details": "", "isTrusted": true}], "constraints": ["Ø"], "instructions": "ØØØØØØØØØ"}
65	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-08 21:25:23.479	2026-03-08 21:25:23.479	\N	0	21	2026-03-08 21:25:23.782	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	210	{"goal": "Core Goal", "system": {"version": "2.1", "requiresReview": false}, "references": [], "constraints": ["constraints 1"], "instructions": "Instructions"}
66	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-08 21:42:20.846	2026-03-08 21:42:20.846	\N	0	21	2026-03-08 21:42:21.068	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	840	{"goal": "qsd", "system": {"version": "2.1", "requiresReview": false}, "references": [], "constraints": [], "instructions": "qsdqsdqsd"}
67	General	21	UNDER_REVIEW	f	f	f	0	0	0	0	0	0	2026-03-08 21:43:18.726	2026-03-08 21:43:18.726	\N	0	21	2026-03-08 21:43:18.985	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	1890	{"goal": "", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "type": "VIDEO", "label": "", "details": "", "isTrusted": false}, {"url": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "type": "VIDEO", "label": "", "details": "", "isTrusted": false}, {"url": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "type": "VIDEO", "label": "", "details": "", "isTrusted": false}], "constraints": ["sdc"], "instructions": ""}
68	General	21	UNDER_REVIEW	f	f	f	0	0	0	0	0	0	2026-03-08 22:01:43.677	2026-03-08 22:01:43.677	\N	0	21	2026-03-08 22:01:43.936	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	3360	{"goal": "", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "type": "VIDEO", "label": "", "details": "", "isTrusted": false}, {"url": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "type": "VIDEO", "label": "", "details": "", "isTrusted": false}], "constraints": ["qsccqsc"], "instructions": "wsvsvwsvwsvwv"}
69	General	21	UNDER_REVIEW	f	f	f	0	0	0	0	0	0	2026-03-08 22:33:59.185	2026-03-08 22:33:59.185	\N	0	21	2026-03-08 22:33:59.773	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	5250	{"goal": "qsdqsqsdq", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://translate.google.com/details?sl=fr&tl=en&text=efface%20l%27url&op=translate", "type": "VIDEO", "label": "", "details": "", "isTrusted": false}, {"url": null, "type": "VIDEO", "label": "", "details": "", "isTrusted": true}, {"url": null, "type": "WIKI", "label": "", "details": "", "isTrusted": true}], "constraints": [], "instructions": "q"}
70	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-10 12:05:14.152	2026-03-10 12:05:14.152	\N	0	21	2026-03-10 12:05:14.473	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	210	{"goal": "sdfswdf", "system": {"version": "2.1", "requiresReview": false}, "references": [], "constraints": [], "instructions": "wsdf"}
71	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-10 12:05:47.68	2026-03-10 12:05:47.68	\N	0	21	2026-03-10 12:05:47.953	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	840	{"goal": "sdzzd", "system": {"version": "2.1", "requiresReview": false}, "references": [], "constraints": [], "instructions": "sdsdsds"}
72	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-10 15:24:31.184	2026-03-10 15:24:31.184	\N	0	21	2026-03-10 15:24:31.825	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	1890	{"goal": "https://www.youtube.com/watch?v=sj6o4cxWgl8", "system": {"version": "2.1", "requiresReview": false}, "references": [{"url": "https://www.youtube.com/watch?v=sj6o4cxWgl", "note": "Notes", "type": "VIDEO", "title": "ridge", "isTrusted": true}], "constraints": ["wsdv"], "instructions": "https://www.youtube.com/watch?v=sj6o4cxWgl8"}
73	General	21	UNDER_REVIEW	f	f	f	0	0	0	0	0	0	2026-03-10 15:45:04.304	2026-03-10 15:45:04.304	\N	0	21	2026-03-10 15:45:04.938	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	3360	{"goal": "QDQSD", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "note": ".btn-locked {     pointer-events: none !important;     opacity: 0.15;     filter: grayscale(1) brightness(0.5);     transition: none; }", "type": "VIDEO", "title": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "isTrusted": false}, {"url": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "note": "", "type": "VIDEO", "title": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "isTrusted": false}], "constraints": ["{   \\"goal\\": \\"\\",   \\"system\\": {     \\"version\\": \\"2.1\\",     \\"requiresReview\\": true   },   \\"references\\": [     {       \\"url\\": \\"http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token\\",       \\"type\\": \\"VIDEO\\",       \\"label\\": \\"\\",       \\"details\\": \\"\\",       \\"isTrusted\\": false     },     {       \\"url\\": \\"http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token\\",       \\"type\\": \\"VIDEO\\",       \\"label\\": \\"\\",       \\"details\\": \\"\\",       \\"isTrusted\\": false     },     {       \\"url\\": \\"http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token\\",       \\"type\\": \\"VIDEO\\",       \\"label\\": \\"\\",       \\"details\\": \\"\\",       \\"isTrusted\\": false     }   ],   \\"constraints\\": [     \\"sdc\\"   ],   \\"instructions\\": \\"\\" }1", "2", "3", "4", "5", "6", "7"], "instructions": "wxcvwxcv"}
74	General	21	UNDER_REVIEW	f	f	f	0	0	0	0	0	0	2026-03-10 15:46:42.765	2026-03-10 15:46:42.765	\N	0	21	2026-03-10 15:46:43.037	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	5250	{"goal": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "note": "", "type": "VIDEO", "title": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "isTrusted": false}], "constraints": ["http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token"], "instructions": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token"}
75	General	21	UNDER_REVIEW	f	f	f	0	0	0	0	0	0	2026-03-10 15:59:19.172	2026-03-10 15:59:19.172	\N	0	21	2026-03-10 15:59:19.484	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	7560	{"goal": "tupProgressiveList('referencesList', 'reference-item-block", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "note": "", "type": "VIDEO", "title": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "isTrusted": false}], "constraints": [], "instructions": "tupProgressiveList('referencesList', 'reference-item-block"}
76	General	21	UNDER_REVIEW	f	f	f	0	0	0	0	0	0	2026-03-10 16:11:58.777	2026-03-10 16:11:58.777	\N	0	21	2026-03-10 16:11:59.09	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	10290	{"goal": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "note": "", "type": "VIDEO", "title": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "isTrusted": false}], "constraints": ["http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token"], "instructions": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token"}
77	General	21	UNDER_REVIEW	f	f	f	0	0	0	0	0	0	2026-03-10 18:07:02.285	2026-03-10 18:07:02.285	\N	0	21	2026-03-10 18:07:02.562	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	13440	{"goal": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "note": "", "type": "VIDEO", "title": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "isTrusted": false}], "constraints": [], "instructions": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token"}
\.


--
-- Data for Name: perennial_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."perennial_tokens" ("token_id", "token", "user_id", "platform_id", "platform_name", "is_active", "created_at") FROM stdin;
1	master_demo_token	21	686071308	TWITCH	t	2026-03-07 21:27:22.537
2	test_token_2	2	linked_twitch_2	TWITCH	t	2026-03-07 21:27:22.931
3	test_token_3	3	solo_kick_3	KICK	t	2026-03-07 21:27:23.278
4	test_token_4	4	solo_youtube_4	YOUTUBE	t	2026-03-07 21:27:23.584
5	test_token_5	5	solo_twitch_5	TWITCH	t	2026-03-07 21:27:23.889
6	test_token_6	6	solo_twitch_6	TWITCH	t	2026-03-07 21:27:24.192
7	test_token_7	7	linked_twitch_7	TWITCH	t	2026-03-07 21:27:24.542
8	test_token_8	8	solo_twitch_8	TWITCH	t	2026-03-07 21:27:24.848
9	test_token_9	9	linked_youtube_9	YOUTUBE	t	2026-03-07 21:27:25.151
10	test_token_10	10	solo_youtube_10	YOUTUBE	t	2026-03-07 21:27:25.454
11	test_token_11	11	linked_twitch_11	TWITCH	t	2026-03-07 21:27:25.759
12	test_token_12	12	linked_youtube_12	YOUTUBE	t	2026-03-07 21:27:26.064
13	test_token_13	13	solo_youtube_13	YOUTUBE	t	2026-03-07 21:27:26.367
14	test_token_14	14	linked_kick_14	KICK	t	2026-03-07 21:27:26.672
15	test_token_15	15	linked_youtube_15	YOUTUBE	t	2026-03-07 21:27:26.975
16	test_token_16	16	linked_twitch_16	TWITCH	t	2026-03-07 21:27:27.278
17	test_token_17	17	solo_twitch_17	TWITCH	t	2026-03-07 21:27:27.585
18	test_token_18	18	linked_kick_18	KICK	t	2026-03-07 21:27:27.893
19	test_token_19	19	solo_kick_19	KICK	t	2026-03-07 21:27:28.198
20	test_token_20	20	linked_twitch_20	TWITCH	t	2026-03-07 21:27:28.503
\.


--
-- Data for Name: pushes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."pushes" ("push_id", "challenge_id", "user_id", "cost", "timestamp", "quantity") FROM stdin;
1	12	6	90441	2026-02-18 05:01:49.656	5
2	3	19	491115	2026-02-20 07:17:20.735	1
3	12	19	68040	2026-03-02 06:56:14.36	1
4	3	7	104634	2026-02-21 10:24:16.825	1
5	8	19	425927	2026-02-21 09:32:42.185	1
6	5	2	75397	2026-03-02 08:40:20.574	1
7	3	6	115280	2026-02-23 09:27:53.871	1
8	4	18	310528	2026-02-28 07:58:05.992	1
9	2	20	92735	2026-03-06 22:22:00.786	1
10	3	19	131350	2026-02-18 14:55:51.14	1
11	16	8	145775	2026-02-09 12:10:46.344	1
12	11	13	118632	2026-03-06 19:56:13.36	1
13	1	4	82571	2026-02-14 08:50:15.808	4
14	1	19	67448	2026-02-10 05:25:58.486	3
15	5	6	149884	2026-02-19 01:08:55.357	1
16	3	19	444107	2026-02-26 06:30:55.4	1
17	2	18	382405	2026-03-04 19:00:57.373	1
18	15	20	533771	2026-03-07 01:27:02.236	1
19	16	10	79056	2026-02-20 20:49:50.18	1
20	4	5	102140	2026-02-12 16:49:12.933	1
21	3	18	51492	2026-03-07 06:22:10.696	1
22	10	19	152340	2026-02-14 08:44:59.903	1
23	5	10	77405	2026-03-01 13:01:54.099	3
24	2	19	449525	2026-02-11 18:44:48.277	1
25	5	18	248158	2026-02-17 15:06:39.666	1
26	8	20	515386	2026-02-11 20:05:36.211	1
27	5	19	107399	2026-02-15 02:04:33.84	1
28	2	19	315823	2026-02-11 10:23:36.241	1
29	5	6	60283	2026-02-07 03:24:18.458	1
30	12	18	359904	2026-02-09 02:52:58.336	1
31	5	11	66074	2026-02-22 04:19:17.243	1
32	2	6	90512	2026-02-08 10:52:06.994	1
33	7	8	72940	2026-02-27 02:35:39.817	1
34	5	20	483798	2026-02-25 02:46:02.633	1
35	2	19	241809	2026-02-20 22:45:21.41	3
36	2	4	57575	2026-03-07 18:31:24.888	1
37	18	8	120814	2026-02-27 18:05:20.313	1
38	4	20	82964	2026-02-11 15:19:41.491	1
39	5	10	103582	2026-02-25 10:02:49.552	1
40	4	18	218142	2026-02-10 09:08:08.399	1
41	1	8	50172	2026-02-13 21:35:30.206	1
42	7	19	465675	2026-02-19 04:12:38.582	1
43	5	8	110387	2026-02-27 20:53:29.839	4
44	2	20	400553	2026-02-12 06:36:52.069	1
45	15	18	379541	2026-03-03 05:00:25.261	4
46	2	6	66790	2026-02-25 03:14:08.312	1
47	3	4	61579	2026-02-15 08:46:27.19	4
48	6	20	337463	2026-03-07 06:39:58.397	1
49	4	19	453046	2026-02-21 02:07:36.964	1
50	4	13	86133	2026-02-07 12:16:04.856	1
51	3	2	79561	2026-02-11 14:13:21.98	1
52	7	19	84741	2026-02-22 19:20:10.406	5
53	3	19	66445	2026-02-26 21:15:47.613	1
54	10	4	94727	2026-02-23 19:05:25.492	1
55	3	10	61332	2026-02-13 03:41:52.813	1
56	17	4	99062	2026-03-05 08:54:45.594	4
57	2	20	332897	2026-03-03 08:22:56.461	1
58	16	20	536537	2026-03-04 04:02:23.976	1
59	2	20	444655	2026-02-26 23:14:04.698	2
60	5	18	371862	2026-02-27 10:50:15.457	1
61	1	20	96099	2026-02-23 09:52:22.987	1
62	2	18	150495	2026-02-17 09:57:31.734	3
63	5	8	93458	2026-02-24 08:03:24.331	3
64	3	14	51702	2026-02-10 03:30:27.02	1
65	2	20	210225	2026-02-24 05:47:28.683	1
66	3	17	126149	2026-02-19 08:24:04.799	1
67	4	14	116540	2026-02-28 13:10:41.676	1
68	2	20	112385	2026-02-28 02:02:39.255	5
69	4	19	299607	2026-02-19 15:23:17.934	1
70	2	4	136647	2026-02-14 01:20:35.422	1
71	14	20	110007	2026-02-22 10:26:19.957	1
72	3	8	84948	2026-02-20 12:13:04.733	2
73	5	20	130271	2026-02-12 07:46:13.62	1
74	3	20	161473	2026-02-16 18:54:49.815	2
75	2	20	462220	2026-02-11 09:39:15.553	1
76	5	18	128786	2026-02-26 12:06:53.459	1
77	2	18	54260	2026-02-20 11:24:25.697	1
78	2	20	442011	2026-03-06 17:21:21.091	1
79	2	20	475407	2026-02-24 13:49:13.593	1
80	3	18	205600	2026-02-24 23:36:04.996	1
81	4	5	77034	2026-02-17 13:00:46.158	1
82	14	8	139492	2026-02-10 12:40:55.066	1
83	6	19	411239	2026-02-10 05:58:18.944	1
84	16	18	115594	2026-03-01 19:22:28.325	1
85	2	20	236204	2026-02-12 04:05:13.512	1
86	5	6	100586	2026-02-17 16:49:03.982	1
87	1	18	167646	2026-02-27 18:38:58.299	2
88	1	19	71007	2026-02-25 06:51:10.893	1
89	4	19	255789	2026-02-28 23:31:57.22	1
90	3	18	153594	2026-03-01 08:21:11.218	1
91	2	19	248624	2026-02-28 05:59:54.507	1
92	5	20	355994	2026-02-13 09:11:55.498	4
93	11	19	331363	2026-02-15 08:51:59.265	1
94	1	6	88666	2026-02-17 12:57:15.79	1
95	4	6	64680	2026-02-20 11:07:47.159	1
96	1	2	87671	2026-02-17 09:54:52.951	1
97	4	18	326744	2026-03-05 07:55:20.175	1
98	7	4	93054	2026-03-05 13:57:17.552	1
99	2	2	131818	2026-02-07 08:55:37.302	2
100	3	18	425055	2026-02-20 12:13:38.988	1
101	14	7	86153	2026-02-11 16:37:14.878	1
102	5	18	122733	2026-02-18 04:02:10.674	1
103	3	8	125837	2026-02-08 02:10:53.956	1
104	5	20	143551	2026-02-21 10:08:10.686	1
105	15	2	78558	2026-03-05 02:40:24.733	1
106	4	18	269120	2026-02-28 17:35:58.529	1
107	3	2	139122	2026-02-11 13:14:29.718	5
108	15	20	267192	2026-02-23 18:04:06.534	1
109	10	18	94641	2026-02-15 01:30:22.572	2
110	6	18	170944	2026-02-24 11:31:52.551	2
111	5	20	197125	2026-02-20 15:57:10.304	1
112	3	18	456628	2026-02-12 16:16:02.331	1
113	2	10	143694	2026-02-07 03:17:53.56	1
114	11	2	70387	2026-02-14 12:09:37.795	5
115	4	18	159673	2026-03-05 07:56:16.555	1
116	1	3	71805	2026-02-09 13:02:25.79	1
117	5	20	206880	2026-03-05 05:04:15.783	1
118	3	19	57525	2026-03-05 16:37:18.379	1
119	1	19	77228	2026-03-06 09:11:30.692	1
120	8	9	143887	2026-02-19 07:21:36.416	1
121	5	20	378851	2026-02-20 21:21:08.837	1
122	32	4	144841	2026-02-06 11:53:52.443	1
123	2	19	494527	2026-02-20 10:39:57.633	5
124	1	18	340481	2026-02-13 20:36:24.227	1
125	1	10	77636	2026-02-14 17:06:23.109	3
126	4	18	168783	2026-02-07 17:38:39.66	1
127	1	18	168615	2026-03-04 11:42:04.763	1
128	16	20	432237	2026-02-22 12:50:23.894	1
129	3	4	129071	2026-02-06 02:38:09.085	1
130	3	2	68563	2026-02-12 10:41:45.236	3
131	8	6	71926	2026-02-23 09:40:38.745	2
132	4	18	129587	2026-02-16 00:21:54.317	2
133	1	19	163746	2026-02-11 00:21:40.307	1
134	4	2	64474	2026-02-10 21:49:44.728	1
135	5	20	257855	2026-03-03 02:29:35.262	1
136	4	18	480893	2026-02-18 19:58:36.94	1
137	5	19	291702	2026-02-14 21:07:10.603	4
138	12	20	262776	2026-02-12 16:38:24.749	1
139	4	18	547749	2026-02-19 10:51:42.975	1
140	2	20	86789	2026-02-06 13:16:07.248	1
141	32	19	101949	2026-03-06 15:57:25.044	1
142	12	8	90781	2026-02-13 00:51:15.093	1
143	5	16	71804	2026-03-02 10:32:25.782	1
144	5	18	356772	2026-02-08 02:09:35.644	1
145	1	4	64616	2026-02-08 16:28:32.169	1
146	4	18	206230	2026-02-28 13:30:28.569	1
147	5	20	244023	2026-02-05 22:58:30.294	1
148	4	2	108388	2026-02-10 21:39:00.595	1
149	5	20	343755	2026-02-23 10:05:26.703	1
150	7	4	149197	2026-02-05 21:53:35.087	1
\.


--
-- Data for Name: stream_stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."stream_stats" ("id", "stream_days_since_inception", "days_since_inception", "last_maintenance_at") FROM stdin;
1	19	18	2026-01-04 16:07:27.825
\.


--
-- Data for Name: streams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."streams" ("stream_session_id", "current_stream_number", "start_timestamp", "end_timestamp", "duration_minutes", "total_pushes_in_session", "total_numbers_spent_on_push", "total_digouts_in_session", "total_numbers_spent_on_digout", "total_disrupts_in_session", "total_numbers_spent_on_disrupt", "total_numbers_spent_in_session", "has_been_processed", "total_challenges_submitted_in_session", "total_numbers_returned_from_removals_in_session", "total_removals_in_session") FROM stdin;
1	1	2025-12-15 18:56:44.704	2025-12-15 20:56:44.704	2	0	0	0	0	0	0	0	t	0	0	0
2	4	2026-01-02 15:30:38.618	2026-01-02 16:02:08.905	31	0	0	0	0	0	0	830	t	2	0	0
3	18	2026-01-05 18:17:21.221	2026-01-05 18:17:25.184	0	0	0	0	0	0	0	0	t	0	0	0
4	19	2026-01-21 17:49:29.597	2026-01-21 17:56:45.402	7	0	0	0	0	0	0	0	t	0	0	0
5	19	2026-01-21 17:56:51.484	2026-01-21 17:56:56.312	0	0	0	0	0	0	0	0	t	0	0	0
6	19	2026-01-21 17:56:59.266	2026-01-21 19:32:19.505	95	0	0	0	0	0	0	0	t	0	0	0
7	19	2026-01-21 19:32:22.404	2026-01-21 19:32:43.742	0	0	0	0	0	0	0	0	t	0	0	0
8	19	2026-01-21 19:32:45.79	2026-01-21 19:33:22.293	0	0	0	0	0	0	0	0	t	0	0	0
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

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") FROM stdin;
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

SELECT pg_catalog.setval('"public"."accounts_account_id_seq"', 36, true);


--
-- Name: challenges_challenge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."challenges_challenge_id_seq"', 77, true);


--
-- Name: perennial_tokens_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."perennial_tokens_token_id_seq"', 20, true);


--
-- Name: pushes_push_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."pushes_push_id_seq"', 150, true);


--
-- Name: streams_stream_session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."streams_stream_session_id_seq"', 8, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."users_user_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict xTzjwTald9gV9S2Dqr4UMevgjGuLOczCUguSfWhjMVbcP6Dze1FkxGeb3zzCzE6

RESET ALL;
