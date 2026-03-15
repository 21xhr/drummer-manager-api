SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict PApgHAuZFeUvGaRhfFLxbgNovbxWCnzBYdn2jkruwmSuuijLjLXCwgzErh03T38

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
1297589f-ba3d-454c-817e-dad78a24de1a	2a09295ce9ddf473cc9047711c7f27128dd755ab7066404dcea8093512b1a93a	2026-03-13 11:55:10.200988+00	20260313115509_add_challenge_last_push_timestamp	\N	\N	2026-03-13 11:55:09.968889+00	1
acc198d2-52dd-4759-8d30-afa5bac112dc	1fe5eaed5657b3428ae48d49c886a61b85aa44404b0edc0a8a59eb3be97d4282	2026-03-13 15:28:06.879166+00	20260313152806_add_challenge_last_activity_timestamp	\N	\N	2026-03-13 15:28:06.630013+00	1
6c09de68-c741-4831-8ad2-76b5cf8c6b00	429b5ab29eafdd16c0a5404c9cf16d55e9be6ad8dbe67a9d95efe26daa736d25	2026-03-14 17:45:29.058824+00	20260314174528_add_proposer_snapshots_to_challenge	\N	\N	2026-03-14 17:45:28.824744+00	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."users" ("user_id", "last_activity_timestamp", "last_live_activity_timestamp", "last_seen_stream_day", "active_offline_days_count", "active_stream_days_count", "daily_challenge_reset_at", "total_numbers_spent_game_wide", "total_challenges_submitted", "total_numbers_returned_from_removals_game_wide", "total_numbers_spent", "total_received_from_removals", "total_removals_executed", "total_digouts_executed", "totalPushesExecuted", "totalDisruptsExecuted", "daily_submission_count", "total_caused_by_removals", "total_to_community_chest", "total_to_pushers", "lastProcessedDay", "lastSeenDay", "last_explorer_deduction") FROM stdin;
7	2026-03-13 11:58:15.221	\N	0	0	0	2026-03-13 21:00:00	0	4	0	12285	0	0	0	9	0	4	0	0	0	0	0	\N
8	2026-03-13 11:58:17.501	\N	0	0	0	2026-03-13 21:00:00	0	4	0	25347	0	0	0	32	0	4	0	0	0	0	0	\N
9	2026-03-13 11:58:19.739	\N	0	0	0	2026-03-13 21:00:00	0	4	0	6321	0	0	0	1	0	4	0	0	0	0	0	\N
10	2026-03-13 11:58:21.939	\N	0	0	0	2026-03-13 21:00:00	0	4	0	6909	0	0	0	12	0	4	0	0	0	0	0	\N
11	2026-03-13 11:58:24.242	\N	0	0	0	2026-03-13 21:00:00	0	4	0	6342	0	0	0	2	0	4	0	0	0	0	0	\N
12	2026-03-13 11:58:26.439	\N	0	0	0	2026-03-13 21:00:00	0	4	0	6321	0	0	0	1	0	4	0	0	0	0	0	\N
13	2026-03-13 11:58:28.624	\N	0	0	0	2026-03-13 21:00:00	0	4	0	6405	0	0	0	2	0	4	0	0	0	0	0	\N
14	2026-03-13 11:58:30.819	\N	0	0	0	2026-03-13 21:00:00	0	4	0	6321	0	0	0	1	0	4	0	0	0	0	0	\N
15	2026-03-13 11:58:33.208	\N	0	0	0	2026-03-13 21:00:00	0	4	0	6321	0	0	0	1	0	4	0	0	0	0	0	\N
16	2026-03-13 11:58:35.387	\N	0	0	0	2026-03-13 21:00:00	0	4	0	6930	0	0	0	4	0	4	0	0	0	0	0	\N
18	\N	\N	0	0	0	2026-03-13 11:57:53.386	0	0	0	14574	0	0	0	50	0	0	0	0	0	0	0	\N
19	\N	\N	0	0	0	2026-03-13 11:57:53.386	0	0	0	7077	0	0	0	34	0	0	0	0	0	0	0	\N
20	\N	\N	0	0	0	2026-03-13 11:57:53.386	0	0	0	30408	0	0	0	63	0	0	0	0	0	0	0	\N
21	2026-03-14 22:57:09.886	\N	0	0	0	2026-03-15 21:00:00	0	2	0	8820	0	0	0	14	0	1	0	0	0	0	0	2026-03-15 18:27:25.7
5	2026-03-13 11:58:10.861	\N	0	0	0	2026-03-13 21:00:00	0	4	0	6300	0	0	0	0	0	4	0	0	0	0	0	\N
1	\N	\N	0	0	0	2026-03-13 11:57:53.386	215208	0	0	0	0	0	0	0	0	0	0	0	0	0	0	\N
17	2026-03-13 11:58:37.031	\N	0	0	0	2026-03-13 21:00:00	0	3	0	2940	0	0	0	0	0	3	0	0	0	0	0	\N
2	2026-03-13 11:58:04.167	\N	0	0	0	2026-03-13 21:00:00	0	4	0	7182	0	0	0	13	0	4	0	0	0	0	0	\N
3	2026-03-13 11:58:06.412	\N	0	0	0	2026-03-13 21:00:00	0	4	0	6363	0	0	0	3	0	4	0	0	0	0	0	\N
4	2026-03-13 11:58:08.586	\N	0	0	0	2026-03-13 21:00:00	0	4	0	16380	0	0	0	26	0	4	0	0	0	0	0	\N
6	2026-03-13 11:58:13.028	\N	0	0	0	2026-03-13 21:00:00	0	4	0	25662	0	0	0	39	0	4	0	0	0	0	0	\N
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."accounts" ("account_id", "user_id", "platform_id", "platform_name", "current_balance", "last_balance_update", "last_activity_timestamp", "last_live_activity_timestamp", "username") FROM stdin;
2	21	53255028	KICK	21000000	\N	\N	\N	21xhr
3	21	dTQg5JKFl-YiPzg0UQdqng	YOUTUBE	21000000	\N	\N	\N	21xhr
5	2	linked_kick_2	KICK	21000000	\N	\N	\N	Duo_KICK_2
7	3	linked_twitch_3	TWITCH	21000000	\N	\N	\N	Duo_TWITCH_3
10	5	linked_kick_5	KICK	21000000	\N	\N	\N	Duo_KICK_5
12	6	linked_kick_6	KICK	21000000	\N	\N	\N	Duo_KICK_6
14	7	linked_kick_7	KICK	21000000	\N	\N	\N	Triple_KICK_7
15	7	linked_twitch_7	TWITCH	21000000	\N	\N	\N	Triple_TWITCH_7
17	8	linked_kick_8	KICK	21000000	\N	\N	\N	Triple_KICK_8
18	8	linked_twitch_8	TWITCH	21000000	\N	\N	\N	Triple_TWITCH_8
20	9	linked_twitch_9	TWITCH	21000000	\N	\N	\N	Duo_TWITCH_9
22	10	linked_kick_10	KICK	21000000	\N	\N	\N	Duo_KICK_10
24	11	linked_kick_11	KICK	21000000	\N	\N	\N	Triple_KICK_11
25	11	linked_youtube_11	YOUTUBE	21000000	\N	\N	\N	Triple_YOUTUBE_11
29	14	linked_youtube_14	YOUTUBE	21000000	\N	\N	\N	Triple_YOUTUBE_14
30	14	linked_twitch_14	TWITCH	21000000	\N	\N	\N	Triple_TWITCH_14
33	16	linked_kick_16	KICK	21000000	\N	\N	\N	Duo_KICK_16
35	17	linked_kick_17	KICK	21000000	\N	\N	\N	Triple_KICK_17
36	17	linked_youtube_17	YOUTUBE	21000000	\N	\N	\N	Triple_YOUTUBE_17
37	18	linked_twitch_18	TWITCH	21000000	\N	\N	\N	Triple_TWITCH_18
38	18	linked_kick_18	KICK	21000000	\N	\N	\N	Triple_KICK_18
39	18	linked_youtube_18	YOUTUBE	21000000	\N	\N	\N	Triple_YOUTUBE_18
40	19	linked_twitch_19	TWITCH	21000000	\N	\N	\N	Duo_TWITCH_19
41	19	linked_kick_19	KICK	21000000	\N	\N	\N	Duo_KICK_19
42	20	solo_twitch_20	TWITCH	21000000	\N	\N	\N	Solo_TWITCH_20
26	12	solo_twitch_12	TWITCH	99996639	\N	\N	\N	Solo_TWITCH_12
4	2	linked_youtube_2	YOUTUBE	99996639	\N	\N	\N	Duo_YOUTUBE_2
1	21	686071308	TWITCH	99999789	\N	2026-03-15 18:31:44.833	\N	21xhr
6	3	linked_youtube_3	YOUTUBE	99996639	\N	\N	\N	Duo_YOUTUBE_3
27	13	solo_youtube_13	YOUTUBE	99996639	\N	\N	\N	Solo_YOUTUBE_13
8	4	solo_youtube_4	YOUTUBE	99996639	\N	\N	\N	Solo_YOUTUBE_4
28	14	linked_kick_14	KICK	99996639	\N	\N	\N	Triple_KICK_14
9	5	linked_youtube_5	YOUTUBE	99996639	\N	\N	\N	Duo_YOUTUBE_5
31	15	solo_twitch_15	TWITCH	99996639	\N	\N	\N	Solo_TWITCH_15
11	6	linked_youtube_6	YOUTUBE	99996639	\N	\N	\N	Duo_YOUTUBE_6
13	7	linked_youtube_7	YOUTUBE	99996639	\N	\N	\N	Triple_YOUTUBE_7
32	16	linked_twitch_16	TWITCH	99996639	\N	\N	\N	Duo_TWITCH_16
16	8	linked_youtube_8	YOUTUBE	99996639	\N	\N	\N	Triple_YOUTUBE_8
34	17	linked_twitch_17	TWITCH	99998109	\N	\N	\N	Triple_TWITCH_17
19	9	linked_kick_9	KICK	99996639	\N	\N	\N	Duo_KICK_9
21	10	linked_youtube_10	YOUTUBE	99996639	\N	\N	\N	Duo_YOUTUBE_10
23	11	linked_twitch_11	TWITCH	99996639	\N	\N	\N	Triple_TWITCH_11
\.


--
-- Data for Name: challenges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."challenges" ("challenge_id", "category", "proposer_user_id", "status", "is_executing", "has_been_auctioned", "has_been_digged_out", "auction_cost", "disrupt_count", "numbers_raised", "total_numbers_spent", "total_push", "stream_days_since_activation", "timestamp_submitted", "timestamp_last_activation", "timestamp_completed", "unique_pusher", "push_base_cost", "current_session_count", "session_start_timestamp", "total_sessions", "duration_type", "failure_reason", "cadence_period_start", "cadence_progress_counter", "cadence_unit", "session_cadence_text", "cadence_required_count", "timestamp_last_session_tick", "submission_cost", "challenge_text", "timestamp_last_push_at", "timestamp_last_stream_day_ticked", "timestamp_last_activity_at", "proposer_platform_name_snapshot", "proposer_username_snapshot") FROM stdin;
2	General	2	ACTIVE	f	f	f	0	0	0	1029	9	0	2026-03-13 11:58:03.087	2026-03-13 11:58:03.087	\N	3	21	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	840	{"goal": "Balance ghost notes and backbeats in a funk pocket.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Clyde_Stubblefield", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}, {"url": "https://open.spotify.com/track/6M6v3Tid69FhO7z3", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["Metronome set to 90bpm", "No cymbals, hi-hat only"], "instructions": "Play a funk groove where your ghost notes are barely audible 'whispers' on the snare, while your backbeats stay crisp and loud. Use the 'tip' of the stick for ghosts and the 'shoulder' for backbeats. Record yourself to ensure the volume gap is wide enough."}	\N	2026-03-13 11:58:03.308	2026-03-13 15:28:06.78	\N	\N
3	General	2	ACTIVE	f	f	f	0	0	0	672	12	3	2026-03-13 11:58:03.626	2026-03-13 11:58:03.626	\N	7	21	0	\N	10	RECURRING	\N	\N	0	DAILY	1 session per day for 10 days	1	\N	1890	{"goal": "Solidify your Jazz Swing Feel and Ride placement.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Elvin_Jones", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}, {"url": "https://www.youtube.com/watch?v=PWBn7uuxSgk", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Feathered kick drum mandatory", "Brushes or light sticks only"], "instructions": "Play the standard 'spang-a-lang' jazz pattern. Keep the ride cymbal dancing and add occasional light snare comping. Try to 'feather' the bass drum on every quarter note so softly that it is felt rather than heard."}	\N	2026-03-13 11:58:03.848	2026-03-13 15:28:06.78	\N	\N
4	General	2	ACTIVE	f	f	f	0	0	0	11802	24	2	2026-03-13 11:58:04.167	2026-03-13 11:58:04.167	\N	7	21	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	3360	{"goal": "Double Stroke Roll speed and consistency (32nd notes).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/stick-control", "note": "", "type": "BOOK", "title": "", "isTrusted": false}, {"url": "https://youtube.com/finger-control-technique", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}], "constraints": ["Must maintain 85bpm minimum", "Practice on a practice pad"], "instructions": "This is a stamina drill. Play continuous 32nd note double strokes for 30 seconds, then rest for 30 seconds. Use the 'Finger Control' method for the second stroke of each double. Start at 80bpm and increase by 5bpm every two minutes."}	\N	2026-03-13 11:58:04.388	2026-03-13 15:28:06.78	\N	\N
20	General	6	ACTIVE	f	f	f	0	0	0	0	0	1	2026-03-13 11:58:13.028	2026-03-13 11:58:13.028	\N	0	21	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	3360	{"goal": "Build endurance for high-velocity metal drumming.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/George_Kollias", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}], "constraints": ["Traditional grip for snare hand optional"], "instructions": "Practice fast, alternating hits between your kick and snare. Focus on staying relaxed so you don't tense up and slow down. Start at 120bpm and aim for stability over speed."}	\N	2026-03-13 11:58:13.248	2026-03-13 15:28:06.78	\N	\N
21	General	7	ACTIVE	f	f	f	0	0	0	0	0	15	2026-03-13 11:58:13.56	2026-03-13 11:58:13.56	\N	0	21	0	\N	7	RECURRING	\N	\N	0	DAILY	1 session per day for 7 days	1	\N	210	{"goal": "Master the 'empty' first beat of reggae (One-Drop).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Carlton_Barrett", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}, {"url": "https://open.spotify.com/track/one-drop-bob-marley", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["Kick only on beat 3", "Cross-stick snare only"], "instructions": "In this style, the kick drum only hits on the 3rd beat. Keep the hi-hats eighth notes steady and the rim-click crisp. Use a cross-stick on the snare for that authentic woody sound."}	\N	2026-03-13 11:58:13.822	2026-03-13 15:28:06.78	\N	\N
22	General	7	ACTIVE	f	f	f	0	0	0	0	0	4	2026-03-13 11:58:14.135	2026-03-13 11:58:14.135	\N	0	21	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	840	{"goal": "Keep a steady 'baion' foot pattern (Bossa Nova).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://open.spotify.com/track/girl-from-ipanema", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["Consistent ride cymbal mandatory"], "instructions": "Keep your feet playing a constant '1... (and) 2' pattern (dotted 8th, 16th) while your hands play syncopated rim-clicks. It requires perfect timing between feet and hands."}	\N	2026-03-13 11:58:14.356	2026-03-13 15:28:06.78	\N	\N
23	General	7	ACTIVE	f	f	f	0	0	0	0	0	4	2026-03-13 11:58:14.678	2026-03-13 11:58:14.678	\N	0	21	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	1890	{"goal": "Create a 'wall of sound' cinematic swell.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/mallet-swells", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Mallets only", "Minimum 30s crescendo"], "instructions": "Use soft mallets to create smooth, atmospheric swells on your cymbals. Build the volume from a whisper to a roar gradually. Focus on the 'wash' of the sound."}	\N	2026-03-13 11:58:14.907	2026-03-13 15:28:06.78	\N	\N
35	General	10	ACTIVE	f	f	f	0	0	0	0	0	14	2026-03-13 11:58:21.384	2026-03-13 11:58:21.384	\N	0	21	0	\N	8	RECURRING	\N	\N	0	CUSTOM_DAYS	2 sessions every 3 days then repeat this 4 times.	2	\N	1890	{"goal": "Build the habit of non-stop creative play.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/flow-state-guided-meditation", "note": "", "type": "AUDIO", "title": "", "isTrusted": false}], "constraints": ["No stopping, no metronome"], "instructions": "Play for 21 minutes without stopping. Don't judge what you play; just keep the flow moving. If you run out of ideas, play a simple beat until a new idea comes."}	\N	2026-03-13 11:58:21.602	2026-03-13 15:28:06.78	\N	\N
5	General	3	ACTIVE	f	f	f	0	0	0	0	0	17	2026-03-13 11:58:04.706	2026-03-13 11:58:04.706	\N	0	21	0	\N	15	RECURRING	\N	\N	0	DAILY	1 session per day for 15 days	1	\N	210	{"goal": "Clean double-tap kick patterns (Heel-Toe).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://youtube.com/heel-toe-technique", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}, {"url": "https://example.com/lever-action-pedals", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Single pedal only", "Heel-up position"], "instructions": "Focus on the 'snap' of the second stroke using the heel-toe technique. Practice rapid double hits on the kick drum. Make sure both hits in the double sound identical in volume and timing."}	\N	2026-03-13 11:58:04.976	2026-03-13 15:28:06.78	\N	\N
6	General	3	ACTIVE	f	f	f	0	0	0	21	1	9	2026-03-13 11:58:05.292	2026-03-13 11:58:05.292	\N	1	21	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	840	{"goal": "Master the foundational 'alphabet' of drumming (N.A.R.D.).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://nard.us.com/N.A.R.D._Rudiments_files/NARD13Essential.pdf", "note": "", "type": "OTHER", "title": "", "isTrusted": false}], "constraints": ["No metronome (Internal clock practice)"], "instructions": "Cycle through the standard rudiments as defined by the National Association of Rudimental Drummers. Focus on 'Open-to-Closed-to-Open' (Slow to Fast to Slow). Pay attention to your stick heights—they should be consistent."}	\N	2026-03-13 11:58:05.514	2026-03-13 15:28:06.78	\N	\N
7	General	3	ACTIVE	f	f	f	0	0	0	252	6	2	2026-03-13 11:58:05.831	2026-03-13 11:58:05.831	\N	4	21	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	1890	{"goal": "Turn human speech patterns into a drum groove.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/podcast-clip-rhythm", "note": "", "type": "AUDIO", "title": "", "isTrusted": false}, {"url": "https://example.com/prosody-percussion", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Blindfolded (Focus on ears)", "Snare only"], "instructions": "Listen to a podcast or a speech. Try to mirror the natural rhythm and 'cadence' of the speaker using your snare and toms. Don't worry about pitch, just the 'prosody' of the speech."}	\N	2026-03-13 11:58:06.052	2026-03-13 15:28:06.78	\N	\N
8	General	3	ACTIVE	f	f	f	0	0	0	21	1	1	2026-03-13 11:58:06.412	2026-03-13 11:58:06.412	\N	1	21	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	3360	{"goal": "Groove along to the rhythm of a news anchor.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://archive.org/broadcast-sample", "note": "", "type": "AUDIO", "title": "", "isTrusted": false}], "constraints": ["Must be a 4/4 time signature"], "instructions": "Turn on a news broadcast. Use the steady, serious rhythm of the anchor's voice as your metronome and build a groove around it. The 'headline' is your snare rhythm, and the 'weather report' is your hi-hat pattern."}	\N	2026-03-13 11:58:06.631	2026-03-13 15:28:06.78	\N	\N
9	General	4	ACTIVE	f	f	f	0	0	0	168	5	1	2026-03-13 11:58:06.945	2026-03-13 11:58:06.945	\N	4	21	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	210	{"goal": "Use your drums to 'soundtrack' a silent movie scene.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://archive.org/silent-films", "note": "", "type": "VIDEO", "title": "", "isTrusted": false}, {"url": "https://example.com/mickey-mousing", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["No cymbals", "Continuous playing for 5 mins"], "instructions": "Watch an old silent film clip. Match your drumming to the physical movements and slapstick timing of the actors on screen. Use different drums to represent different characters."}	\N	2026-03-13 11:58:07.208	2026-03-13 15:28:06.78	\N	\N
12	General	4	ACTIVE	f	f	f	0	0	0	2016	8	2	2026-03-13 11:58:08.586	2026-03-13 11:58:08.586	\N	2	21	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	3360	{"goal": "Improve coordination by taking one limb away.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/limb-independence", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Must maintain consistent hi-hat chick on beats 2 and 4 when not muted"], "instructions": "Play a complex groove, but intentionally 'mute' one limb (like your left foot) for 2 measures every 8, while the others keep going. This builds cognitive independence."}	\N	2026-03-13 11:58:08.804	2026-03-13 15:28:06.78	\N	\N
13	General	5	ACTIVE	f	f	f	0	0	0	0	0	8	2026-03-13 11:58:09.118	2026-03-13 11:58:09.118	\N	0	21	0	\N	7	RECURRING	\N	\N	0	DAILY	1 session per day for 7 days	1	\N	210	{"goal": "Play a rock beat against a Latin clave.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Horacio_Hernandez", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}, {"url": "https://example.com/clave-patterns", "note": "", "type": "BOOK", "title": "", "isTrusted": false}], "constraints": ["Left foot cowbell required"], "instructions": "Keep a standard 4/4 rock beat with your hands while your left foot keeps a 3-2 son clave going on a cowbell sound. Keep the rock beat heavy and the clave steady."}	\N	2026-03-13 11:58:09.47	2026-03-13 15:28:06.78	\N	\N
14	General	5	ACTIVE	f	f	f	0	0	0	0	0	14	2026-03-13 11:58:09.786	2026-03-13 11:58:09.786	\N	0	21	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	840	{"goal": "Balance your kit volume physically, not through tech.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/internal-mixing", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["No post-processing allowed"], "instructions": "Turn off all EQ and compression on your module. Balance the volume of your snare versus your cymbals purely through your physical touch. Record and listen back to check the mix."}	\N	2026-03-13 11:58:10.006	2026-03-13 15:28:06.78	\N	\N
32	General	9	ACTIVE	f	f	f	0	0	0	0	0	4	2026-03-13 11:58:19.739	2026-03-13 11:58:19.739	\N	0	21	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	3360	{"goal": "Practice locking in with a bassist.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://open.spotify.com/track/flea-bass-line", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["No extra kick notes allowed"], "instructions": "Find a 'bass only' track. Make sure every single time the bassist hits a note, your kick drum is hitting exactly with them. Do not play any extra kick notes."}	\N	2026-03-13 11:58:19.959	2026-03-13 15:28:06.78	\N	\N
33	General	10	ACTIVE	f	f	f	0	0	0	0	0	1	2026-03-13 11:58:20.275	2026-03-13 11:58:20.275	\N	0	21	0	\N	7	RECURRING	\N	\N	0	DAILY	7 days of precision	7	\N	210	{"goal": "Play with the perfect timing of a machine.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/industrial-precision", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Must be perfectly on the grid"], "instructions": "Use a dry, clicky kit. Focus on being so 'on the grid' that your hits perfectly overlap with the metronome. This is the opposite of micro-rhythm—it is pure metronomic precision."}	\N	2026-03-13 11:58:20.54	2026-03-13 15:28:06.78	\N	\N
34	General	10	ACTIVE	f	f	f	0	0	0	0	0	4	2026-03-13 11:58:20.851	2026-03-13 11:58:20.851	\N	0	21	0	\N	14	RECURRING	\N	\N	0	DAILY	14 days of control	14	\N	840	{"goal": "Maintain energy and speed at a tiny volume (Whisper Metal).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/pianissimo-control", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Sticks must not rise above 2 inches"], "instructions": "Play an aggressive heavy metal groove (blasts, double kick) as quietly as possible. Maintain the speed, but keep the volume at a 'whisper.' This forces efficiency of motion."}	\N	2026-03-13 11:58:21.069	2026-03-13 15:28:06.78	\N	\N
10	General	4	ACTIVE	f	f	f	0	0	0	609	7	7	2026-03-13 11:58:07.524	2026-03-13 11:58:07.524	\N	3	21	0	\N	4	RECURRING	\N	\N	0	MONTHLY	1 session per month for 4 months	1	\N	840	{"goal": "Improvise a soundtrack to changing natural environments.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://open.spotify.com/playlist/nature-sounds-reference", "note": "", "type": "PLAYLIST", "title": "", "isTrusted": false}], "constraints": ["Use mallets or brushes only", "Minimum 10 minutes per session"], "instructions": "Once a month, select a new nature soundscape (Rainfall, Thunderstorm, Ocean Waves, Forest Wind). Score the environment using appropriate dynamics—soft cymbal washes for rain, heavy toms for thunder."}	\N	2026-03-13 11:58:07.743	2026-03-13 15:28:06.78	\N	\N
11	General	4	ACTIVE	f	f	f	0	0	0	21	1	9	2026-03-13 11:58:08.057	2026-03-13 11:58:08.057	\N	1	21	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	1890	{"goal": "Explore non-traditional sounds on your VAD module.", "system": {"version": "2.1", "requiresReview": false}, "references": [{"url": "https://youtube.com/roland-vad-sound-design", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}], "constraints": ["Must use at least 1 non-instrumental object"], "instructions": "Switch to an industrial or electronic kit. Incorporate at least one 'found sound' or weird FX from the module into a 4/4 groove. This is inspired by industrial and experimental electronic music."}	\N	2026-03-13 11:58:08.275	2026-03-13 15:28:06.78	\N	\N
15	General	5	ACTIVE	f	f	f	0	0	0	0	0	15	2026-03-13 11:58:10.324	2026-03-13 11:58:10.324	\N	0	21	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	1890	{"goal": "Master the legendary half-time shuffle (Purdie Shuffle).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://youtube.com/purdie-shuffle", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}, {"url": "https://open.spotify.com/track/HomeAtLast", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["Must use triplets", "Snare ghost notes required"], "instructions": "Focus on the 'bounce' of the ghost note triplets. It's all about that specific 'lazy' feel that Bernard Purdie is famous for. Listen to 'Home at Last' by Steely Dan for the reference pulse."}	\N	2026-03-13 11:58:10.543	2026-03-13 15:28:06.78	\N	\N
16	General	5	ACTIVE	f	f	f	0	0	0	0	0	16	2026-03-13 11:58:10.861	2026-03-13 11:58:10.861	\N	0	21	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	3360	{"goal": "Make 7/8 feel as natural as 4/4.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://open.spotify.com/track/money-pink-floyd", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["No metronome for the final 5 minutes"], "instructions": "Cycle a 7/8 groove (counting it as 2+2+3). Try to make it feel smooth enough that someone could dance to it. Avoid it feeling 'jagged.'"}	\N	2026-03-13 11:58:11.08	2026-03-13 15:28:06.78	\N	\N
17	General	6	ACTIVE	f	f	f	0	0	0	0	0	5	2026-03-13 11:58:11.391	2026-03-13 11:58:11.391	\N	0	21	0	\N	10	RECURRING	\N	\N	0	DAILY	1 session per day for 10 days	1	\N	210	{"goal": "Make brush sweeps work on electronic drums.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Jeff_Hamilton_(drummer)", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}], "constraints": ["Brushes only", "Tempo under 60bpm"], "instructions": "Use the brush-specific settings on your module. Practice the sweeping motions and 'swirls' used in jazz ballads. Ensure the sensitivity is set correctly to pick up the friction."}	\N	2026-03-13 11:58:11.655	2026-03-13 15:28:06.78	\N	\N
18	General	6	ACTIVE	f	f	f	0	0	0	0	0	14	2026-03-13 11:58:11.967	2026-03-13 11:58:11.967	\N	0	21	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	840	{"goal": "Play patterns where no two notes hit at once (Linear Gadd).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://youtube.com/gadd-linear", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}, {"url": "https://open.spotify.com/track/fifty-ways-leave-lover", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["No unison hits allowed"], "instructions": "Play patterns where the hands and feet follow each other in a line (no simultaneous hits). Practice the K-R-L-K-R-L-R-L pattern. This creates that 'winding' Steve Gadd sound."}	\N	2026-03-13 11:58:12.189	2026-03-13 15:28:06.78	\N	\N
19	General	6	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-13 11:58:12.499	2026-03-13 11:58:12.499	\N	0	21	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	1890	{"goal": "Build independence with 3-against-4 polyrhythms.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/polyrhythm-math", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Kick/Snare must stay on the grid"], "instructions": "Play a steady 4/4 pulse on your kick and snare while your hi-hat (or ride) plays in 3/4. Don't let the counts pull each other off beat. This is a classic brain-splitter."}	\N	2026-03-13 11:58:12.717	2026-03-13 15:28:06.78	\N	\N
24	General	7	ACTIVE	f	f	f	0	0	0	0	0	18	2026-03-13 11:58:15.221	2026-03-13 11:58:15.221	\N	0	21	0	\N	10	RECURRING	\N	\N	0	DAILY	1 session per day for 10 days	1	\N	3360	{"goal": "Master the powerful R-L-K triplet pattern (Bonham).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/John_Bonham", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}, {"url": "https://youtube.com/bonham-triplets", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}], "constraints": ["Must maintain consistent volume across hands and feet"], "instructions": "Practice the 'galloping' triplet (Right Hand, Left Hand, Kick). Focus on power and making the transition from hands to feet seamless. Speed it up until it sounds like a single instrument."}	\N	2026-03-13 11:58:15.443	2026-03-13 15:28:06.78	\N	\N
25	General	8	ACTIVE	f	f	f	0	0	0	0	0	7	2026-03-13 11:58:15.763	2026-03-13 11:58:15.763	\N	0	21	0	\N	5	RECURRING	\N	\N	0	DAILY	1 session per day for 5 days	1	\N	210	{"goal": "Test your timing by shifting the 'click'.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/internal-clock-theory", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Start at 60bpm", "Record and check if you 'flipped' back"], "instructions": "Set your metronome to a steady pulse, but treat the click as the 'and' (the upbeat). Your goal is to keep a groove where your main beats land in the silences. This will feel like the metronome is fighting you."}	\N	2026-03-13 11:58:16.026	2026-03-13 15:28:06.78	\N	\N
26	General	8	ACTIVE	f	f	f	0	0	0	0	0	6	2026-03-13 11:58:16.38	2026-03-13 11:58:16.38	\N	0	21	0	\N	10	RECURRING	\N	\N	0	DAILY	10 days of hats	10	\N	840	{"goal": "Master the fast hi-hat 'zips' (Trap Rolls).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://open.spotify.com/playlist/trap-drums-reference", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["Single hand for hi-hat only"], "instructions": "Practice 16th and 32nd note triplets on the hi-hat using one hand. Use your fingers to get that rapid-fire speed. Incorporate bursts and rolls found in trap music."}	\N	2026-03-13 11:58:16.601	2026-03-13 15:28:06.78	\N	\N
27	General	8	ACTIVE	f	f	f	0	0	0	0	0	7	2026-03-13 11:58:16.919	2026-03-13 11:58:16.919	\N	0	21	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	1890	{"goal": "Build a catchy groove without using snare or cymbals.", "system": {"version": "2.1", "requiresReview": false}, "references": [{"url": "https://youtube.com/tribal-tom-grooves", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}], "constraints": ["Absolutely no snare drum", "No cymbals"], "instructions": "Switch to a tom-heavy kit. You aren't allowed to use the snare—create the entire groove using just the toms and the kick. Use the toms as melodic voices."}	\N	2026-03-13 11:58:17.184	2026-03-13 15:28:06.78	\N	\N
28	General	8	ACTIVE	f	f	f	0	0	0	0	0	9	2026-03-13 11:58:17.501	2026-03-13 11:58:17.501	\N	0	21	0	\N	12	RECURRING	\N	\N	0	WEEKLY	3 sessions per week for 4 weeks	3	\N	3360	{"goal": "Fluidly blend visual flair with consistent timing.", "system": {"version": "2.1", "requiresReview": false}, "references": [{"url": "https://www.youtube.com/watch?v=MkK8qACn6xs", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}], "constraints": ["Must maintain consistent 2/4 backbeat"], "instructions": "Practice backsticking, twirls, or crossovers while maintaining a simple 2 and 4 backbeat. The trick must not interrupt the groove or tempo. Rotate through different tricks each session."}	\N	2026-03-13 11:58:17.764	2026-03-13 15:28:06.78	\N	\N
29	General	9	ACTIVE	f	f	f	0	0	0	0	0	19	2026-03-13 11:58:18.082	2026-03-13 11:58:18.082	\N	0	21	0	\N	14	RECURRING	\N	\N	0	DAILY	14 days of fills	14	\N	210	{"goal": "Use the R-L-R-R-L-L rudiment in a drum fill.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/paradiddle-diddle-notation", "note": "", "type": "OTHER", "title": "", "isTrusted": false}], "constraints": ["Focus on even stick heights"], "instructions": "Practice the paradiddle-diddle moving across the toms. It’s a great way to move quickly without crossing your arms. Focus on even stick heights and making it sound fluid."}	\N	2026-03-13 11:58:18.349	2026-03-13 15:28:06.78	\N	\N
30	General	9	ACTIVE	f	f	f	0	0	0	0	0	17	2026-03-13 11:58:18.665	2026-03-13 11:58:18.665	\N	0	21	0	\N	7	RECURRING	\N	\N	0	DAILY	7 days of funk	7	\N	840	{"goal": "Master the 'heavy' funk pocket (Half-Time).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Questlove", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}], "constraints": ["Slightly behind the beat (laid back)"], "instructions": "Play a funk groove but drop the snare backbeat to the '3.' Focus on making it feel deep and groovy. This creates a massive amount of 'air' in the beat."}	\N	2026-03-13 11:58:18.885	2026-03-13 15:28:06.78	\N	\N
31	General	9	ACTIVE	f	f	f	0	0	0	0	0	15	2026-03-13 11:58:19.201	2026-03-13 11:58:19.201	\N	0	21	0	\N	21	RECURRING	\N	\N	0	DAILY	21 days of double kick	21	\N	1890	{"goal": "Build sprinting speed with your feet.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/muscle-fatigue-management", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Must maintain for 60 seconds without stopping"], "instructions": "Set a timer for 1 minute and play steady 16th notes on the double kick. Focus on keeping both feet sounding identical. If you break rhythm, stop and restart."}	\N	2026-03-13 11:58:19.422	2026-03-13 15:28:06.78	\N	\N
36	General	10	ACTIVE	f	f	f	0	0	0	0	0	7	2026-03-13 11:58:21.939	2026-03-13 11:58:21.939	\N	0	21	0	\N	7	RECURRING	\N	\N	0	DAILY	7 days of ghost notes	7	\N	3360	{"goal": "Add busy-ness to a beat using quiet taps (Syncopation).", "system": {"version": "2.1", "requiresReview": false}, "references": [{"url": "https://youtube.com/ghost-note-masterclass", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}], "constraints": ["Main backbeat must stay consistent"], "instructions": "Play a 16th note linear pattern where the snare ghost notes only occur on the 'e' and 'a' of the beat. This creates a complex, rolling texture."}	\N	2026-03-13 11:58:22.157	2026-03-13 15:28:06.78	\N	\N
37	General	11	ACTIVE	f	f	f	0	0	0	0	0	13	2026-03-13 11:58:22.587	2026-03-13 11:58:22.587	\N	0	21	0	\N	21	RECURRING	\N	\N	0	DAILY	21 days of sprints	21	\N	210	{"goal": "Practice quick foot sprints for metal (Double Kick).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/fast-twitch-activation", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Maximum speed during bursts"], "instructions": "Play 5-second bursts of maximum speed 16th notes on the kick, then 5 seconds of rest. Repeat for the session. This builds 'fast twitch' muscle response."}	\N	2026-03-13 11:58:22.849	2026-03-13 15:28:06.78	\N	\N
38	General	11	ACTIVE	f	f	f	0	0	0	21	1	12	2026-03-13 11:58:23.173	2026-03-13 11:58:23.173	\N	0	21	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	840	{"goal": "Match the 'length' of the notes with a bassist.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/musical-sustain", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Must use at least 2 different types of cymbal sustain"], "instructions": "Listen to a bass track. Short bass notes = short kick drum hits. Long bass notes = open cymbal hits. You are mimicking the 'sustain' of a melodic instrument."}	2026-03-13 12:30:19.357	2026-03-13 11:58:23.392	2026-03-13 15:28:06.78	\N	\N
40	General	11	ACTIVE	f	f	f	0	0	0	0	0	14	2026-03-13 11:58:24.242	2026-03-13 11:58:24.242	\N	0	21	0	\N	14	RECURRING	\N	\N	0	DAILY	14 days of stealth speed	14	\N	3360	{"goal": "Build speed using fingers by limiting stick height.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Derek_Roddy", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}], "constraints": ["No arm movement allowed"], "instructions": "Play a fast metal groove but don't let your sticks go more than an inch off the drum. This relies entirely on finger control and wrist snap rather than arm movement."}	\N	2026-03-13 11:58:24.462	2026-03-13 15:28:06.78	\N	\N
41	General	12	ACTIVE	f	f	f	0	0	0	0	0	15	2026-03-13 11:58:24.781	2026-03-13 11:58:24.781	\N	0	21	0	\N	12	RECURRING	\N	\N	0	WEEKLY	3 sessions per week for 4 weeks	3	\N	210	{"goal": "Master high-tempo breakbeats and smooth ghost notes.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://open.spotify.com/track/amen-break-original", "note": "", "type": "SONG", "title": "", "isTrusted": false}, {"url": "https://example.com/dnb-mechanics", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Tempo must stay above 165bpm"], "instructions": "Progress from the foundational 'Amen Break' to atmospheric, flowing grooves with snare hits that 'dance' around the main beat. Aim for high speed (175bpm+) endurance."}	\N	2026-03-13 11:58:25.048	2026-03-13 15:28:06.78	\N	\N
39	General	11	ACTIVE	f	f	f	0	0	0	8085	10	2	2026-03-13 11:58:23.704	2026-03-13 11:58:23.704	\N	0	21	0	\N	7	RECURRING	\N	\N	0	DAILY	7 days of unison	7	\N	1890	{"goal": "Make your hands and feet sound like one engine.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/vertical-alignment", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Record and listen for unison accuracy"], "instructions": "Focus on the 'unison' of your hits. Your kick and snare should hit at the exact same time so they sound like one powerful instrument. Eliminate all 'flams' between limbs."}	2026-03-13 12:23:02.261	2026-03-13 11:58:23.922	2026-03-13 15:28:06.78	\N	\N
43	General	12	COMPLETED	f	f	f	0	0	0	1092	12	20	2026-03-13 11:58:25.903	2026-03-13 11:58:25.903	2026-03-13 11:58:26.392	6	21	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	1890	{"goal": "[DIVERSIFIED] Master the Moeller 'whip' technique for effortless power.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://www.youtube.com/watch?v=Zj3-Lc7UWwg", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}, {"url": "https://en.wikipedia.org/wiki/Moeller_method", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["No rimshots allowed", "Must use matched grip"], "instructions": "Practice your Moeller strokes using alternating accents. Focus on the whip-like motion of the wrist and let the stick bounce naturally rather than gripping it tight. Your hand should feel like a wet towel being snapped. Focus on staying completely relaxed."}	\N	2026-03-13 11:58:26.124	2026-03-13 15:28:06.78	\N	\N
44	General	12	IN_PROGRESS	f	f	f	0	0	0	2982	17	14	2026-03-13 11:58:26.439	2026-03-13 11:58:26.439	\N	6	21	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	3360	{"goal": "[DIVERSIFIED] Balance ghost notes and backbeats in a funk pocket.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Clyde_Stubblefield", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}, {"url": "https://open.spotify.com/track/6M6v3Tid69FhO7z3", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["Metronome set to 90bpm", "No cymbals, hi-hat only"], "instructions": "Play a funk groove where your ghost notes are barely audible 'whispers' on the snare, while your backbeats stay crisp and loud. Use the 'tip' of the stick for ghosts and the 'shoulder' for backbeats. Record yourself to ensure the volume gap is wide enough."}	\N	2026-03-13 11:58:26.659	2026-03-13 15:28:06.78	\N	\N
42	General	12	ACTIVE	f	f	f	0	0	0	294	3	18	2026-03-13 11:58:25.366	2026-03-13 11:58:25.366	\N	0	21	0	\N	7	RECURRING	\N	\N	0	DAILY	7 days	7	\N	840	{"goal": "Mastering Micro-Timing and Rhythmic Nuance.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://www.confidentdrummer.com/what-are-micro-rhythms-and-micro-timing-and-why-they-matter", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}, {"url": "https://www.youtube.com/@LofiGirl", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}, {"url": "https://en.wikipedia.org/wiki/J_Dilla", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}], "constraints": ["Use a high-pitch cowbell click for Phase 1", "Record sessions and compare the 'offset' of each hit"], "instructions": "Go beyond the rigid grid of western notation by exploring micro-rhythms—intentional deviations and subtleties that notation cannot accurately represent. \\n\\n- **Phase 1 (Sessions 1-3)**: Develop 'The Grid vs. The Feel'. Practice playing 'behind' and 'ahead' of a high-pitched cowbell click. Focus on the consistent space between the click and your strike. \\n- **Phase 2 (Sessions 4-6)**: Study the 'Unquantized Swing'. Play along to classic tracks by J Dilla or D'Angelo (e.g., 'Untitled'). Focus on the 'late' snare and 'drunken' kick placement that creates a human pocket. \\n- **Phase 3 (Session 7)**: Modern Lofi Application. Drum along to a lofi hip-hop stream. Incorporate everything learned to create a laid-back, personal 'feel' that flows with the unquantized samples."}	2026-03-14 15:44:11.904	2026-03-13 11:58:25.586	2026-03-14 15:44:11.904	\N	\N
46	General	13	ARCHIVED	f	f	f	0	0	0	63	3	21	2026-03-13 11:58:27.556	2026-03-13 11:58:27.556	\N	3	21	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	840	{"goal": "[DIVERSIFIED] Double Stroke Roll speed and consistency (32nd notes).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/stick-control", "note": "", "type": "BOOK", "title": "", "isTrusted": false}, {"url": "https://youtube.com/finger-control-technique", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}], "constraints": ["Must maintain 85bpm minimum", "Practice on a practice pad"], "instructions": "This is a stamina drill. Play continuous 32nd note double strokes for 30 seconds, then rest for 30 seconds. Use the 'Finger Control' method for the second stroke of each double. Start at 80bpm and increase by 5bpm every two minutes."}	\N	2026-03-13 11:58:27.776	2026-03-13 15:28:06.78	\N	\N
47	General	13	FAILED	f	f	f	0	0	0	6930	19	18	2026-03-13 11:58:28.09	2026-03-13 11:58:28.09	\N	5	21	0	\N	15	RECURRING	Insufficient execution consistency across sessions.	\N	0	DAILY	1 session per day for 15 days	1	\N	1890	{"goal": "[DIVERSIFIED] Clean double-tap kick patterns (Heel-Toe).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://youtube.com/heel-toe-technique", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}, {"url": "https://example.com/lever-action-pedals", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Single pedal only", "Heel-up position"], "instructions": "Focus on the 'snap' of the second stroke using the heel-toe technique. Practice rapid double hits on the kick drum. Make sure both hits in the double sound identical in volume and timing."}	\N	2026-03-13 11:58:28.311	2026-03-13 15:28:06.78	\N	\N
48	General	13	IN_PROGRESS	f	f	f	0	0	0	10689	14	10	2026-03-13 11:58:28.624	2026-03-13 11:58:28.624	\N	4	21	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	3360	{"goal": "[DIVERSIFIED] Master the foundational 'alphabet' of drumming (N.A.R.D.).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://nard.us.com/N.A.R.D._Rudiments_files/NARD13Essential.pdf", "note": "", "type": "OTHER", "title": "", "isTrusted": false}], "constraints": ["No metronome (Internal clock practice)"], "instructions": "Cycle through the standard rudiments as defined by the National Association of Rudimental Drummers. Focus on 'Open-to-Closed-to-Open' (Slow to Fast to Slow). Pay attention to your stick heights—they should be consistent."}	\N	2026-03-13 11:58:28.843	2026-03-13 15:28:06.78	\N	\N
49	General	14	ARCHIVED	f	f	f	0	0	0	357	6	21	2026-03-13 11:58:29.166	2026-03-13 11:58:29.166	\N	4	21	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	210	{"goal": "[DIVERSIFIED] Turn human speech patterns into a drum groove.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/podcast-clip-rhythm", "note": "", "type": "AUDIO", "title": "", "isTrusted": false}, {"url": "https://example.com/prosody-percussion", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Blindfolded (Focus on ears)", "Snare only"], "instructions": "Listen to a podcast or a speech. Try to mirror the natural rhythm and 'cadence' of the speaker using your snare and toms. Don't worry about pitch, just the 'prosody' of the speech."}	\N	2026-03-13 11:58:29.431	2026-03-13 15:28:06.78	\N	\N
50	General	14	IN_PROGRESS	f	f	f	0	0	0	4326	17	5	2026-03-13 11:58:29.747	2026-03-13 11:58:29.747	\N	5	21	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	840	{"goal": "[DIVERSIFIED] Groove along to the rhythm of a news anchor.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://archive.org/broadcast-sample", "note": "", "type": "AUDIO", "title": "", "isTrusted": false}], "constraints": ["Must be a 4/4 time signature"], "instructions": "Turn on a news broadcast. Use the steady, serious rhythm of the anchor's voice as your metronome and build a groove around it. The 'headline' is your snare rhythm, and the 'weather report' is your hi-hat pattern."}	\N	2026-03-13 11:58:29.967	2026-03-13 15:28:06.78	\N	\N
51	General	14	ARCHIVED	f	f	f	0	0	0	9366	19	21	2026-03-13 11:58:30.282	2026-03-13 11:58:30.282	\N	4	21	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	1890	{"goal": "[DIVERSIFIED] Use your drums to 'soundtrack' a silent movie scene.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://archive.org/silent-films", "note": "", "type": "VIDEO", "title": "", "isTrusted": false}, {"url": "https://example.com/mickey-mousing", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["No cymbals", "Continuous playing for 5 mins"], "instructions": "Watch an old silent film clip. Match your drumming to the physical movements and slapstick timing of the actors on screen. Use different drums to represent different characters."}	\N	2026-03-13 11:58:30.505	2026-03-13 15:28:06.78	\N	\N
52	General	14	FAILED	f	f	f	0	0	0	0	0	13	2026-03-13 11:58:30.819	2026-03-13 11:58:30.819	\N	0	21	0	\N	4	RECURRING	Challenge was abandoned before completion.	\N	0	MONTHLY	1 session per month for 4 months	1	\N	3360	{"goal": "[DIVERSIFIED] Improvise a soundtrack to changing natural environments.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://open.spotify.com/playlist/nature-sounds-reference", "note": "", "type": "PLAYLIST", "title": "", "isTrusted": false}], "constraints": ["Use mallets or brushes only", "Minimum 10 minutes per session"], "instructions": "Once a month, select a new nature soundscape (Rainfall, Thunderstorm, Ocean Waves, Forest Wind). Score the environment using appropriate dynamics—soft cymbal washes for rain, heavy toms for thunder."}	\N	2026-03-13 11:58:31.078	2026-03-13 15:28:06.78	\N	\N
45	General	13	COMPLETED	f	f	f	0	0	0	378	7	19	2026-03-13 11:58:26.972	2026-03-13 11:58:26.972	2026-03-13 11:58:27.507	5	21	0	\N	10	RECURRING	\N	\N	0	DAILY	1 session per day for 10 days	1	\N	210	{"goal": "[DIVERSIFIED] Solidify your Jazz Swing Feel and Ride placement.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Elvin_Jones", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}, {"url": "https://www.youtube.com/watch?v=PWBn7uuxSgk", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Feathered kick drum mandatory", "Brushes or light sticks only"], "instructions": "Play the standard 'spang-a-lang' jazz pattern. Keep the ride cymbal dancing and add occasional light snare comping. Try to 'feather' the bass drum on every quarter note so softly that it is felt rather than heard."}	\N	2026-03-13 11:58:27.236	2026-03-13 15:28:06.78	\N	\N
53	General	15	ARCHIVED	f	f	f	0	0	0	0	0	21	2026-03-13 11:58:31.476	2026-03-13 11:58:31.476	\N	0	21	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	210	{"goal": "[DIVERSIFIED] Explore non-traditional sounds on your VAD module.", "system": {"version": "2.1", "requiresReview": false}, "references": [{"url": "https://youtube.com/roland-vad-sound-design", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}], "constraints": ["Must use at least 1 non-instrumental object"], "instructions": "Switch to an industrial or electronic kit. Incorporate at least one 'found sound' or weird FX from the module into a 4/4 groove. This is inspired by industrial and experimental electronic music."}	\N	2026-03-13 11:58:31.737	2026-03-13 15:28:06.78	\N	\N
55	General	15	COMPLETED	f	f	f	0	0	0	0	0	19	2026-03-13 11:58:32.635	2026-03-13 11:58:32.635	2026-03-13 11:58:33.162	0	21	0	\N	7	RECURRING	\N	\N	0	DAILY	1 session per day for 7 days	1	\N	1890	{"goal": "[DIVERSIFIED] Play a rock beat against a Latin clave.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Horacio_Hernandez", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}, {"url": "https://example.com/clave-patterns", "note": "", "type": "BOOK", "title": "", "isTrusted": false}], "constraints": ["Left foot cowbell required"], "instructions": "Keep a standard 4/4 rock beat with your hands while your left foot keeps a 3-2 son clave going on a cowbell sound. Keep the rock beat heavy and the clave steady."}	\N	2026-03-13 11:58:32.896	2026-03-13 15:28:06.78	\N	\N
56	General	15	COMPLETED	f	f	f	0	0	0	0	0	13	2026-03-13 11:58:33.208	2026-03-13 11:58:33.208	2026-03-13 11:58:33.696	0	21	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	3360	{"goal": "[DIVERSIFIED] Balance your kit volume physically, not through tech.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/internal-mixing", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["No post-processing allowed"], "instructions": "Turn off all EQ and compression on your module. Balance the volume of your snare versus your cymbals purely through your physical touch. Record and listen back to check the mix."}	\N	2026-03-13 11:58:33.428	2026-03-13 15:28:06.78	\N	\N
54	General	15	ARCHIVED	f	f	f	0	0	0	21	1	21	2026-03-13 11:58:32.058	2026-03-13 11:58:32.058	\N	1	21	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	840	{"goal": "[DIVERSIFIED] Improve coordination by taking one limb away.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/limb-independence", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Must maintain consistent hi-hat chick on beats 2 and 4 when not muted"], "instructions": "Play a complex groove, but intentionally 'mute' one limb (like your left foot) for 2 measures every 8, while the others keep going. This builds cognitive independence."}	\N	2026-03-13 11:58:32.325	2026-03-13 15:28:06.78	\N	\N
57	General	16	REMOVED	f	f	f	0	0	0	29820	42	14	2026-03-13 11:58:33.742	2026-03-13 11:58:33.742	\N	8	21	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	210	{"goal": "[DIVERSIFIED] Master the legendary half-time shuffle (Purdie Shuffle).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://youtube.com/purdie-shuffle", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}, {"url": "https://open.spotify.com/track/HomeAtLast", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["Must use triplets", "Snare ghost notes required"], "instructions": "Focus on the 'bounce' of the ghost note triplets. It's all about that specific 'lazy' feel that Bernard Purdie is famous for. Listen to 'Home at Last' by Steely Dan for the reference pulse."}	\N	2026-03-13 11:58:34.003	2026-03-13 15:28:06.78	\N	\N
59	General	16	FAILED	f	f	f	0	0	0	0	0	3	2026-03-13 11:58:34.846	2026-03-13 11:58:34.846	\N	0	21	0	\N	10	RECURRING	Constraints were repeatedly broken during execution.	\N	0	DAILY	1 session per day for 10 days	1	\N	1890	{"goal": "[DIVERSIFIED] Make brush sweeps work on electronic drums.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Jeff_Hamilton_(drummer)", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}], "constraints": ["Brushes only", "Tempo under 60bpm"], "instructions": "Use the brush-specific settings on your module. Practice the sweeping motions and 'swirls' used in jazz ballads. Ensure the sensitivity is set correctly to pick up the friction."}	\N	2026-03-13 11:58:35.066	2026-03-13 15:28:06.78	\N	\N
60	General	16	IN_PROGRESS	f	f	f	0	0	0	0	0	19	2026-03-13 11:58:35.387	2026-03-13 11:58:35.387	\N	0	21	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	3360	{"goal": "[DIVERSIFIED] Play patterns where no two notes hit at once (Linear Gadd).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://youtube.com/gadd-linear", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}, {"url": "https://open.spotify.com/track/fifty-ways-leave-lover", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["No unison hits allowed"], "instructions": "Play patterns where the hands and feet follow each other in a line (no simultaneous hits). Practice the K-R-L-K-R-L-R-L pattern. This creates that 'winding' Steve Gadd sound."}	\N	2026-03-13 11:58:35.608	2026-03-13 15:28:06.78	\N	\N
62	General	17	COMPLETED	f	f	f	0	0	0	0	0	5	2026-03-13 11:58:36.5	2026-03-13 11:58:36.5	2026-03-13 11:58:36.985	0	21	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	840	{"goal": "[DIVERSIFIED] Build endurance for high-velocity metal drumming.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/George_Kollias", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}], "constraints": ["Traditional grip for snare hand optional"], "instructions": "Practice fast, alternating hits between your kick and snare. Focus on staying relaxed so you don't tense up and slow down. Start at 120bpm and aim for stability over speed."}	\N	2026-03-13 11:58:36.719	2026-03-13 15:28:06.78	\N	\N
58	General	16	AUCTIONED	f	f	f	0	0	0	1869	13	7	2026-03-13 11:58:34.317	2026-03-13 11:58:34.317	\N	6	21	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	840	{"goal": "[DIVERSIFIED] Make 7/8 feel as natural as 4/4.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://open.spotify.com/track/money-pink-floyd", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["No metronome for the final 5 minutes"], "instructions": "Cycle a 7/8 groove (counting it as 2+2+3). Try to make it feel smooth enough that someone could dance to it. Avoid it feeling 'jagged.'"}	\N	2026-03-13 11:58:34.535	2026-03-13 15:28:06.78	\N	\N
61	General	17	REMOVED	f	f	f	0	0	0	13566	32	4	2026-03-13 11:58:35.919	2026-03-13 11:58:35.919	\N	8	21	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	210	{"goal": "[DIVERSIFIED] Build independence with 3-against-4 polyrhythms.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://example.com/polyrhythm-math", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["Kick/Snare must stay on the grid"], "instructions": "Play a steady 4/4 pulse on your kick and snare while your hi-hat (or ride) plays in 3/4. Don't let the counts pull each other off beat. This is a classic brain-splitter."}	\N	2026-03-13 11:58:36.182	2026-03-13 15:28:06.78	\N	\N
63	General	17	IN_PROGRESS	f	f	f	0	0	0	0	0	15	2026-03-13 11:58:37.031	2026-03-13 11:58:37.031	\N	0	21	0	\N	7	RECURRING	\N	\N	0	DAILY	1 session per day for 7 days	1	\N	1890	{"goal": "[DIVERSIFIED] Master the 'empty' first beat of reggae (One-Drop).", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://en.wikipedia.org/wiki/Carlton_Barrett", "note": "", "type": "MUSICIAN", "title": "", "isTrusted": false}, {"url": "https://open.spotify.com/track/one-drop-bob-marley", "note": "", "type": "SONG", "title": "", "isTrusted": false}], "constraints": ["Kick only on beat 3", "Cross-stick snare only"], "instructions": "In this style, the kick drum only hits on the 3rd beat. Keep the hi-hats eighth notes steady and the rim-click crisp. Use a cross-stick on the snare for that authentic woody sound."}	\N	2026-03-13 11:58:37.249	2026-03-13 15:28:06.78	\N	\N
1	General	2	ACTIVE	f	f	f	0	0	0	10878	17	12	2026-03-13 11:58:01.432	2026-03-13 11:58:01.432	\N	5	21	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	210	{"goal": "Master the Moeller 'whip' technique for effortless power.", "system": {"version": "2.1", "requiresReview": true}, "references": [{"url": "https://www.youtube.com/watch?v=Zj3-Lc7UWwg", "note": "", "type": "VIDEO", "title": "", "isTrusted": true}, {"url": "https://en.wikipedia.org/wiki/Moeller_method", "note": "", "type": "CONCEPT", "title": "", "isTrusted": false}], "constraints": ["No rimshots allowed", "Must use matched grip"], "instructions": "Practice your Moeller strokes using alternating accents. Focus on the whip-like motion of the wrist and let the stick bounce naturally rather than gripping it tight. Your hand should feel like a wet towel being snapped. Focus on staying completely relaxed."}	\N	2026-03-13 11:58:02.498	2026-03-13 15:28:06.78	\N	\N
64	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-13 18:19:45.667	2026-03-13 18:19:45.667	\N	0	21	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	210	{"goal": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token#", "system": {"version": "2.1", "requiresReview": false}, "references": [], "constraints": [], "instructions": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token#"}	\N	2026-03-13 18:19:45.93	2026-03-13 18:19:45.667	\N	\N
65	General	21	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-14 22:57:09.886	2026-03-14 22:57:09.886	\N	0	21	0	\N	1	ONE_OFF	\N	\N	0	\N	\N	\N	\N	210	{"goal": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token#", "system": {"version": "2.1", "requiresReview": false}, "references": [], "constraints": ["http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token#"], "instructions": "http://192.168.1.37:5500/challengesubmitform/index.html?token=master_demo_token#"}	\N	2026-03-14 22:57:10.544	2026-03-14 22:57:09.886	TWITCH	21xhr
\.


--
-- Data for Name: perennial_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."perennial_tokens" ("token_id", "token", "user_id", "platform_id", "platform_name", "is_active", "created_at") FROM stdin;
1	master_demo_token	21	686071308	TWITCH	t	2026-03-13 11:57:53.841
2	test_token_2	2	linked_youtube_2	YOUTUBE	t	2026-03-13 11:57:54.29
3	test_token_3	3	linked_youtube_3	YOUTUBE	t	2026-03-13 11:57:54.606
4	test_token_4	4	solo_youtube_4	YOUTUBE	t	2026-03-13 11:57:54.965
5	test_token_5	5	linked_youtube_5	YOUTUBE	t	2026-03-13 11:57:55.282
6	test_token_6	6	linked_youtube_6	YOUTUBE	t	2026-03-13 11:57:55.596
7	test_token_7	7	linked_youtube_7	YOUTUBE	t	2026-03-13 11:57:55.907
8	test_token_8	8	linked_youtube_8	YOUTUBE	t	2026-03-13 11:57:56.221
9	test_token_9	9	linked_kick_9	KICK	t	2026-03-13 11:57:56.534
10	test_token_10	10	linked_youtube_10	YOUTUBE	t	2026-03-13 11:57:56.846
11	test_token_11	11	linked_twitch_11	TWITCH	t	2026-03-13 11:57:57.161
12	test_token_12	12	solo_twitch_12	TWITCH	t	2026-03-13 11:57:57.473
13	test_token_13	13	solo_youtube_13	YOUTUBE	t	2026-03-13 11:57:57.785
14	test_token_14	14	linked_kick_14	KICK	t	2026-03-13 11:57:58.103
15	test_token_15	15	solo_twitch_15	TWITCH	t	2026-03-13 11:57:58.416
16	test_token_16	16	linked_twitch_16	TWITCH	t	2026-03-13 11:57:58.728
17	test_token_17	17	linked_twitch_17	TWITCH	t	2026-03-13 11:57:59.042
18	test_token_18	18	linked_twitch_18	TWITCH	t	2026-03-13 11:57:59.355
19	test_token_19	19	linked_twitch_19	TWITCH	t	2026-03-13 11:57:59.671
20	test_token_20	20	solo_twitch_20	TWITCH	t	2026-03-13 11:57:59.99
\.


--
-- Data for Name: pushes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."pushes" ("push_id", "challenge_id", "user_id", "cost", "timestamp", "quantity") FROM stdin;
1	3	20	105	2026-03-11 04:39:35.632	2
2	48	20	630	2026-02-27 11:57:27.642	4
3	45	6	21	2026-03-03 05:44:45.898	1
4	50	19	630	2026-02-20 17:30:09.5	4
5	6	19	21	2026-03-02 19:01:21.077	1
6	44	6	1155	2026-02-17 14:05:13.1	5
7	48	4	21	2026-02-28 16:31:20.312	1
8	11	2	21	2026-03-13 01:45:41.817	1
9	57	18	630	2026-03-08 12:36:41.395	4
10	50	18	21	2026-03-12 20:14:31.102	1
11	48	18	21	2026-03-01 18:47:39.935	1
12	61	13	105	2026-02-13 11:36:18.858	2
13	4	2	21	2026-02-19 12:03:40.36	1
14	3	6	21	2026-02-15 11:20:14.973	1
15	58	20	630	2026-02-17 00:28:33.311	4
16	7	20	21	2026-03-01 19:14:09.929	1
17	61	20	21	2026-02-13 19:25:30.256	1
18	43	18	105	2026-03-08 07:55:23.26	2
19	46	2	21	2026-03-01 02:42:50.708	1
20	4	18	21	2026-02-27 15:12:19.204	1
21	2	18	21	2026-02-25 10:14:18.621	1
22	4	19	21	2026-02-24 20:55:25.787	1
23	10	2	21	2026-02-16 14:32:11.932	1
24	61	19	294	2026-02-27 12:04:10.323	3
25	47	4	21	2026-02-16 05:16:04.099	1
26	47	19	21	2026-02-14 23:17:21.003	1
27	4	18	84	2026-02-27 07:26:31.079	1
28	48	20	525	2026-03-12 01:37:37.794	1
29	45	18	21	2026-03-09 02:15:16.677	1
30	57	4	21	2026-02-27 11:45:08.214	1
31	61	19	336	2026-03-04 07:30:10.112	1
32	58	18	21	2026-02-27 22:49:42.785	1
33	48	20	756	2026-03-10 11:18:46.757	1
34	43	19	21	2026-03-12 19:38:44.456	1
35	3	18	105	2026-02-19 04:57:36.147	2
36	57	18	525	2026-02-16 08:48:15.016	1
37	10	8	294	2026-02-28 18:04:37.324	3
38	50	20	21	2026-03-01 18:50:16.433	1
39	9	8	21	2026-02-17 20:54:30.615	1
40	3	10	21	2026-02-15 11:23:56.418	1
41	48	2	21	2026-03-09 11:42:38.227	1
42	43	10	21	2026-02-20 14:30:34.344	1
43	43	18	189	2026-02-25 10:05:50.04	1
44	43	4	21	2026-02-12 14:28:01.399	1
45	45	18	84	2026-03-01 20:08:04.586	1
46	9	19	21	2026-03-09 16:12:53.103	1
47	57	6	2940	2026-03-07 03:07:29.786	7
48	58	10	21	2026-02-21 01:16:47.783	1
49	1	3	21	2026-03-10 08:11:13.875	1
50	45	3	21	2026-03-08 22:28:45.002	1
51	57	8	21	2026-02-15 11:50:28.725	1
52	3	6	84	2026-02-21 16:48:58.407	1
53	4	8	105	2026-02-20 05:39:04.408	2
54	58	8	21	2026-02-17 10:17:05.094	1
55	49	8	21	2026-02-26 00:35:19.259	1
56	47	7	5985	2026-03-02 18:00:00.034	9
57	44	20	630	2026-02-13 01:53:44.765	4
58	44	8	105	2026-03-11 23:23:19.723	2
59	57	4	8064	2026-02-19 18:03:52.323	9
60	49	19	294	2026-02-27 21:29:25.88	3
61	8	19	21	2026-03-10 20:47:36.893	1
62	48	20	1029	2026-02-23 18:46:13.85	1
63	44	18	105	2026-02-24 09:08:50.033	2
64	61	20	84	2026-02-25 02:55:26.852	1
65	48	20	5145	2026-02-27 04:10:47.491	3
66	4	20	10626	2026-03-06 11:49:44.707	11
67	3	10	84	2026-02-16 08:13:23.864	1
68	7	18	21	2026-02-22 01:30:58.763	1
69	2	18	84	2026-02-18 12:31:24.135	1
70	4	4	21	2026-02-22 00:53:06.384	1
71	47	19	84	2026-02-17 17:31:28.069	1
72	45	20	21	2026-02-16 03:38:39.804	1
73	50	4	21	2026-03-01 08:07:20.907	1
74	7	20	84	2026-03-02 09:18:25.427	1
75	3	19	21	2026-03-08 13:42:01.732	1
76	51	9	21	2026-02-24 14:07:52.1	1
77	58	4	21	2026-03-08 10:45:12.652	1
78	61	18	21	2026-03-08 23:31:26.747	1
79	2	20	21	2026-02-24 20:05:00.591	1
80	61	19	2310	2026-02-24 09:50:01.511	3
81	1	20	105	2026-02-19 21:28:44.006	2
82	44	18	189	2026-03-06 22:31:22.042	1
83	4	16	630	2026-02-18 19:24:39.819	4
84	47	20	630	2026-03-01 22:17:11.467	4
85	61	6	5985	2026-02-26 19:33:18.2	9
86	49	20	21	2026-03-11 20:05:52.699	1
87	1	10	21	2026-03-08 00:45:53.248	1
88	3	14	21	2026-02-22 18:48:04.311	1
89	43	15	21	2026-02-18 00:50:35.104	1
90	43	19	84	2026-03-06 01:00:10.81	1
91	1	18	8085	2026-03-05 15:03:18.17	10
92	1	10	84	2026-02-23 09:30:02.527	1
93	61	10	21	2026-03-01 17:17:23.659	1
94	44	10	21	2026-02-23 23:39:04.63	1
95	9	4	21	2026-02-14 20:56:14.941	1
96	57	10	294	2026-02-15 02:38:23.612	3
97	50	4	84	2026-02-23 04:15:40.489	1
98	50	19	2310	2026-02-17 17:58:06.263	3
99	54	3	21	2026-02-24 20:57:13.575	1
100	45	10	21	2026-03-04 08:16:27.636	1
101	50	6	21	2026-02-20 07:12:22.225	1
102	61	18	84	2026-02-22 13:53:48.739	1
103	46	6	21	2026-02-14 21:34:17.741	1
104	1	18	2541	2026-02-18 03:55:43.306	1
105	58	4	609	2026-03-12 04:25:55.054	3
106	2	18	189	2026-03-05 13:41:38.224	1
107	3	2	21	2026-03-07 05:14:06.028	1
108	57	8	17178	2026-03-01 22:08:33.438	12
109	12	18	105	2026-03-09 08:09:16.32	2
110	7	18	84	2026-02-26 09:30:00.659	1
111	49	18	21	2026-03-13 08:56:14.462	1
112	12	20	1911	2026-02-19 06:39:48.649	6
113	10	19	294	2026-03-07 03:29:25.516	3
114	9	20	21	2026-02-20 03:04:17.678	1
115	50	18	84	2026-02-12 15:05:22.077	1
116	2	8	630	2026-02-27 11:31:14.571	4
117	9	19	84	2026-03-13 09:12:46.856	1
118	3	6	189	2026-02-14 04:08:22.611	1
119	51	6	8085	2026-02-23 13:00:16.76	10
120	51	18	630	2026-02-14 15:13:09.14	4
121	61	20	189	2026-02-22 16:56:44.905	1
122	61	8	21	2026-03-06 10:25:16.279	1
123	61	20	336	2026-02-22 00:02:25.445	1
124	44	6	756	2026-03-06 17:11:13.269	1
125	61	20	2310	2026-02-26 19:28:23.117	3
126	57	11	21	2026-03-04 02:45:10.459	1
127	50	6	84	2026-02-19 14:25:55.911	1
128	61	2	21	2026-02-20 04:44:00.518	1
129	61	20	1344	2026-02-17 23:52:31.258	1
130	47	4	84	2026-02-14 02:08:54.384	1
131	57	19	105	2026-03-13 06:08:49.636	2
132	50	4	1050	2026-02-26 03:22:58.917	3
133	48	20	2541	2026-02-28 09:48:53.99	1
134	58	20	525	2026-03-11 14:20:26.052	1
135	58	19	21	2026-03-10 16:00:12.375	1
136	45	18	189	2026-02-14 18:09:02.199	1
137	2	20	84	2026-02-27 05:17:10.987	1
138	4	18	189	2026-03-13 00:03:05.522	1
139	7	4	21	2026-02-15 21:34:54.398	1
140	43	2	630	2026-02-19 01:19:48.365	4
141	47	18	21	2026-02-27 10:31:33.67	1
142	61	2	84	2026-03-10 05:41:16.557	1
143	4	19	84	2026-03-09 02:56:36.87	1
144	7	11	21	2026-03-11 11:27:34.948	1
145	57	20	21	2026-03-06 18:11:58.375	1
146	47	18	84	2026-03-12 19:46:43.378	1
147	1	12	21	2026-02-12 20:54:07.819	1
148	44	2	21	2026-03-01 15:38:34.599	1
149	51	8	630	2026-03-08 07:22:57.739	4
150	46	20	21	2026-02-24 13:18:41.978	1
151	42	21	21	2026-03-13 12:15:30.175	1
152	39	21	21	2026-03-13 12:22:34.335	1
153	39	21	8064	2026-03-13 12:23:02.531	9
154	42	21	84	2026-03-13 12:24:02.184	1
155	38	21	21	2026-03-13 12:30:19.767	1
156	42	21	189	2026-03-14 15:44:12.33	1
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
9572f250-a805-4c9f-a212-3b70af94308f	21	42	1	21	2026-03-13 12:13:05.689	f
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

SELECT pg_catalog.setval('"public"."accounts_account_id_seq"', 42, true);


--
-- Name: challenges_challenge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."challenges_challenge_id_seq"', 65, true);


--
-- Name: perennial_tokens_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."perennial_tokens_token_id_seq"', 20, true);


--
-- Name: pushes_push_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."pushes_push_id_seq"', 156, true);


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

-- \unrestrict PApgHAuZFeUvGaRhfFLxbgNovbxWCnzBYdn2jkruwmSuuijLjLXCwgzErh03T38

RESET ALL;
