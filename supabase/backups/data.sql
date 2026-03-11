SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict zWhWUzPFTMvXPSRJ4bQlRa9KSlVk4PihRKvnRWrdjsTjQQBl40MsQYisWChmb6f

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
6	2026-03-10 22:36:40.744	\N	0	0	0	2026-03-11 21:00:00	0	4	0	6930	0	0	0	13	0	4	0	0	0	0	0	\N
8	2026-03-10 22:36:45.464	\N	0	0	0	2026-03-11 21:00:00	0	4	0	12537	0	0	0	18	0	4	0	0	0	0	0	\N
9	2026-03-10 22:36:47.769	\N	0	0	0	2026-03-11 21:00:00	0	4	0	6384	0	0	0	4	0	4	0	0	0	0	0	\N
10	2026-03-10 22:36:50.059	\N	0	0	0	2026-03-11 21:00:00	0	4	0	20895	0	0	0	25	0	4	0	0	0	0	0	\N
11	2026-03-10 22:36:52.352	\N	0	0	0	2026-03-11 21:00:00	0	4	0	7371	0	0	0	11	0	4	0	0	0	0	0	\N
12	2026-03-10 22:36:54.639	\N	0	0	0	2026-03-11 21:00:00	0	4	0	6321	0	0	0	1	0	4	0	0	0	0	0	\N
13	2026-03-10 22:36:56.967	\N	0	0	0	2026-03-11 21:00:00	0	4	0	6321	0	0	0	1	0	4	0	0	0	0	0	\N
15	2026-03-10 22:37:02.073	\N	0	0	0	2026-03-11 21:00:00	0	4	0	6321	0	0	0	1	0	4	0	0	0	0	0	\N
16	2026-03-10 22:37:04.374	\N	0	0	0	2026-03-11 21:00:00	0	4	0	9261	0	0	0	8	0	4	0	0	0	0	0	\N
17	2026-03-10 22:37:06.101	\N	0	0	0	2026-03-11 21:00:00	0	3	0	2961	0	0	0	1	0	3	0	0	0	0	0	\N
18	\N	\N	0	0	0	2026-03-10 22:36:19.865	0	0	0	15330	0	0	0	47	0	0	0	0	0	0	0	\N
19	\N	\N	0	0	0	2026-03-10 22:36:19.865	0	0	0	7035	0	0	0	39	0	0	0	0	0	0	0	\N
14	2026-03-10 22:36:59.306	\N	0	0	0	2026-03-11 21:00:00	0	4	0	6300	0	0	0	0	0	4	0	0	0	0	0	\N
1	\N	\N	0	0	0	2026-03-10 22:36:19.865	340473	0	0	0	0	0	0	0	0	0	0	0	0	0	0	\N
20	\N	\N	0	0	0	2026-03-10 22:36:19.865	0	0	0	30828	0	0	0	60	0	0	0	0	0	0	0	\N
21	2026-03-11 14:35:36.135	\N	0	0	0	2026-03-11 21:00:00	0	12	0	136500	0	0	0	0	0	12	0	0	0	0	0	2026-03-11 16:35:44.472
7	2026-03-10 22:36:43.035	\N	0	0	0	2026-03-11 21:00:00	0	4	0	6300	0	0	0	0	0	4	0	0	0	0	0	\N
2	2026-03-10 22:36:31.561	\N	0	0	0	2026-03-11 21:00:00	0	4	0	18375	0	0	0	25	0	4	0	0	0	0	0	\N
3	2026-03-10 22:36:33.881	\N	0	0	0	2026-03-11 21:00:00	0	4	0	6363	0	0	0	3	0	4	0	0	0	0	0	\N
4	2026-03-10 22:36:36.166	\N	0	0	0	2026-03-11 21:00:00	0	4	0	20916	0	0	0	23	0	4	0	0	0	0	0	\N
5	2026-03-10 22:36:38.463	\N	0	0	0	2026-03-11 21:00:00	0	4	0	7224	0	0	0	7	0	4	0	0	0	0	0	\N
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."accounts" ("account_id", "user_id", "platform_id", "platform_name", "current_balance", "last_balance_update", "last_activity_timestamp", "last_live_activity_timestamp", "username") FROM stdin;
2	21	53255028	KICK	21000000	\N	\N	\N	21xhr
3	21	dTQg5JKFl-YiPzg0UQdqng	YOUTUBE	21000000	\N	\N	\N	21xhr
5	2	linked_twitch_2	TWITCH	21000000	\N	\N	\N	Triple_TWITCH_2
6	2	linked_youtube_2	YOUTUBE	21000000	\N	\N	\N	Triple_YOUTUBE_2
8	3	linked_youtube_3	YOUTUBE	21000000	\N	\N	\N	Duo_YOUTUBE_3
10	4	linked_kick_4	KICK	21000000	\N	\N	\N	Triple_KICK_4
11	4	linked_youtube_4	YOUTUBE	21000000	\N	\N	\N	Triple_YOUTUBE_4
14	6	linked_kick_6	KICK	21000000	\N	\N	\N	Duo_KICK_6
16	7	linked_youtube_7	YOUTUBE	21000000	\N	\N	\N	Duo_YOUTUBE_7
20	10	linked_kick_10	KICK	21000000	\N	\N	\N	Triple_KICK_10
21	10	linked_twitch_10	TWITCH	21000000	\N	\N	\N	Triple_TWITCH_10
27	15	linked_kick_15	KICK	21000000	\N	\N	\N	Duo_KICK_15
30	18	linked_kick_18	KICK	21000000	\N	\N	\N	Triple_KICK_18
31	18	linked_twitch_18	TWITCH	21000000	\N	\N	\N	Triple_TWITCH_18
32	18	linked_youtube_18	YOUTUBE	21000000	\N	\N	\N	Triple_YOUTUBE_18
33	19	linked_youtube_19	YOUTUBE	21000000	\N	\N	\N	Duo_YOUTUBE_19
34	19	linked_twitch_19	TWITCH	21000000	\N	\N	\N	Duo_TWITCH_19
35	20	linked_twitch_20	TWITCH	21000000	\N	\N	\N	Triple_TWITCH_20
36	20	linked_kick_20	KICK	21000000	\N	\N	\N	Triple_KICK_20
37	20	linked_youtube_20	YOUTUBE	21000000	\N	\N	\N	Triple_YOUTUBE_20
25	14	solo_youtube_14	YOUTUBE	99996639	\N	\N	\N	Solo_YOUTUBE_14
4	2	linked_kick_2	KICK	99996639	\N	\N	\N	Triple_KICK_2
7	3	linked_twitch_3	TWITCH	99996639	\N	\N	\N	Duo_TWITCH_3
26	15	linked_youtube_15	YOUTUBE	99996639	\N	\N	\N	Duo_YOUTUBE_15
9	4	linked_twitch_4	TWITCH	99996639	\N	\N	\N	Triple_TWITCH_4
28	16	solo_twitch_16	TWITCH	99996639	\N	\N	\N	Solo_TWITCH_16
12	5	solo_kick_5	KICK	99996639	\N	\N	\N	Solo_KICK_5
29	17	solo_twitch_17	TWITCH	99998109	\N	\N	\N	Solo_TWITCH_17
13	6	linked_twitch_6	TWITCH	99996639	\N	\N	\N	Duo_TWITCH_6
15	7	linked_twitch_7	TWITCH	99996639	\N	\N	\N	Duo_TWITCH_7
1	21	686071308	TWITCH	99969759	\N	2026-03-11 16:20:57.094	\N	21xhr
17	8	solo_youtube_8	YOUTUBE	99996639	\N	\N	\N	Solo_YOUTUBE_8
18	9	solo_kick_9	KICK	99996639	\N	\N	\N	Solo_KICK_9
19	10	linked_youtube_10	YOUTUBE	99996639	\N	\N	\N	Triple_YOUTUBE_10
22	11	solo_youtube_11	YOUTUBE	99996639	\N	\N	\N	Solo_YOUTUBE_11
23	12	solo_twitch_12	TWITCH	99996639	\N	\N	\N	Solo_TWITCH_12
24	13	solo_twitch_13	TWITCH	99996639	\N	\N	\N	Solo_TWITCH_13
\.


--
-- Data for Name: challenges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."challenges" ("challenge_id", "category", "proposer_user_id", "status", "is_executing", "has_been_auctioned", "has_been_digged_out", "auction_cost", "disrupt_count", "numbers_raised", "total_numbers_spent", "total_push", "stream_days_since_activation", "timestamp_submitted", "timestamp_last_activation", "timestamp_completed", "unique_pusher", "push_base_cost", "timestampLastStreamDayTicked", "current_session_count", "session_start_timestamp", "total_sessions", "duration_type", "failure_reason", "cadence_period_start", "cadence_progress_counter", "cadence_unit", "session_cadence_text", "cadence_required_count", "timestamp_last_session_tick", "submission_cost", "challenge_text") FROM stdin;
2	General	2	ACTIVE	f	f	f	0	0	0	987	12	17	2026-03-10 22:36:30.011	2026-03-10 22:36:30.011	\N	6	21	2026-03-10 22:36:30.241	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	840	{"goal": "Balance ghost notes and backbeats in a funk pocket.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Clyde_Stubblefield", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}, {"url": "https://open.spotify.com/track/6M6v3Tid69FhO7z3", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["Metronome set to 90bpm", "No cymbals, hi-hat only"], "instructions": "Play a funk groove where your ghost notes are barely audible 'whispers' on the snare, while your backbeats stay crisp and loud. Use the 'tip' of the stick for ghosts and the 'shoulder' for backbeats. Record yourself to ensure the volume gap is wide enough."}
3	General	2	ACTIVE	f	f	f	0	0	0	14637	22	8	2026-03-10 22:36:30.569	2026-03-10 22:36:30.569	\N	6	21	2026-03-10 22:36:30.799	0	\N	10	RECURRING	\N	\N	0	DAILY	1 session per day for 10 days	1	\N	1890	{"goal": "Solidify your Jazz Swing Feel and Ride placement.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Elvin_Jones", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}, {"url": "https://www.youtube.com/watch?v=PWBn7uuxSgk", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Feathered kick drum mandatory", "Brushes or light sticks only"], "instructions": "Play the standard 'spang-a-lang' jazz pattern. Keep the ride cymbal dancing and add occasional light snare comping. Try to 'feather' the bass drum on every quarter note so softly that it is felt rather than heard."}
4	General	2	ACTIVE	f	f	f	0	0	0	1596	12	3	2026-03-10 22:36:31.561	2026-03-10 22:36:31.561	\N	5	21	2026-03-10 22:36:31.791	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	3360	{"goal": "Double Stroke Roll speed and consistency (32nd notes).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/stick-control", "note": "", "type": "BOOK", "title": "", "isTrusted": false}, {"url": "https://youtube.com/finger-control-technique", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}], "constraints": ["Must maintain 85bpm minimum", "Practice on a practice pad"], "instructions": "This is a stamina drill. Play continuous 32nd note double strokes for 30 seconds, then rest for 30 seconds. Use the 'Finger Control' method for the second stroke of each double. Start at 80bpm and increase by 5bpm every two minutes."}
20	General	6	ACTIVE	f	f	f	0	0	0	0	0	18	2026-03-10 22:36:40.744	2026-03-10 22:36:40.744	\N	0	21	2026-03-10 22:36:40.973	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	3360	{"goal": "Build endurance for high-velocity metal drumming.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/George_Kollias", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}], "constraints": ["Traditional grip for snare hand optional"], "instructions": "Practice fast, alternating hits between your kick and snare. Focus on staying relaxed so you don't tense up and slow down. Start at 120bpm and aim for stability over speed."}
21	General	7	ACTIVE	f	f	f	0	0	0	0	0	8	2026-03-10 22:36:41.301	2026-03-10 22:36:41.301	\N	0	21	2026-03-10 22:36:41.578	0	\N	7	RECURRING	\N	\N	0	DAILY	1 session per day for 7 days	1	\N	210	{"goal": "Master the 'empty' first beat of reggae (One-Drop).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Carlton_Barrett", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}, {"url": "https://open.spotify.com/track/one-drop-bob-marley", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["Kick only on beat 3", "Cross-stick snare only"], "instructions": "In this style, the kick drum only hits on the 3rd beat. Keep the hi-hats eighth notes steady and the rim-click crisp. Use a cross-stick on the snare for that authentic woody sound."}
22	General	7	ACTIVE	f	f	f	0	0	0	0	0	2	2026-03-10 22:36:41.904	2026-03-10 22:36:41.904	\N	0	21	2026-03-10 22:36:42.133	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	840	{"goal": "Keep a steady 'baion' foot pattern (Bossa Nova).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://open.spotify.com/track/girl-from-ipanema", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["Consistent ride cymbal mandatory"], "instructions": "Keep your feet playing a constant '1... (and) 2' pattern (dotted 8th, 16th) while your hands play syncopated rim-clicks. It requires perfect timing between feet and hands."}
23	General	7	ACTIVE	f	f	f	0	0	0	0	0	6	2026-03-10 22:36:42.464	2026-03-10 22:36:42.464	\N	0	21	2026-03-10 22:36:42.695	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	1890	{"goal": "Create a 'wall of sound' cinematic swell.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/mallet-swells", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Mallets only", "Minimum 30s crescendo"], "instructions": "Use soft mallets to create smooth, atmospheric swells on your cymbals. Build the volume from a whisper to a roar gradually. Focus on the 'wash' of the sound."}
35	General	10	ACTIVE	f	f	f	0	0	0	0	0	2	2026-03-10 22:36:49.499	2026-03-10 22:36:49.499	\N	0	21	2026-03-10 22:36:49.728	0	\N	8	RECURRING	\N	\N	0	CUSTOM_DAYS	2 sessions every 3 days then repeat this 4 times.	2	\N	1890	{"goal": "Build the habit of non-stop creative play.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/flow-state-guided-meditation", "note": "", "type": "AUDIO", "title": "", "isTrusted": false}], "constraints": ["No stopping, no metronome"], "instructions": "Play for 21 minutes without stopping. Don't judge what you play; just keep the flow moving. If you run out of ideas, play a simple beat until a new idea comes."}
9	General	4	ACTIVE	f	f	f	0	0	0	0	0	13	2026-03-10 22:36:34.44	2026-03-10 22:36:34.44	\N	0	21	2026-03-10 22:36:34.719	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	210	{"goal": "Use your drums to 'soundtrack' a silent movie scene.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://archive.org/silent-films", "note": "", "type": "VIDEO", "title": "", "isTrusted": false}, {"url": "https://example.com/mickey-mousing", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["No cymbals", "Continuous playing for 5 mins"], "instructions": "Watch an old silent film clip. Match your drumming to the physical movements and slapstick timing of the actors on screen. Use different drums to represent different characters."}
5	General	3	ACTIVE	f	f	f	0	0	0	126	3	13	2026-03-10 22:36:32.116	2026-03-10 22:36:32.116	\N	2	21	2026-03-10 22:36:32.394	0	\N	15	RECURRING	\N	\N	0	DAILY	1 session per day for 15 days	1	\N	210	{"goal": "Clean double-tap kick patterns (Heel-Toe).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://youtube.com/heel-toe-technique", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}, {"url": "https://example.com/lever-action-pedals", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Single pedal only", "Heel-up position"], "instructions": "Focus on the 'snap' of the second stroke using the heel-toe technique. Practice rapid double hits on the kick drum. Make sure both hits in the double sound identical in volume and timing."}
6	General	3	ACTIVE	f	f	f	0	0	0	42	2	10	2026-03-10 22:36:32.722	2026-03-10 22:36:32.722	\N	2	21	2026-03-10 22:36:32.954	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	840	{"goal": "Master the foundational 'alphabet' of drumming (N.A.R.D.).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://nard.us.com/N.A.R.D._Rudiments_files/NARD13Essential.pdf", "note": "", "type": "OTHER", "title": "", "isTrusted": false}], "constraints": ["No metronome (Internal clock practice)"], "instructions": "Cycle through the standard rudiments as defined by the National Association of Rudimental Drummers. Focus on 'Open-to-Closed-to-Open' (Slow to Fast to Slow). Pay attention to your stick heights—they should be consistent."}
7	General	3	ACTIVE	f	f	f	0	0	0	21	1	10	2026-03-10 22:36:33.28	2026-03-10 22:36:33.28	\N	1	21	2026-03-10 22:36:33.51	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	1890	{"goal": "Turn human speech patterns into a drum groove.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/podcast-clip-rhythm", "note": "", "type": "AUDIO", "title": "", "isTrusted": false}, {"url": "https://example.com/prosody-percussion", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Blindfolded (Focus on ears)", "Snare only"], "instructions": "Listen to a podcast or a speech. Try to mirror the natural rhythm and 'cadence' of the speaker using your snare and toms. Don't worry about pitch, just the 'prosody' of the speech."}
8	General	3	ACTIVE	f	f	f	0	0	0	21	1	6	2026-03-10 22:36:33.881	2026-03-10 22:36:33.881	\N	1	21	2026-03-10 22:36:34.113	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	3360	{"goal": "Groove along to the rhythm of a news anchor.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://archive.org/broadcast-sample", "note": "", "type": "AUDIO", "title": "", "isTrusted": false}], "constraints": ["Must be a 4/4 time signature"], "instructions": "Turn on a news broadcast. Use the steady, serious rhythm of the anchor's voice as your metronome and build a groove around it. The 'headline' is your snare rhythm, and the 'weather report' is your hi-hat pattern."}
12	General	4	ACTIVE	f	f	f	0	0	0	42	2	7	2026-03-10 22:36:36.166	2026-03-10 22:36:36.166	\N	2	21	2026-03-10 22:36:36.396	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	3360	{"goal": "Improve coordination by taking one limb away.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/limb-independence", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Must maintain consistent hi-hat chick on beats 2 and 4 when not muted"], "instructions": "Play a complex groove, but intentionally 'mute' one limb (like your left foot) for 2 measures every 8, while the others keep going. This builds cognitive independence."}
13	General	5	ACTIVE	f	f	f	0	0	0	0	0	16	2026-03-10 22:36:36.745	2026-03-10 22:36:36.745	\N	0	21	2026-03-10 22:36:37.021	0	\N	7	RECURRING	\N	\N	0	DAILY	1 session per day for 7 days	1	\N	210	{"goal": "Play a rock beat against a Latin clave.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Horacio_Hernandez", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}, {"url": "https://example.com/clave-patterns", "note": "", "type": "BOOK", "title": "", "isTrusted": false}], "constraints": ["Left foot cowbell required"], "instructions": "Keep a standard 4/4 rock beat with your hands while your left foot keeps a 3-2 son clave going on a cowbell sound. Keep the rock beat heavy and the clave steady."}
14	General	5	ACTIVE	f	f	f	0	0	0	0	0	14	2026-03-10 22:36:37.349	2026-03-10 22:36:37.349	\N	0	21	2026-03-10 22:36:37.579	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	840	{"goal": "Balance your kit volume physically, not through tech.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/internal-mixing", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["No post-processing allowed"], "instructions": "Turn off all EQ and compression on your module. Balance the volume of your snare versus your cymbals purely through your physical touch. Record and listen back to check the mix."}
32	General	9	ACTIVE	f	f	f	0	0	0	0	0	13	2026-03-10 22:36:47.769	2026-03-10 22:36:47.769	\N	0	21	2026-03-10 22:36:48.001	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	3360	{"goal": "Practice locking in with a bassist.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://open.spotify.com/track/flea-bass-line", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["No extra kick notes allowed"], "instructions": "Find a 'bass only' track. Make sure every single time the bassist hits a note, your kick drum is hitting exactly with them. Do not play any extra kick notes."}
33	General	10	ACTIVE	f	f	f	0	0	0	0	0	6	2026-03-10 22:36:48.329	2026-03-10 22:36:48.329	\N	0	21	2026-03-10 22:36:48.605	0	\N	7	RECURRING	\N	\N	0	DAILY	7 days of precision	7	\N	210	{"goal": "Play with the perfect timing of a machine.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/industrial-precision", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Must be perfectly on the grid"], "instructions": "Use a dry, clicky kit. Focus on being so 'on the grid' that your hits perfectly overlap with the metronome. This is the opposite of micro-rhythm—it is pure metronomic precision."}
34	General	10	ACTIVE	f	f	f	0	0	0	0	0	10	2026-03-10 22:36:48.937	2026-03-10 22:36:48.937	\N	0	21	2026-03-10 22:36:49.168	0	\N	14	RECURRING	\N	\N	0	DAILY	14 days of control	14	\N	840	{"goal": "Maintain energy and speed at a tiny volume (Whisper Metal).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/pianissimo-control", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Sticks must not rise above 2 inches"], "instructions": "Play an aggressive heavy metal groove (blasts, double kick) as quietly as possible. Maintain the speed, but keep the volume at a 'whisper.' This forces efficiency of motion."}
10	General	4	ACTIVE	f	f	f	0	0	0	105	2	0	2026-03-10 22:36:35.049	2026-03-10 22:36:35.049	\N	1	21	2026-03-10 22:36:35.281	0	\N	4	RECURRING	\N	\N	0	MONTHLY	1 session per month for 4 months	1	\N	840	{"goal": "Improvise a soundtrack to changing natural environments.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://open.spotify.com/playlist/nature-sounds-reference", "note": "", "type": "PLAYLIST", "title": "", "isTrusted": false}], "constraints": ["Use mallets or brushes only", "Minimum 10 minutes per session"], "instructions": "Once a month, select a new nature soundscape (Rainfall, Thunderstorm, Ocean Waves, Forest Wind). Score the environment using appropriate dynamics—soft cymbal washes for rain, heavy toms for thunder."}
11	General	4	ACTIVE	f	f	f	0	0	0	630	4	4	2026-03-10 22:36:35.608	2026-03-10 22:36:35.608	\N	1	21	2026-03-10 22:36:35.838	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	1890	{"goal": "Explore non-traditional sounds on your VAD module.", "system": {"version": "2.1", "requiresReview": false}, "references": [{"url": "https://youtube.com/roland-vad-sound-design", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}], "constraints": ["Must use at least 1 non-instrumental object"], "instructions": "Switch to an industrial or electronic kit. Incorporate at least one 'found sound' or weird FX from the module into a 4/4 groove. This is inspired by industrial and experimental electronic music."}
15	General	5	ACTIVE	f	f	f	0	0	0	0	0	14	2026-03-10 22:36:37.905	2026-03-10 22:36:37.905	\N	0	21	2026-03-10 22:36:38.135	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	1890	{"goal": "Master the legendary half-time shuffle (Purdie Shuffle).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://youtube.com/purdie-shuffle", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}, {"url": "https://open.spotify.com/track/HomeAtLast", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["Must use triplets", "Snare ghost notes required"], "instructions": "Focus on the 'bounce' of the ghost note triplets. It's all about that specific 'lazy' feel that Bernard Purdie is famous for. Listen to 'Home at Last' by Steely Dan for the reference pulse."}
16	General	5	ACTIVE	f	f	f	0	0	0	0	0	3	2026-03-10 22:36:38.463	2026-03-10 22:36:38.463	\N	0	21	2026-03-10 22:36:38.692	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	3360	{"goal": "Make 7/8 feel as natural as 4/4.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://open.spotify.com/track/money-pink-floyd", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["No metronome for the final 5 minutes"], "instructions": "Cycle a 7/8 groove (counting it as 2+2+3). Try to make it feel smooth enough that someone could dance to it. Avoid it feeling 'jagged.'"}
17	General	6	ACTIVE	f	f	f	0	0	0	0	0	17	2026-03-10 22:36:39.031	2026-03-10 22:36:39.031	\N	0	21	2026-03-10 22:36:39.307	0	\N	10	RECURRING	\N	\N	0	DAILY	1 session per day for 10 days	1	\N	210	{"goal": "Make brush sweeps work on electronic drums.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Jeff_Hamilton_(drummer)", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}], "constraints": ["Brushes only", "Tempo under 60bpm"], "instructions": "Use the brush-specific settings on your module. Practice the sweeping motions and 'swirls' used in jazz ballads. Ensure the sensitivity is set correctly to pick up the friction."}
18	General	6	ACTIVE	f	f	f	0	0	0	0	0	4	2026-03-10 22:36:39.633	2026-03-10 22:36:39.633	\N	0	21	2026-03-10 22:36:39.862	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	840	{"goal": "Play patterns where no two notes hit at once (Linear Gadd).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://youtube.com/gadd-linear", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}, {"url": "https://open.spotify.com/track/fifty-ways-leave-lover", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["No unison hits allowed"], "instructions": "Play patterns where the hands and feet follow each other in a line (no simultaneous hits). Practice the K-R-L-K-R-L-R-L pattern. This creates that 'winding' Steve Gadd sound."}
19	General	6	ACTIVE	f	f	f	0	0	0	0	0	19	2026-03-10 22:36:40.189	2026-03-10 22:36:40.189	\N	0	21	2026-03-10 22:36:40.417	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	1890	{"goal": "Build independence with 3-against-4 polyrhythms.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/polyrhythm-math", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Kick/Snare must stay on the grid"], "instructions": "Play a steady 4/4 pulse on your kick and snare while your hi-hat (or ride) plays in 3/4. Don't let the counts pull each other off beat. This is a classic brain-splitter."}
24	General	7	ACTIVE	f	f	f	0	0	0	0	0	5	2026-03-10 22:36:43.035	2026-03-10 22:36:43.035	\N	0	21	2026-03-10 22:36:43.266	0	\N	10	RECURRING	\N	\N	0	DAILY	1 session per day for 10 days	1	\N	3360	{"goal": "Master the powerful R-L-K triplet pattern (Bonham).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/John_Bonham", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}, {"url": "https://youtube.com/bonham-triplets", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}], "constraints": ["Must maintain consistent volume across hands and feet"], "instructions": "Practice the 'galloping' triplet (Right Hand, Left Hand, Kick). Focus on power and making the transition from hands to feet seamless. Speed it up until it sounds like a single instrument."}
25	General	8	ACTIVE	f	f	f	0	0	0	0	0	2	2026-03-10 22:36:43.641	2026-03-10 22:36:43.641	\N	0	21	2026-03-10 22:36:43.919	0	\N	5	RECURRING	\N	\N	0	DAILY	1 session per day for 5 days	1	\N	210	{"goal": "Test your timing by shifting the 'click'.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/internal-clock-theory", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Start at 60bpm", "Record and check if you 'flipped' back"], "instructions": "Set your metronome to a steady pulse, but treat the click as the 'and' (the upbeat). Your goal is to keep a groove where your main beats land in the silences. This will feel like the metronome is fighting you."}
26	General	8	ACTIVE	f	f	f	0	0	0	0	0	18	2026-03-10 22:36:44.248	2026-03-10 22:36:44.248	\N	0	21	2026-03-10 22:36:44.57	0	\N	10	RECURRING	\N	\N	0	DAILY	10 days of hats	10	\N	840	{"goal": "Master the fast hi-hat 'zips' (Trap Rolls).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://open.spotify.com/playlist/trap-drums-reference", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["Single hand for hi-hat only"], "instructions": "Practice 16th and 32nd note triplets on the hi-hat using one hand. Use your fingers to get that rapid-fire speed. Incorporate bursts and rolls found in trap music."}
27	General	8	ACTIVE	f	f	f	0	0	0	0	0	12	2026-03-10 22:36:44.899	2026-03-10 22:36:44.899	\N	0	21	2026-03-10 22:36:45.132	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	1890	{"goal": "Build a catchy groove without using snare or cymbals.", "system": {"version": "2.1", "requiresReview": false}, "references": [{"url": "https://youtube.com/tribal-tom-grooves", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}], "constraints": ["Absolutely no snare drum", "No cymbals"], "instructions": "Switch to a tom-heavy kit. You aren't allowed to use the snare—create the entire groove using just the toms and the kick. Use the toms as melodic voices."}
28	General	8	ACTIVE	f	f	f	0	0	0	0	0	9	2026-03-10 22:36:45.464	2026-03-10 22:36:45.464	\N	0	21	2026-03-10 22:36:45.697	0	\N	12	RECURRING	\N	\N	0	WEEKLY	3 sessions per week for 4 weeks	3	\N	3360	{"goal": "Fluidly blend visual flair with consistent timing.", "system": {"version": "2.1", "requiresReview": false}, "references": [{"url": "https://www.youtube.com/watch?v=MkK8qACn6xs", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}], "constraints": ["Must maintain consistent 2/4 backbeat"], "instructions": "Practice backsticking, twirls, or crossovers while maintaining a simple 2 and 4 backbeat. The trick must not interrupt the groove or tempo. Rotate through different tricks each session."}
29	General	9	ACTIVE	f	f	f	0	0	0	0	0	12	2026-03-10 22:36:46.035	2026-03-10 22:36:46.035	\N	0	21	2026-03-10 22:36:46.314	0	\N	14	RECURRING	\N	\N	0	DAILY	14 days of fills	14	\N	210	{"goal": "Use the R-L-R-R-L-L rudiment in a drum fill.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/paradiddle-diddle-notation", "note": "", "type": "OTHER", "title": "", "isTrusted": false}], "constraints": ["Focus on even stick heights"], "instructions": "Practice the paradiddle-diddle moving across the toms. It’s a great way to move quickly without crossing your arms. Focus on even stick heights and making it sound fluid."}
30	General	9	ACTIVE	f	f	f	0	0	0	0	0	5	2026-03-10 22:36:46.646	2026-03-10 22:36:46.646	\N	0	21	2026-03-10 22:36:46.878	0	\N	7	RECURRING	\N	\N	0	DAILY	7 days of funk	7	\N	840	{"goal": "Master the 'heavy' funk pocket (Half-Time).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Questlove", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}], "constraints": ["Slightly behind the beat (laid back)"], "instructions": "Play a funk groove but drop the snare backbeat to the '3.' Focus on making it feel deep and groovy. This creates a massive amount of 'air' in the beat."}
31	General	9	ACTIVE	f	f	f	0	0	0	0	0	2	2026-03-10 22:36:47.209	2026-03-10 22:36:47.209	\N	0	21	2026-03-10 22:36:47.439	0	\N	21	RECURRING	\N	\N	0	DAILY	21 days of double kick	21	\N	1890	{"goal": "Build sprinting speed with your feet.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/muscle-fatigue-management", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Must maintain for 60 seconds without stopping"], "instructions": "Set a timer for 1 minute and play steady 16th notes on the double kick. Focus on keeping both feet sounding identical. If you break rhythm, stop and restart."}
36	General	10	ACTIVE	f	f	f	0	0	0	0	0	1	2026-03-10 22:36:50.059	2026-03-10 22:36:50.059	\N	0	21	2026-03-10 22:36:50.29	0	\N	7	RECURRING	\N	\N	0	DAILY	7 days of ghost notes	7	\N	3360	{"goal": "Add busy-ness to a beat using quiet taps (Syncopation).", "system": {"version": "2.1", "requiresReview": false}, "references": [{"url": "https://youtube.com/ghost-note-masterclass", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}], "constraints": ["Main backbeat must stay consistent"], "instructions": "Play a 16th note linear pattern where the snare ghost notes only occur on the 'e' and 'a' of the beat. This creates a complex, rolling texture."}
53	General	15	FAILED	f	f	f	0	0	0	2436	13	18	2026-03-10 22:36:59.969	2026-03-10 22:36:59.969	\N	4	21	2026-03-10 22:37:00.499	0	\N	1	ONE_OFF	Insufficient execution consistency across sessions.	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	210	{"goal": "[DIVERSIFIED] Explore non-traditional sounds on your VAD module.", "system": {"version": "2.1", "requiresReview": false}, "references": [{"url": "https://youtube.com/roland-vad-sound-design", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}], "constraints": ["Must use at least 1 non-instrumental object"], "instructions": "Switch to an industrial or electronic kit. Incorporate at least one 'found sound' or weird FX from the module into a 4/4 groove. This is inspired by industrial and experimental electronic music."}
37	General	11	ACTIVE	f	f	f	0	0	0	0	0	13	2026-03-10 22:36:50.617	2026-03-10 22:36:50.617	\N	0	21	2026-03-10 22:36:50.897	0	\N	21	RECURRING	\N	\N	0	DAILY	21 days of sprints	21	\N	210	{"goal": "Practice quick foot sprints for metal (Double Kick).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/fast-twitch-activation", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Maximum speed during bursts"], "instructions": "Play 5-second bursts of maximum speed 16th notes on the kick, then 5 seconds of rest. Repeat for the session. This builds 'fast twitch' muscle response."}
38	General	11	ACTIVE	f	f	f	0	0	0	0	0	10	2026-03-10 22:36:51.229	2026-03-10 22:36:51.229	\N	0	21	2026-03-10 22:36:51.459	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	840	{"goal": "Match the 'length' of the notes with a bassist.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/musical-sustain", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Must use at least 2 different types of cymbal sustain"], "instructions": "Listen to a bass track. Short bass notes = short kick drum hits. Long bass notes = open cymbal hits. You are mimicking the 'sustain' of a melodic instrument."}
39	General	11	ACTIVE	f	f	f	0	0	0	0	0	3	2026-03-10 22:36:51.789	2026-03-10 22:36:51.789	\N	0	21	2026-03-10 22:36:52.022	0	\N	7	RECURRING	\N	\N	0	DAILY	7 days of unison	7	\N	1890	{"goal": "Make your hands and feet sound like one engine.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/vertical-alignment", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Record and listen for unison accuracy"], "instructions": "Focus on the 'unison' of your hits. Your kick and snare should hit at the exact same time so they sound like one powerful instrument. Eliminate all 'flams' between limbs."}
40	General	11	ACTIVE	f	f	f	0	0	0	0	0	2	2026-03-10 22:36:52.352	2026-03-10 22:36:52.352	\N	0	21	2026-03-10 22:36:52.582	0	\N	14	RECURRING	\N	\N	0	DAILY	14 days of stealth speed	14	\N	3360	{"goal": "Build speed using fingers by limiting stick height.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Derek_Roddy", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}], "constraints": ["No arm movement allowed"], "instructions": "Play a fast metal groove but don't let your sticks go more than an inch off the drum. This relies entirely on finger control and wrist snap rather than arm movement."}
41	General	12	ACTIVE	f	f	f	0	0	0	0	0	12	2026-03-10 22:36:52.911	2026-03-10 22:36:52.911	\N	0	21	2026-03-10 22:36:53.189	0	\N	12	RECURRING	\N	\N	0	WEEKLY	3 sessions per week for 4 weeks	3	\N	210	{"goal": "Master high-tempo breakbeats and smooth ghost notes.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://open.spotify.com/track/amen-break-original", "note": "", "type": "SONG", "title": "", "isTrusted": false}, {"url": "https://example.com/dnb-mechanics", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Tempo must stay above 165bpm"], "instructions": "Progress from the foundational 'Amen Break' to atmospheric, flowing grooves with snare hits that 'dance' around the main beat. Aim for high speed (175bpm+) endurance."}
48	General	13	IN_PROGRESS	f	f	f	0	0	0	336	5	8	2026-03-10 22:36:56.967	2026-03-10 22:36:56.967	\N	3	21	2026-03-10 22:36:57.201	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	3360	{"goal": "[DIVERSIFIED] Master the foundational 'alphabet' of drumming (N.A.R.D.).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://nard.us.com/N.A.R.D._Rudiments_files/NARD13Essential.pdf", "note": "", "type": "OTHER", "title": "", "isTrusted": false}], "constraints": ["No metronome (Internal clock practice)"], "instructions": "Cycle through the standard rudiments as defined by the National Association of Rudimental Drummers. Focus on 'Open-to-Closed-to-Open' (Slow to Fast to Slow). Pay attention to your stick heights—they should be consistent."}
49	General	14	AUCTIONED	f	f	f	0	0	0	1890	14	0	2026-03-10 22:36:57.529	2026-03-10 22:36:57.529	\N	7	21	2026-03-10 22:36:57.808	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	210	{"goal": "[DIVERSIFIED] Turn human speech patterns into a drum groove.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/podcast-clip-rhythm", "note": "", "type": "AUDIO", "title": "", "isTrusted": false}, {"url": "https://example.com/prosody-percussion", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Blindfolded (Focus on ears)", "Snare only"], "instructions": "Listen to a podcast or a speech. Try to mirror the natural rhythm and 'cadence' of the speaker using your snare and toms. Don't worry about pitch, just the 'prosody' of the speech."}
50	General	14	AUCTIONED	f	f	f	0	0	0	504	10	16	2026-03-10 22:36:58.137	2026-03-10 22:36:58.137	\N	7	21	2026-03-10 22:36:58.367	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	840	{"goal": "[DIVERSIFIED] Groove along to the rhythm of a news anchor.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://archive.org/broadcast-sample", "note": "", "type": "AUDIO", "title": "", "isTrusted": false}], "constraints": ["Must be a 4/4 time signature"], "instructions": "Turn on a news broadcast. Use the steady, serious rhythm of the anchor's voice as your metronome and build a groove around it. The 'headline' is your snare rhythm, and the 'weather report' is your hi-hat pattern."}
47	General	13	ARCHIVED	f	f	f	0	0	0	10689	14	21	2026-03-10 22:36:56.389	2026-03-10 22:36:56.389	\N	4	21	2026-03-10 22:36:56.621	0	\N	15	RECURRING	\N	\N	0	DAILY	1 session per day for 15 days	1	\N	1890	{"goal": "[DIVERSIFIED] Clean double-tap kick patterns (Heel-Toe).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://youtube.com/heel-toe-technique", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}, {"url": "https://example.com/lever-action-pedals", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Single pedal only", "Heel-up position"], "instructions": "Focus on the 'snap' of the second stroke using the heel-toe technique. Practice rapid double hits on the kick drum. Make sure both hits in the double sound identical in volume and timing."}
42	General	12	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-10 22:36:53.518	2026-03-10 22:36:53.518	\N	0	21	2026-03-10 22:36:53.749	0	\N	7	RECURRING	\N	\N	0	DAILY	7 days	7	\N	840	{"goal": "Mastering Micro-Timing and Rhythmic Nuance.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://www.confidentdrummer.com/what-are-micro-rhythms-and-micro-timing-and-why-they-matter", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}, {"url": "https://www.youtube.com/@LofiGirl", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}, {"url": "https://en.wikipedia.org/wiki/J_Dilla", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}], "constraints": ["Use a high-pitch cowbell click for Phase 1", "Record sessions and compare the 'offset' of each hit"], "instructions": "Go beyond the rigid grid of western notation by exploring micro-rhythms—intentional deviations and subtleties that notation cannot accurately represent. \\n\\n- **Phase 1 (Sessions 1-3)**: Develop 'The Grid vs. The Feel'. Practice playing 'behind' and 'ahead' of a high-pitched cowbell click. Focus on the consistent space between the click and your strike. \\n- **Phase 2 (Sessions 4-6)**: Study the 'Unquantized Swing'. Play along to classic tracks by J Dilla or D'Angelo (e.g., 'Untitled'). Focus on the 'late' snare and 'drunken' kick placement that creates a human pocket. \\n- **Phase 3 (Session 7)**: Modern Lofi Application. Drum along to a lofi hip-hop stream. Incorporate everything learned to create a laid-back, personal 'feel' that flows with the unquantized samples."}
44	General	12	ARCHIVED	f	f	f	0	0	0	21	1	21	2026-03-10 22:36:54.639	2026-03-10 22:36:54.639	\N	1	21	2026-03-10 22:36:54.877	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	3360	{"goal": "[DIVERSIFIED] Balance ghost notes and backbeats in a funk pocket.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Clyde_Stubblefield", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}, {"url": "https://open.spotify.com/track/6M6v3Tid69FhO7z3", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["Metronome set to 90bpm", "No cymbals, hi-hat only"], "instructions": "Play a funk groove where your ghost notes are barely audible 'whispers' on the snare, while your backbeats stay crisp and loud. Use the 'tip' of the stick for ghosts and the 'shoulder' for backbeats. Record yourself to ensure the volume gap is wide enough."}
45	General	13	FAILED	f	f	f	0	0	0	336	7	8	2026-03-10 22:36:55.207	2026-03-10 22:36:55.207	\N	4	21	2026-03-10 22:36:55.484	0	\N	10	RECURRING	Insufficient execution consistency across sessions.	\N	0	DAILY	1 session per day for 10 days	1	\N	210	{"goal": "[DIVERSIFIED] Solidify your Jazz Swing Feel and Ride placement.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Elvin_Jones", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}, {"url": "https://www.youtube.com/watch?v=PWBn7uuxSgk", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Feathered kick drum mandatory", "Brushes or light sticks only"], "instructions": "Play the standard 'spang-a-lang' jazz pattern. Keep the ride cymbal dancing and add occasional light snare comping. Try to 'feather' the bass drum on every quarter note so softly that it is felt rather than heard."}
46	General	13	REMOVED	f	f	f	0	0	0	2037	9	14	2026-03-10 22:36:55.813	2026-03-10 22:36:55.813	\N	3	21	2026-03-10 22:36:56.047	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	840	{"goal": "[DIVERSIFIED] Double Stroke Roll speed and consistency (32nd notes).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/stick-control", "note": "", "type": "BOOK", "title": "", "isTrusted": false}, {"url": "https://youtube.com/finger-control-technique", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}], "constraints": ["Must maintain 85bpm minimum", "Practice on a practice pad"], "instructions": "This is a stamina drill. Play continuous 32nd note double strokes for 30 seconds, then rest for 30 seconds. Use the 'Finger Control' method for the second stroke of each double. Start at 80bpm and increase by 5bpm every two minutes."}
51	General	14	REMOVED	f	f	f	0	0	0	63	3	7	2026-03-10 22:36:58.743	2026-03-10 22:36:58.743	\N	3	21	2026-03-10 22:36:58.975	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	1890	{"goal": "[DIVERSIFIED] Use your drums to 'soundtrack' a silent movie scene.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://archive.org/silent-films", "note": "", "type": "VIDEO", "title": "", "isTrusted": false}, {"url": "https://example.com/mickey-mousing", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["No cymbals", "Continuous playing for 5 mins"], "instructions": "Watch an old silent film clip. Match your drumming to the physical movements and slapstick timing of the actors on screen. Use different drums to represent different characters."}
52	General	14	UNDER_REVIEW	f	f	f	0	0	0	8400	26	0	2026-03-10 22:36:59.306	2026-03-10 22:36:59.306	\N	7	21	2026-03-10 22:36:59.63	0	\N	4	RECURRING	\N	\N	0	MONTHLY	1 session per month for 4 months	1	\N	3360	{"goal": "[DIVERSIFIED] Improvise a soundtrack to changing natural environments.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://open.spotify.com/playlist/nature-sounds-reference", "note": "", "type": "PLAYLIST", "title": "", "isTrusted": false}], "constraints": ["Use mallets or brushes only", "Minimum 10 minutes per session"], "instructions": "Once a month, select a new nature soundscape (Rainfall, Thunderstorm, Ocean Waves, Forest Wind). Score the environment using appropriate dynamics—soft cymbal washes for rain, heavy toms for thunder."}
43	General	12	COMPLETED	f	f	f	0	0	0	13797	16	19	2026-03-10 22:36:54.079	2026-03-10 22:36:54.079	2026-03-10 22:36:54.592	4	21	2026-03-10 22:36:54.31	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	1890	{"goal": "[DIVERSIFIED] Master the Moeller 'whip' technique for effortless power.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://www.youtube.com/watch?v=Zj3-Lc7UWwg", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}, {"url": "https://en.wikipedia.org/wiki/Moeller_method", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["No rimshots allowed", "Must use matched grip"], "instructions": "Practice your Moeller strokes using alternating accents. Focus on the whip-like motion of the wrist and let the stick bounce naturally rather than gripping it tight. Your hand should feel like a wet towel being snapped. Focus on staying completely relaxed."}
58	General	16	FAILED	f	f	f	0	0	0	0	0	16	2026-03-10 22:37:03.24	2026-03-10 22:37:03.24	\N	0	21	2026-03-10 22:37:03.471	0	\N	14	RECURRING	Insufficient execution consistency across sessions.	\N	0	DAILY	1 session per day for 14 days	1	\N	840	{"goal": "[DIVERSIFIED] Make 7/8 feel as natural as 4/4.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://open.spotify.com/track/money-pink-floyd", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["No metronome for the final 5 minutes"], "instructions": "Cycle a 7/8 groove (counting it as 2+2+3). Try to make it feel smooth enough that someone could dance to it. Avoid it feeling 'jagged.'"}
54	General	15	IN_PROGRESS	f	f	f	0	0	0	1218	8	14	2026-03-10 22:37:00.829	2026-03-10 22:37:00.829	\N	4	21	2026-03-10 22:37:01.092	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	840	{"goal": "[DIVERSIFIED] Improve coordination by taking one limb away.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/limb-independence", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Must maintain consistent hi-hat chick on beats 2 and 4 when not muted"], "instructions": "Play a complex groove, but intentionally 'mute' one limb (like your left foot) for 2 measures every 8, while the others keep going. This builds cognitive independence."}
55	General	15	COMPLETED	f	f	f	0	0	0	6720	18	11	2026-03-10 22:37:01.507	2026-03-10 22:37:01.507	2026-03-10 22:37:02.026	7	21	2026-03-10 22:37:01.742	0	\N	7	RECURRING	\N	\N	0	DAILY	1 session per day for 7 days	1	\N	1890	{"goal": "[DIVERSIFIED] Play a rock beat against a Latin clave.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Horacio_Hernandez", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}, {"url": "https://example.com/clave-patterns", "note": "", "type": "BOOK", "title": "", "isTrusted": false}], "constraints": ["Left foot cowbell required"], "instructions": "Keep a standard 4/4 rock beat with your hands while your left foot keeps a 3-2 son clave going on a cowbell sound. Keep the rock beat heavy and the clave steady."}
56	General	15	UNDER_REVIEW	f	f	f	0	0	0	2037	12	0	2026-03-10 22:37:02.073	2026-03-10 22:37:02.073	\N	7	21	2026-03-10 22:37:02.305	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	3360	{"goal": "[DIVERSIFIED] Balance your kit volume physically, not through tech.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/internal-mixing", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["No post-processing allowed"], "instructions": "Turn off all EQ and compression on your module. Balance the volume of your snare versus your cymbals purely through your physical touch. Record and listen back to check the mix."}
57	General	16	REMOVED	f	f	f	0	0	0	11823	25	4	2026-03-10 22:37:02.635	2026-03-10 22:37:02.635	\N	8	21	2026-03-10 22:37:02.913	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	210	{"goal": "[DIVERSIFIED] Master the legendary half-time shuffle (Purdie Shuffle).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://youtube.com/purdie-shuffle", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}, {"url": "https://open.spotify.com/track/HomeAtLast", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["Must use triplets", "Snare ghost notes required"], "instructions": "Focus on the 'bounce' of the ghost note triplets. It's all about that specific 'lazy' feel that Bernard Purdie is famous for. Listen to 'Home at Last' by Steely Dan for the reference pulse."}
66	General	21	UNDER_REVIEW	f	f	f	0	0	0	0	0	0	2026-03-11 11:29:40.681	2026-03-11 11:29:40.681	\N	0	21	2026-03-11 11:29:41.337	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	1890	{"goal": "loading-view {     text-align: center;     display: flex;     flex-direction: column;     align-items: center;     justify-content: center;     min-height: 200px; } .step-container {", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "note": "", "type": "VIDEO", "title": "wsd", "isTrusted": false}], "constraints": ["loading-view {     text-align: center;     display: flex;     flex-direction: column;     align-items: center;     justify-content: center;     min-height: 200px; } .step-container {"], "instructions": "loading-view {\\n    text-align: center;\\n    display: flex;\\n    flex-direction: column;\\n    align-items: center;\\n    justify-content: center;\\n    min-height: 200px;\\n}\\n.step-container {"}
60	General	16	FAILED	f	f	f	0	0	0	0	0	18	2026-03-10 22:37:04.374	2026-03-10 22:37:04.374	\N	0	21	2026-03-10 22:37:04.605	0	\N	14	RECURRING	Insufficient execution consistency across sessions.	\N	0	DAILY	1 session per day for 14 days	1	\N	3360	{"goal": "[DIVERSIFIED] Play patterns where no two notes hit at once (Linear Gadd).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://youtube.com/gadd-linear", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}, {"url": "https://open.spotify.com/track/fifty-ways-leave-lover", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["No unison hits allowed"], "instructions": "Play patterns where the hands and feet follow each other in a line (no simultaneous hits). Practice the K-R-L-K-R-L-R-L pattern. This creates that 'winding' Steve Gadd sound."}
61	General	17	FAILED	f	f	f	0	0	0	0	0	5	2026-03-10 22:37:04.934	2026-03-10 22:37:04.934	\N	0	21	2026-03-10 22:37:05.212	0	\N	21	RECURRING	Challenge was abandoned before completion.	\N	0	DAILY	1 session per day for 21 days	1	\N	210	{"goal": "[DIVERSIFIED] Build independence with 3-against-4 polyrhythms.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/polyrhythm-math", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Kick/Snare must stay on the grid"], "instructions": "Play a steady 4/4 pulse on your kick and snare while your hi-hat (or ride) plays in 3/4. Don't let the counts pull each other off beat. This is a classic brain-splitter."}
62	General	17	FAILED	f	f	f	0	0	0	0	0	10	2026-03-10 22:37:05.541	2026-03-10 22:37:05.541	\N	0	21	2026-03-10 22:37:05.771	0	\N	21	RECURRING	Constraints were repeatedly broken during execution.	\N	0	DAILY	1 session per day for 21 days	1	\N	840	{"goal": "[DIVERSIFIED] Build endurance for high-velocity metal drumming.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/George_Kollias", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}], "constraints": ["Traditional grip for snare hand optional"], "instructions": "Practice fast, alternating hits between your kick and snare. Focus on staying relaxed so you don't tense up and slow down. Start at 120bpm and aim for stability over speed."}
63	General	17	FAILED	f	f	f	0	0	0	0	0	6	2026-03-10 22:37:06.101	2026-03-10 22:37:06.101	\N	0	21	2026-03-10 22:37:06.335	0	\N	7	RECURRING	Challenge pacing was not sustained over time.	\N	0	DAILY	1 session per day for 7 days	1	\N	1890	{"goal": "[DIVERSIFIED] Master the 'empty' first beat of reggae (One-Drop).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Carlton_Barrett", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}, {"url": "https://open.spotify.com/track/one-drop-bob-marley", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["Kick only on beat 3", "Cross-stick snare only"], "instructions": "In this style, the kick drum only hits on the 3rd beat. Keep the hi-hats eighth notes steady and the rim-click crisp. Use a cross-stick on the snare for that authentic woody sound."}
1	General	2	ACTIVE	f	f	f	0	0	0	19698	31	14	2026-03-10 22:36:28.298	2026-03-10 22:36:28.298	\N	7	21	2026-03-10 22:36:29.4	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	210	{"goal": "Master the Moeller 'whip' technique for effortless power.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://www.youtube.com/watch?v=Zj3-Lc7UWwg", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}, {"url": "https://en.wikipedia.org/wiki/Moeller_method", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["No rimshots allowed", "Must use matched grip"], "instructions": "Practice your Moeller strokes using alternating accents. Focus on the whip-like motion of the wrist and let the stick bounce naturally rather than gripping it tight. Your hand should feel like a wet towel being snapped. Focus on staying completely relaxed."}
59	General	16	UNDER_REVIEW	f	f	f	0	0	0	6321	14	0	2026-03-10 22:37:03.814	2026-03-10 22:37:03.814	\N	4	21	2026-03-10 22:37:04.045	0	\N	10	RECURRING	\N	\N	0	DAILY	1 session per day for 10 days	1	\N	1890	{"goal": "[DIVERSIFIED] Make brush sweeps work on electronic drums.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Jeff_Hamilton_(drummer)", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}], "constraints": ["Brushes only", "Tempo under 60bpm"], "instructions": "Use the brush-specific settings on your module. Practice the sweeping motions and 'swirls' used in jazz ballads. Ensure the sensitivity is set correctly to pick up the friction."}
64	General	21	UNDER_REVIEW	f	f	f	0	0	0	0	0	0	2026-03-11 11:25:39.414	2026-03-11 11:25:39.414	\N	0	21	2026-03-11 11:25:39.684	0	\N	24	ONE_OFF	\N	\N	0	\N	\N	\N	\N	210	{"goal": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "note": "", "type": "VIDEO", "title": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "isTrusted": false}], "constraints": ["http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token"], "instructions": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token"}
65	General	21	UNDER_REVIEW	f	f	f	0	0	0	0	0	0	2026-03-11 11:26:24.216	2026-03-11 11:26:24.216	\N	0	21	2026-03-11 11:26:24.485	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	840	{"goal": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "note": "", "type": "VIDEO", "title": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "isTrusted": false}], "constraints": ["http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token"], "instructions": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token"}
67	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-11 11:37:36.842	2026-03-11 11:37:36.842	\N	0	21	2026-03-11 11:37:37.168	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	3360	{"goal": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "system": {"version": "2.1", "requiresReview": false}, "references": [], "constraints": [], "instructions": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token"}
68	General	21	UNDER_REVIEW	f	f	f	0	0	0	0	0	0	2026-03-11 11:55:15.307	2026-03-11 11:55:15.307	\N	0	21	2026-03-11 11:55:15.632	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	5250	{"goal": "index.html?token=master_demo_token:605 👤 Identity synced: 21xhr on TWITCH", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "note": "", "type": "VIDEO", "title": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "isTrusted": false}], "constraints": ["index.html?token=master_demo_token:605 👤 Identity synced: 21xhr on TWITCH", "index.html?token=master_demo_token:605 👤 Identity synced: 21xhr on TWITCH"], "instructions": "index.html?token=master_demo_token:605 👤 Identity synced: 21xhr on TWITCH"}
69	General	21	UNDER_REVIEW	f	f	f	0	0	0	0	0	0	2026-03-11 12:01:54.443	2026-03-11 12:01:54.443	\N	0	21	2026-03-11 12:01:54.722	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	7560	{"goal": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "note": "", "type": "VIDEO", "title": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "isTrusted": false}], "constraints": [], "instructions": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token"}
70	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-11 12:02:23.374	2026-03-11 12:02:23.374	\N	0	21	2026-03-11 12:02:23.602	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	10290	{"goal": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "system": {"version": "2.1", "requiresReview": false}, "references": [], "constraints": [], "instructions": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token"}
71	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-11 12:03:18.641	2026-03-11 12:03:18.641	\N	0	21	2026-03-11 12:03:18.872	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	13440	{"goal": "reset-form-btn-hint", "system": {"version": "2.1", "requiresReview": false}, "references": [], "constraints": [], "instructions": "reset-form-btn-hint"}
72	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-11 12:07:16.473	2026-03-11 12:07:16.473	\N	0	21	2026-03-11 12:07:16.734	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	17010	{"goal": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "system": {"version": "2.1", "requiresReview": false}, "references": [], "constraints": [], "instructions": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token"}
73	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-11 12:14:56.224	2026-03-11 12:14:56.224	\N	0	21	2026-03-11 12:14:56.539	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	21000	{"goal": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "system": {"version": "2.1", "requiresReview": false}, "references": [], "constraints": [], "instructions": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token"}
74	General	21	UNDER_REVIEW	f	f	f	0	0	0	0	0	0	2026-03-11 14:34:59.27	2026-03-11 14:34:59.27	\N	0	21	2026-03-11 14:34:59.584	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	25410	{"goal": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "note": "", "type": "VIDEO", "title": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "isTrusted": false}], "constraints": [], "instructions": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token"}
75	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-11 14:35:36.135	2026-03-11 14:35:36.135	\N	0	21	2026-03-11 14:35:36.363	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	30240	{"goal": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token", "system": {"version": "2.1", "requiresReview": false}, "references": [], "constraints": [], "instructions": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token"}
\.


--
-- Data for Name: perennial_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."perennial_tokens" ("token_id", "token", "user_id", "platform_id", "platform_name", "is_active", "created_at") FROM stdin;
1	master_demo_token	21	686071308	TWITCH	t	2026-03-10 22:36:20.321
2	test_token_2	2	linked_kick_2	KICK	t	2026-03-10 22:36:20.726
3	test_token_3	3	linked_twitch_3	TWITCH	t	2026-03-10 22:36:21.113
4	test_token_4	4	linked_twitch_4	TWITCH	t	2026-03-10 22:36:21.428
5	test_token_5	5	solo_kick_5	KICK	t	2026-03-10 22:36:21.831
6	test_token_6	6	linked_twitch_6	TWITCH	t	2026-03-10 22:36:22.411
7	test_token_7	7	linked_twitch_7	TWITCH	t	2026-03-10 22:36:22.726
8	test_token_8	8	solo_youtube_8	YOUTUBE	t	2026-03-10 22:36:23.04
9	test_token_9	9	solo_kick_9	KICK	t	2026-03-10 22:36:23.354
10	test_token_10	10	linked_youtube_10	YOUTUBE	t	2026-03-10 22:36:23.669
11	test_token_11	11	solo_youtube_11	YOUTUBE	t	2026-03-10 22:36:23.985
12	test_token_12	12	solo_twitch_12	TWITCH	t	2026-03-10 22:36:24.301
13	test_token_13	13	solo_twitch_13	TWITCH	t	2026-03-10 22:36:24.617
14	test_token_14	14	solo_youtube_14	YOUTUBE	t	2026-03-10 22:36:24.933
15	test_token_15	15	linked_youtube_15	YOUTUBE	t	2026-03-10 22:36:25.249
16	test_token_16	16	solo_twitch_16	TWITCH	t	2026-03-10 22:36:25.564
17	test_token_17	17	solo_twitch_17	TWITCH	t	2026-03-10 22:36:25.878
18	test_token_18	18	linked_kick_18	KICK	t	2026-03-10 22:36:26.192
19	test_token_19	19	linked_youtube_19	YOUTUBE	t	2026-03-10 22:36:26.506
20	test_token_20	20	linked_twitch_20	TWITCH	t	2026-03-10 22:36:26.821
\.


--
-- Data for Name: pushes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."pushes" ("push_id", "challenge_id", "user_id", "cost", "timestamp", "quantity") FROM stdin;
1	49	8	21	2026-03-09 03:14:18.363	1
2	49	12	21	2026-02-17 02:10:38.423	1
3	4	19	21	2026-03-10 04:15:35.514	1
4	2	18	21	2026-03-04 19:55:32.524	1
5	47	17	21	2026-02-24 18:06:26.136	1
6	10	6	105	2026-03-06 14:50:09.788	2
7	59	20	21	2026-02-16 05:31:39.311	1
8	45	18	21	2026-02-10 17:24:03.816	1
9	1	8	21	2026-02-23 06:17:39.192	1
10	55	18	21	2026-02-17 15:08:03.452	1
11	54	20	630	2026-02-25 06:06:34.329	4
12	56	19	21	2026-02-12 12:47:58.771	1
13	57	19	21	2026-02-10 22:42:11.424	1
14	53	18	21	2026-02-23 14:53:58.37	1
15	55	5	630	2026-02-25 19:35:40.733	4
16	51	2	21	2026-02-12 06:55:54.61	1
17	49	18	21	2026-03-05 00:48:16.374	1
18	2	18	84	2026-02-25 20:13:16.07	1
19	2	6	21	2026-03-04 13:22:10.924	1
20	1	16	1911	2026-02-21 16:54:55.795	6
21	57	2	105	2026-03-03 17:05:58.541	2
22	4	20	21	2026-02-18 11:25:41.944	1
23	56	8	21	2026-02-21 14:54:49.353	1
24	50	8	21	2026-02-21 23:21:00.139	1
25	1	19	21	2026-03-01 19:09:53.226	1
26	55	8	21	2026-03-04 20:01:00.091	1
27	3	18	21	2026-02-27 23:34:14.457	1
28	50	18	294	2026-02-26 21:50:19.462	3
29	1	19	84	2026-02-25 22:36:03.181	1
30	47	2	10626	2026-02-18 01:15:38.082	11
31	45	4	21	2026-03-01 14:33:16.238	1
32	2	4	630	2026-02-26 19:18:57.715	4
33	50	4	105	2026-02-16 15:12:20.831	2
34	1	19	189	2026-02-23 09:50:58.455	1
35	49	6	21	2026-02-24 02:36:43.241	1
36	55	2	21	2026-03-03 12:10:34.105	1
37	50	20	21	2026-02-17 00:36:21.46	1
38	3	18	84	2026-02-09 21:12:52.447	1
39	56	20	21	2026-03-07 08:37:51.426	1
40	1	20	21	2026-03-09 21:51:27.317	1
41	43	20	21	2026-02-19 12:56:24.035	1
42	52	6	21	2026-02-19 09:12:22.118	1
43	12	19	21	2026-03-04 12:47:39.123	1
44	3	19	21	2026-02-22 07:52:42.678	1
45	59	19	21	2026-02-21 13:25:44.277	1
46	49	20	21	2026-03-01 15:32:39.972	1
47	6	19	21	2026-03-10 12:48:47.731	1
48	5	18	21	2026-03-05 16:28:57.867	1
49	52	18	21	2026-02-25 20:48:55.861	1
50	50	19	21	2026-03-04 01:03:23.879	1
51	52	20	21	2026-02-25 03:45:39.305	1
52	52	2	21	2026-02-17 21:29:06.579	1
53	3	3	21	2026-03-06 23:47:26.089	1
54	1	19	2646	2026-02-14 07:01:31.559	4
55	1	10	13650	2026-03-03 14:30:20.78	12
56	52	18	1134	2026-02-10 17:40:35.874	4
57	48	19	21	2026-03-08 18:08:15.053	1
58	55	8	5964	2026-02-14 10:51:50.875	8
59	12	6	21	2026-03-09 22:24:15.977	1
60	57	9	21	2026-02-22 14:04:17.549	1
61	45	19	21	2026-02-24 09:06:01.185	1
62	4	2	21	2026-02-09 07:03:15.632	1
63	49	2	630	2026-03-01 20:22:39.373	4
64	53	20	1155	2026-02-20 15:57:57.623	5
65	45	4	84	2026-03-03 10:51:09.182	1
66	2	6	84	2026-02-20 07:17:02.361	1
67	43	20	13629	2026-02-13 03:23:14.705	11
68	52	2	609	2026-02-10 12:18:35.699	3
69	4	10	21	2026-03-03 02:33:50.652	1
70	1	20	84	2026-02-12 07:17:20.822	1
71	11	20	630	2026-03-05 14:30:46.031	4
72	2	19	21	2026-02-22 09:29:46.274	1
73	5	9	21	2026-02-19 02:35:48.01	1
74	55	20	21	2026-02-09 03:03:34.045	1
75	59	18	4284	2026-02-18 02:53:42.228	8
76	59	20	84	2026-02-19 04:19:34.975	1
77	52	13	21	2026-02-12 13:29:48.87	1
78	53	18	1134	2026-02-18 00:53:43.272	4
79	59	20	189	2026-02-17 02:43:00.708	1
80	3	4	21	2026-02-12 09:05:11.167	1
81	43	18	21	2026-03-08 09:40:59.957	1
82	45	19	84	2026-03-01 14:48:16.999	1
83	57	20	21	2026-03-10 21:21:05.372	1
84	48	19	84	2026-03-05 20:18:51.142	1
85	1	3	21	2026-02-15 23:21:24.572	1
86	43	18	84	2026-02-11 18:21:49.707	1
87	47	20	21	2026-02-21 23:41:21.428	1
88	53	19	21	2026-02-13 19:19:15.149	1
89	1	18	21	2026-02-16 14:46:04.005	1
90	52	20	84	2026-02-17 06:30:37.807	1
91	56	9	21	2026-03-07 01:57:23.621	1
92	59	9	21	2026-02-27 15:29:44.406	1
93	3	10	630	2026-02-17 01:10:28.033	4
94	46	4	105	2026-02-18 22:45:41.383	2
95	52	19	294	2026-02-18 16:18:07.031	3
96	4	19	84	2026-02-18 12:11:47.953	1
97	43	8	21	2026-02-27 20:23:33.549	1
98	45	8	105	2026-03-03 19:35:03.084	2
99	56	19	1890	2026-02-25 12:35:06.418	5
100	44	18	21	2026-02-12 07:59:40.981	1
101	2	11	105	2026-03-07 18:54:47.139	2
102	53	8	21	2026-02-27 19:53:08.834	1
103	51	18	21	2026-02-18 22:17:09.944	1
104	6	10	21	2026-03-08 12:03:52.695	1
105	46	10	21	2026-03-01 18:21:22.57	1
106	57	10	105	2026-03-08 01:26:34.144	2
107	49	18	84	2026-03-05 22:59:33.6	1
108	57	11	630	2026-02-25 19:19:44.481	4
109	4	19	1050	2026-02-28 13:03:56.408	3
110	4	11	294	2026-02-20 13:54:08.959	3
111	50	15	21	2026-03-10 09:17:17.498	1
112	52	20	525	2026-02-10 21:30:59.675	2
113	49	18	1050	2026-02-24 08:05:58.772	3
114	43	11	21	2026-03-02 11:08:04.81	1
115	52	5	294	2026-03-07 08:07:17.399	3
116	53	19	84	2026-03-04 01:48:59.41	1
117	54	20	525	2026-02-10 16:36:26.842	1
118	4	10	84	2026-03-02 19:36:56.918	1
119	56	6	21	2026-03-06 18:10:00.483	1
120	49	10	21	2026-02-27 19:14:35.521	1
121	8	2	21	2026-02-14 07:00:11.173	1
122	46	20	1911	2026-02-10 05:00:00.887	6
123	52	20	525	2026-03-08 20:51:17.061	1
124	54	19	21	2026-03-06 00:35:02.191	1
125	54	3	21	2026-02-15 06:40:28.678	1
126	2	8	21	2026-03-07 21:08:47.493	1
127	51	19	21	2026-03-09 16:40:04.595	1
128	5	18	84	2026-02-10 18:04:25.263	1
129	55	6	21	2026-02-26 03:46:35.741	1
130	48	18	21	2026-02-12 20:23:48.137	1
131	56	4	21	2026-02-10 11:06:57.437	1
132	56	11	21	2026-03-01 02:42:52.14	1
133	57	18	21	2026-02-20 22:49:00.042	1
134	3	20	21	2026-02-26 08:29:33.823	1
135	52	18	756	2026-03-05 10:14:58.711	1
136	52	18	4074	2026-02-21 00:45:09.093	3
137	48	19	189	2026-02-20 02:47:08.329	1
138	55	19	21	2026-03-01 00:56:05.354	1
139	54	16	21	2026-02-21 11:12:11.492	1
140	47	19	21	2026-02-27 02:58:43.74	1
141	1	16	1029	2026-03-09 20:01:40.67	1
142	50	6	21	2026-02-23 12:34:21.143	1
143	57	20	10605	2026-02-28 16:20:29.185	10
144	7	10	21	2026-02-17 23:41:52.413	1
145	3	18	189	2026-03-05 19:21:40.571	1
146	59	18	1701	2026-03-01 10:42:05.057	1
147	48	10	21	2026-02-23 13:56:00.343	1
148	57	6	294	2026-02-26 08:54:34.037	3
149	3	4	10605	2026-02-09 04:57:29.542	10
150	3	4	3024	2026-02-18 21:10:50.731	1
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

SELECT pg_catalog.setval('"public"."accounts_account_id_seq"', 37, true);


--
-- Name: challenges_challenge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."challenges_challenge_id_seq"', 75, true);


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

-- \unrestrict zWhWUzPFTMvXPSRJ4bQlRa9KSlVk4PihRKvnRWrdjsTjQQBl40MsQYisWChmb6f

RESET ALL;
