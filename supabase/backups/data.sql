SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict cK5cYML5bGR8DUgpeb3xogysUQNtDLU3CepsBIK0y7AO6RvlZxaCIv8Ay7cJeuJ

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
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."users" ("user_id", "last_activity_timestamp", "last_live_activity_timestamp", "last_seen_stream_day", "active_offline_days_count", "active_stream_days_count", "daily_challenge_reset_at", "total_numbers_spent_game_wide", "total_challenges_submitted", "total_numbers_returned_from_removals_game_wide", "total_numbers_spent", "total_received_from_removals", "total_removals_executed", "total_digouts_executed", "totalPushesExecuted", "totalDisruptsExecuted", "daily_submission_count", "total_caused_by_removals", "total_to_community_chest", "total_to_pushers", "lastProcessedDay", "lastSeenDay", "last_explorer_deduction") FROM stdin;
16	\N	\N	0	0	0	2026-03-07 18:42:40.506	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	\N
17	\N	\N	0	0	0	2026-03-07 18:42:40.506	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	\N
18	\N	\N	0	0	0	2026-03-07 18:42:40.506	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	\N
19	\N	\N	0	0	0	2026-03-07 18:42:40.506	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	\N
20	\N	\N	0	0	0	2026-03-07 18:42:40.506	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	\N
4	2026-03-07 18:42:54.157	\N	0	0	0	2026-03-07 21:00:00	0	3	0	2940	0	0	0	0	0	3	0	0	0	0	0	\N
12	2026-03-07 18:43:06.778	\N	0	0	0	2026-03-07 21:00:00	0	3	0	2940	0	0	0	0	0	3	0	0	0	0	0	\N
7	2026-03-07 18:42:58.852	\N	0	0	0	2026-03-07 21:00:00	0	3	0	2940	0	0	0	0	0	3	0	0	0	0	0	\N
2	2026-03-07 18:42:50.979	\N	0	0	0	2026-03-07 21:00:00	0	3	0	2940	0	0	0	0	0	3	0	0	0	0	0	\N
15	2026-03-07 18:43:11.471	\N	0	0	0	2026-03-07 21:00:00	0	3	0	2940	0	0	0	0	0	3	0	0	0	0	0	\N
10	2026-03-07 18:43:03.555	\N	0	0	0	2026-03-07 21:00:00	0	3	0	2940	0	0	0	0	0	3	0	0	0	0	0	\N
5	2026-03-07 18:42:55.721	\N	0	0	0	2026-03-07 21:00:00	0	3	0	2940	0	0	0	0	0	3	0	0	0	0	0	\N
1	\N	\N	0	0	0	2026-03-07 18:42:40.506	41160	0	0	0	0	0	0	0	0	0	0	0	0	0	0	\N
21	\N	\N	0	0	0	2026-03-07 18:42:40.506	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	2026-03-07 18:43:38.036
13	2026-03-07 18:43:08.348	\N	0	0	0	2026-03-07 21:00:00	0	3	0	2940	0	0	0	0	0	3	0	0	0	0	0	\N
8	2026-03-07 18:43:00.416	\N	0	0	0	2026-03-07 21:00:00	0	3	0	2940	0	0	0	0	0	3	0	0	0	0	0	\N
3	2026-03-07 18:42:52.551	\N	0	0	0	2026-03-07 21:00:00	0	3	0	2940	0	0	0	0	0	3	0	0	0	0	0	\N
6	2026-03-07 18:42:57.282	\N	0	0	0	2026-03-07 21:00:00	0	3	0	2940	0	0	0	0	0	3	0	0	0	0	0	\N
11	2026-03-07 18:43:05.216	\N	0	0	0	2026-03-07 21:00:00	0	3	0	2940	0	0	0	0	0	3	0	0	0	0	0	\N
14	2026-03-07 18:43:09.908	\N	0	0	0	2026-03-07 21:00:00	0	3	0	2940	0	0	0	0	0	3	0	0	0	0	0	\N
9	2026-03-07 18:43:01.983	\N	0	0	0	2026-03-07 21:00:00	0	3	0	2940	0	0	0	0	0	3	0	0	0	0	0	\N
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."accounts" ("account_id", "user_id", "platform_id", "platform_name", "current_balance", "last_balance_update", "last_activity_timestamp", "last_live_activity_timestamp", "username") FROM stdin;
1	21	686071308	TWITCH	21000000	\N	\N	\N	21xhr
2	21	53255028	KICK	21000000	\N	\N	\N	21xhr
3	21	dTQg5JKFl-YiPzg0UQdqng	YOUTUBE	21000000	\N	\N	\N	21xhr
5	2	linked_kick_2	KICK	21000000	\N	\N	\N	Triple_KICK_2
6	2	linked_twitch_2	TWITCH	21000000	\N	\N	\N	Triple_TWITCH_2
9	4	linked_kick_4	KICK	21000000	\N	\N	\N	Duo_KICK_4
11	5	linked_kick_5	KICK	21000000	\N	\N	\N	Duo_KICK_5
13	6	linked_kick_6	KICK	21000000	\N	\N	\N	Triple_KICK_6
14	6	linked_youtube_6	YOUTUBE	21000000	\N	\N	\N	Triple_YOUTUBE_6
16	7	linked_twitch_7	TWITCH	21000000	\N	\N	\N	Triple_TWITCH_7
17	7	linked_youtube_7	YOUTUBE	21000000	\N	\N	\N	Triple_YOUTUBE_7
19	8	linked_kick_8	KICK	21000000	\N	\N	\N	Duo_KICK_8
23	11	linked_youtube_11	YOUTUBE	21000000	\N	\N	\N	Duo_YOUTUBE_11
26	13	linked_kick_13	KICK	21000000	\N	\N	\N	Duo_KICK_13
28	14	linked_kick_14	KICK	21000000	\N	\N	\N	Duo_KICK_14
30	16	solo_twitch_16	TWITCH	21000000	\N	\N	\N	Solo_TWITCH_16
31	17	solo_youtube_17	YOUTUBE	21000000	\N	\N	\N	Solo_YOUTUBE_17
32	18	solo_youtube_18	YOUTUBE	21000000	\N	\N	\N	Solo_YOUTUBE_18
33	19	linked_twitch_19	TWITCH	21000000	\N	\N	\N	Duo_TWITCH_19
34	19	linked_kick_19	KICK	21000000	\N	\N	\N	Duo_KICK_19
35	20	linked_youtube_20	YOUTUBE	21000000	\N	\N	\N	Triple_YOUTUBE_20
36	20	linked_kick_20	KICK	21000000	\N	\N	\N	Triple_KICK_20
37	20	linked_twitch_20	TWITCH	21000000	\N	\N	\N	Triple_TWITCH_20
4	2	linked_youtube_2	YOUTUBE	99998109	\N	\N	\N	Triple_YOUTUBE_2
7	3	solo_twitch_3	TWITCH	99998109	\N	\N	\N	Solo_TWITCH_3
8	4	linked_youtube_4	YOUTUBE	99998109	\N	\N	\N	Duo_YOUTUBE_4
10	5	linked_twitch_5	TWITCH	99998109	\N	\N	\N	Duo_TWITCH_5
12	6	linked_twitch_6	TWITCH	99998109	\N	\N	\N	Triple_TWITCH_6
15	7	linked_kick_7	KICK	99998109	\N	\N	\N	Triple_KICK_7
18	8	linked_twitch_8	TWITCH	99998109	\N	\N	\N	Duo_TWITCH_8
20	9	solo_youtube_9	YOUTUBE	99998109	\N	\N	\N	Solo_YOUTUBE_9
21	10	solo_kick_10	KICK	99998109	\N	\N	\N	Solo_KICK_10
22	11	linked_twitch_11	TWITCH	99998109	\N	\N	\N	Duo_TWITCH_11
24	12	solo_youtube_12	YOUTUBE	99998109	\N	\N	\N	Solo_YOUTUBE_12
25	13	linked_youtube_13	YOUTUBE	99998109	\N	\N	\N	Duo_YOUTUBE_13
27	14	linked_twitch_14	TWITCH	99998109	\N	\N	\N	Duo_TWITCH_14
29	15	solo_youtube_15	YOUTUBE	99998109	\N	\N	\N	Solo_YOUTUBE_15
\.


--
-- Data for Name: challenges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."challenges" ("challenge_id", "category", "proposer_user_id", "status", "is_executing", "has_been_auctioned", "has_been_digged_out", "auction_cost", "disrupt_count", "numbers_raised", "total_numbers_spent", "total_push", "stream_days_since_activation", "timestamp_submitted", "timestamp_last_activation", "timestamp_completed", "unique_pusher", "push_base_cost", "timestampLastStreamDayTicked", "current_session_count", "session_start_timestamp", "total_sessions", "duration_type", "failure_reason", "cadence_period_start", "cadence_progress_counter", "cadence_unit", "session_cadence_text", "cadence_required_count", "timestamp_last_session_tick", "submission_cost", "challenge_text") FROM stdin;
1	General	2	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:42:48.846	2026-03-07 18:42:48.846	\N	0	21	2026-03-07 18:42:49.95	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	210	{"goal": "Master the Moeller 'whip' technique for effortless power.", "references": [{"url": "https://www.youtube.com/watch?v=Zj3-Lc7UWwg", "type": "video", "label": "Jojo Mayer: Moeller Stroke Lesson"}, {"url": "https://en.wikipedia.org/wiki/Moeller_method", "type": "concept", "label": "Moeller Method (Wikipedia)"}], "constraints": ["No rimshots allowed", "Must use matched grip"], "instructions": "Practice your Moeller strokes using alternating accents. Focus on the whip-like motion of the wrist and let the stick bounce naturally rather than gripping it tight. Your hand should feel like a wet towel being snapped. Focus on staying completely relaxed."}
2	General	2	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:42:50.471	2026-03-07 18:42:50.471	\N	0	21	2026-03-07 18:42:50.703	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	840	{"goal": "Balance ghost notes and backbeats in a funk pocket.", "references": [{"url": "https://en.wikipedia.org/wiki/Clyde_Stubblefield", "type": "musician", "label": "Clyde Stubblefield (Wikipedia)"}, {"url": "https://open.spotify.com/track/6M6v3Tid69FhO7z3", "type": "song", "label": "The Funky Drummer - James Brown"}], "constraints": ["Metronome set to 90bpm", "No cymbals, hi-hat only"], "instructions": "Play a funk groove where your ghost notes are barely audible 'whispers' on the snare, while your backbeats stay crisp and loud. Use the 'tip' of the stick for ghosts and the 'shoulder' for backbeats. Record yourself to ensure the volume gap is wide enough."}
3	General	2	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:42:50.979	2026-03-07 18:42:50.979	\N	0	21	2026-03-07 18:42:51.211	0	\N	10	RECURRING	\N	\N	0	DAILY	1 session per day for 10 days	1	\N	1890	{"goal": "Solidify your Jazz Swing Feel and Ride placement.", "references": [{"url": "https://en.wikipedia.org/wiki/Elvin_Jones", "type": "musician", "label": "Elvin Jones (Wikipedia)"}, {"url": "https://www.youtube.com/watch?v=PWBn7uuxSgk", "type": "concept", "label": "The Concept of Feathering"}], "constraints": ["Feathered kick drum mandatory", "Brushes or light sticks only"], "instructions": "Play the standard 'spang-a-lang' jazz pattern. Keep the ride cymbal dancing and add occasional light snare comping. Try to 'feather' the bass drum on every quarter note so softly that it is felt rather than heard."}
4	General	3	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:42:51.493	2026-03-07 18:42:51.493	\N	0	21	2026-03-07 18:42:51.771	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	210	{"goal": "Double Stroke Roll speed and consistency (32nd notes).", "references": [{"url": "https://example.com/stick-control", "type": "book", "label": "Stick Control (Gladstone Technique)"}, {"url": "https://youtube.com/finger-control-technique", "type": "video"}], "constraints": ["Must maintain 85bpm minimum", "Practice on a practice pad"], "instructions": "This is a stamina drill. Play continuous 32nd note double strokes for 30 seconds, then rest for 30 seconds. Use the 'Finger Control' method for the second stroke of each double. Start at 80bpm and increase by 5bpm every two minutes."}
5	General	3	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:42:52.047	2026-03-07 18:42:52.047	\N	0	21	2026-03-07 18:42:52.277	0	\N	15	RECURRING	\N	\N	0	DAILY	1 session per day for 15 days	1	\N	840	{"goal": "Clean double-tap kick patterns (Heel-Toe).", "references": [{"url": "https://youtube.com/heel-toe-technique", "type": "video"}, {"url": "https://example.com/lever-action-pedals", "type": "concept", "label": "Lever Action Mechanics"}], "constraints": ["Single pedal only", "Heel-up position"], "instructions": "Focus on the 'snap' of the second stroke using the heel-toe technique. Practice rapid double hits on the kick drum. Make sure both hits in the double sound identical in volume and timing."}
6	General	3	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:42:52.551	2026-03-07 18:42:52.551	\N	0	21	2026-03-07 18:42:52.782	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	1890	{"goal": "Master the foundational 'alphabet' of drumming (N.A.R.D.).", "references": [{"url": "https://nard.us.com/N.A.R.D._Rudiments_files/NARD13Essential.pdf", "type": "other", "label": "Official N.A.R.D. 13 Essential Rudiments PDF"}], "constraints": ["No metronome (Internal clock practice)"], "instructions": "Cycle through the standard rudiments as defined by the National Association of Rudimental Drummers. Focus on 'Open-to-Closed-to-Open' (Slow to Fast to Slow). Pay attention to your stick heights—they should be consistent."}
7	General	4	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:42:53.057	2026-03-07 18:42:53.057	\N	0	21	2026-03-07 18:42:53.335	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	210	{"goal": "Turn human speech patterns into a drum groove.", "references": [{"url": "https://example.com/podcast-clip-rhythm", "type": "audio"}, {"url": "https://example.com/prosody-percussion", "type": "concept", "label": "Prosody in Percussion"}], "constraints": ["Blindfolded (Focus on ears)", "Snare only"], "instructions": "Listen to a podcast or a speech. Try to mirror the natural rhythm and 'cadence' of the speaker using your snare and toms. Don't worry about pitch, just the 'prosody' of the speech."}
8	General	4	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:42:53.654	2026-03-07 18:42:53.654	\N	0	21	2026-03-07 18:42:53.883	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	840	{"goal": "Groove along to the rhythm of a news anchor.", "references": [{"url": "https://archive.org/broadcast-sample", "type": "audio"}], "constraints": ["Must be a 4/4 time signature"], "instructions": "Turn on a news broadcast. Use the steady, serious rhythm of the anchor's voice as your metronome and build a groove around it. The 'headline' is your snare rhythm, and the 'weather report' is your hi-hat pattern."}
9	General	4	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:42:54.157	2026-03-07 18:42:54.157	\N	0	21	2026-03-07 18:42:54.386	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	1890	{"goal": "Use your drums to 'soundtrack' a silent movie scene.", "references": [{"url": "https://archive.org/silent-films", "type": "video", "label": "Silent Film Archive"}, {"url": "https://example.com/mickey-mousing", "type": "concept", "label": "Concept: Mickey Mousing"}], "constraints": ["No cymbals", "Continuous playing for 5 mins"], "instructions": "Watch an old silent film clip. Match your drumming to the physical movements and slapstick timing of the actors on screen. Use different drums to represent different characters."}
10	General	5	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:42:54.662	2026-03-07 18:42:54.662	\N	0	21	2026-03-07 18:42:54.939	0	\N	4	RECURRING	\N	\N	0	MONTHLY	1 session per month for 4 months	1	\N	210	{"goal": "Improvise a soundtrack to changing natural environments.", "references": [{"url": "https://open.spotify.com/playlist/nature-sounds-reference", "type": "playlist", "label": "Natural Sound Reference Playlist"}], "constraints": ["Use mallets or brushes only", "Minimum 10 minutes per session"], "instructions": "Once a month, select a new nature soundscape (Rainfall, Thunderstorm, Ocean Waves, Forest Wind). Score the environment using appropriate dynamics—soft cymbal washes for rain, heavy toms for thunder."}
11	General	5	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:42:55.214	2026-03-07 18:42:55.214	\N	0	21	2026-03-07 18:42:55.446	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	840	{"goal": "Explore non-traditional sounds on your VAD module.", "references": [{"url": "https://youtube.com/roland-vad-sound-design", "type": "video", "label": "Roland VAD Sound Design"}], "constraints": ["Must use at least 1 non-instrumental object"], "instructions": "Switch to an industrial or electronic kit. Incorporate at least one 'found sound' or weird FX from the module into a 4/4 groove. This is inspired by industrial and experimental electronic music."}
12	General	5	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:42:55.721	2026-03-07 18:42:55.721	\N	0	21	2026-03-07 18:42:55.95	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	1890	{"goal": "Improve coordination by taking one limb away.", "references": [{"url": "https://example.com/limb-independence", "type": "concept"}], "constraints": ["Must maintain consistent hi-hat chick on beats 2 and 4 when not muted"], "instructions": "Play a complex groove, but intentionally 'mute' one limb (like your left foot) for 2 measures every 8, while the others keep going. This builds cognitive independence."}
13	General	6	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:42:56.224	2026-03-07 18:42:56.224	\N	0	21	2026-03-07 18:42:56.502	0	\N	7	RECURRING	\N	\N	0	DAILY	1 session per day for 7 days	1	\N	210	{"goal": "Play a rock beat against a Latin clave.", "references": [{"url": "https://en.wikipedia.org/wiki/Horacio_Hernandez", "type": "musician", "label": "Horacio Hernandez (Wikipedia)"}, {"url": "https://example.com/clave-patterns", "type": "book", "label": "The Clave Bible"}], "constraints": ["Left foot cowbell required"], "instructions": "Keep a standard 4/4 rock beat with your hands while your left foot keeps a 3-2 son clave going on a cowbell sound. Keep the rock beat heavy and the clave steady."}
14	General	6	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:42:56.777	2026-03-07 18:42:56.777	\N	0	21	2026-03-07 18:42:57.007	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	840	{"goal": "Balance your kit volume physically, not through tech.", "references": [{"url": "https://example.com/internal-mixing", "type": "concept"}], "constraints": ["No post-processing allowed"], "instructions": "Turn off all EQ and compression on your module. Balance the volume of your snare versus your cymbals purely through your physical touch. Record and listen back to check the mix."}
15	General	6	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:42:57.282	2026-03-07 18:42:57.282	\N	0	21	2026-03-07 18:42:57.512	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	1890	{"goal": "Master the legendary half-time shuffle (Purdie Shuffle).", "references": [{"url": "https://youtube.com/purdie-shuffle", "type": "video"}, {"url": "https://open.spotify.com/track/HomeAtLast", "type": "song", "label": "Home At Last - Steely Dan"}], "constraints": ["Must use triplets", "Snare ghost notes required"], "instructions": "Focus on the 'bounce' of the ghost note triplets. It's all about that specific 'lazy' feel that Bernard Purdie is famous for. Listen to 'Home at Last' by Steely Dan for the reference pulse."}
16	General	7	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:42:57.789	2026-03-07 18:42:57.789	\N	0	21	2026-03-07 18:42:58.073	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	210	{"goal": "Make 7/8 feel as natural as 4/4.", "references": [{"url": "https://open.spotify.com/track/money-pink-floyd", "type": "song", "label": "Money - Pink Floyd"}], "constraints": ["No metronome for the final 5 minutes"], "instructions": "Cycle a 7/8 groove (counting it as 2+2+3). Try to make it feel smooth enough that someone could dance to it. Avoid it feeling 'jagged.'"}
17	General	7	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:42:58.348	2026-03-07 18:42:58.348	\N	0	21	2026-03-07 18:42:58.578	0	\N	10	RECURRING	\N	\N	0	DAILY	1 session per day for 10 days	1	\N	840	{"goal": "Make brush sweeps work on electronic drums.", "references": [{"url": "https://en.wikipedia.org/wiki/Jeff_Hamilton_(drummer)", "type": "musician", "label": "Jeff Hamilton (Wikipedia)"}], "constraints": ["Brushes only", "Tempo under 60bpm"], "instructions": "Use the brush-specific settings on your module. Practice the sweeping motions and 'swirls' used in jazz ballads. Ensure the sensitivity is set correctly to pick up the friction."}
18	General	7	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:42:58.852	2026-03-07 18:42:58.852	\N	0	21	2026-03-07 18:42:59.082	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	1890	{"goal": "Play patterns where no two notes hit at once (Linear Gadd).", "references": [{"url": "https://youtube.com/gadd-linear", "type": "video"}, {"url": "https://open.spotify.com/track/fifty-ways-leave-lover", "type": "song", "label": "50 Ways to Leave Your Lover - Steve Gadd"}], "constraints": ["No unison hits allowed"], "instructions": "Play patterns where the hands and feet follow each other in a line (no simultaneous hits). Practice the K-R-L-K-R-L-R-L pattern. This creates that 'winding' Steve Gadd sound."}
19	General	8	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:42:59.359	2026-03-07 18:42:59.359	\N	0	21	2026-03-07 18:42:59.637	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	210	{"goal": "Build independence with 3-against-4 polyrhythms.", "references": [{"url": "https://example.com/polyrhythm-math", "type": "concept", "label": "The Math of 4:3"}], "constraints": ["Kick/Snare must stay on the grid"], "instructions": "Play a steady 4/4 pulse on your kick and snare while your hi-hat (or ride) plays in 3/4. Don't let the counts pull each other off beat. This is a classic brain-splitter."}
20	General	8	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:42:59.913	2026-03-07 18:42:59.913	\N	0	21	2026-03-07 18:43:00.142	0	\N	21	RECURRING	\N	\N	0	DAILY	1 session per day for 21 days	1	\N	840	{"goal": "Build endurance for high-velocity metal drumming.", "references": [{"url": "https://en.wikipedia.org/wiki/George_Kollias", "type": "musician", "label": "George Kollias (Wikipedia)"}], "constraints": ["Traditional grip for snare hand optional"], "instructions": "Practice fast, alternating hits between your kick and snare. Focus on staying relaxed so you don't tense up and slow down. Start at 120bpm and aim for stability over speed."}
21	General	8	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:00.416	2026-03-07 18:43:00.416	\N	0	21	2026-03-07 18:43:00.647	0	\N	7	RECURRING	\N	\N	0	DAILY	1 session per day for 7 days	1	\N	1890	{"goal": "Master the 'empty' first beat of reggae (One-Drop).", "references": [{"url": "https://en.wikipedia.org/wiki/Carlton_Barrett", "type": "musician", "label": "Carlton Barrett (Wikipedia)"}, {"url": "https://open.spotify.com/track/one-drop-bob-marley", "type": "song", "label": "One Drop - Bob Marley"}], "constraints": ["Kick only on beat 3", "Cross-stick snare only"], "instructions": "In this style, the kick drum only hits on the 3rd beat. Keep the hi-hats eighth notes steady and the rim-click crisp. Use a cross-stick on the snare for that authentic woody sound."}
22	General	9	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:00.922	2026-03-07 18:43:00.922	\N	0	21	2026-03-07 18:43:01.201	0	\N	14	RECURRING	\N	\N	0	DAILY	1 session per day for 14 days	1	\N	210	{"goal": "Keep a steady 'baion' foot pattern (Bossa Nova).", "references": [{"url": "https://open.spotify.com/track/girl-from-ipanema", "type": "song", "label": "The Girl From Ipanema"}], "constraints": ["Consistent ride cymbal mandatory"], "instructions": "Keep your feet playing a constant '1... (and) 2' pattern (dotted 8th, 16th) while your hands play syncopated rim-clicks. It requires perfect timing between feet and hands."}
23	General	9	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:01.475	2026-03-07 18:43:01.475	\N	0	21	2026-03-07 18:43:01.709	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	840	{"goal": "Create a 'wall of sound' cinematic swell.", "references": [{"url": "https://example.com/mallet-swells", "type": "concept", "label": "Cymbal Swell Techniques"}], "constraints": ["Mallets only", "Minimum 30s crescendo"], "instructions": "Use soft mallets to create smooth, atmospheric swells on your cymbals. Build the volume from a whisper to a roar gradually. Focus on the 'wash' of the sound."}
24	General	9	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:01.983	2026-03-07 18:43:01.983	\N	0	21	2026-03-07 18:43:02.219	0	\N	10	RECURRING	\N	\N	0	DAILY	1 session per day for 10 days	1	\N	1890	{"goal": "Master the powerful R-L-K triplet pattern (Bonham).", "references": [{"url": "https://en.wikipedia.org/wiki/John_Bonham", "type": "musician", "label": "John Bonham (Wikipedia)"}, {"url": "https://youtube.com/bonham-triplets", "type": "video"}], "constraints": ["Must maintain consistent volume across hands and feet"], "instructions": "Practice the 'galloping' triplet (Right Hand, Left Hand, Kick). Focus on power and making the transition from hands to feet seamless. Speed it up until it sounds like a single instrument."}
25	General	10	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:02.493	2026-03-07 18:43:02.493	\N	0	21	2026-03-07 18:43:02.773	0	\N	5	RECURRING	\N	\N	0	DAILY	1 session per day for 5 days	1	\N	210	{"goal": "Test your timing by shifting the 'click'.", "references": [{"url": "https://example.com/internal-clock-theory", "type": "concept"}], "constraints": ["Start at 60bpm", "Record and check if you 'flipped' back"], "instructions": "Set your metronome to a steady pulse, but treat the click as the 'and' (the upbeat). Your goal is to keep a groove where your main beats land in the silences. This will feel like the metronome is fighting you."}
26	General	10	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:03.047	2026-03-07 18:43:03.047	\N	0	21	2026-03-07 18:43:03.28	0	\N	10	RECURRING	\N	\N	0	DAILY	10 days of hats	10	\N	840	{"goal": "Master the fast hi-hat 'zips' (Trap Rolls).", "references": [{"url": "https://open.spotify.com/playlist/trap-drums-reference", "type": "song", "label": "Trap Drums Reference"}], "constraints": ["Single hand for hi-hat only"], "instructions": "Practice 16th and 32nd note triplets on the hi-hat using one hand. Use your fingers to get that rapid-fire speed. Incorporate bursts and rolls found in trap music."}
27	General	10	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:03.555	2026-03-07 18:43:03.555	\N	0	21	2026-03-07 18:43:03.784	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	1890	{"goal": "Build a catchy groove without using snare or cymbals.", "references": [{"url": "https://youtube.com/tribal-tom-grooves", "type": "video", "label": "Tribal Drumming Concepts"}], "constraints": ["Absolutely no snare drum", "No cymbals"], "instructions": "Switch to a tom-heavy kit. You aren't allowed to use the snare—create the entire groove using just the toms and the kick. Use the toms as melodic voices."}
28	General	11	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:04.061	2026-03-07 18:43:04.061	\N	0	21	2026-03-07 18:43:04.338	0	\N	12	RECURRING	\N	\N	0	WEEKLY	3 sessions per week for 4 weeks	3	\N	210	{"goal": "Fluidly blend visual flair with consistent timing.", "references": [{"url": "https://www.youtube.com/watch?v=MkK8qACn6xs", "type": "video", "label": "7 Favorite Drum Stick Tricks"}], "constraints": ["Must maintain consistent 2/4 backbeat"], "instructions": "Practice backsticking, twirls, or crossovers while maintaining a simple 2 and 4 backbeat. The trick must not interrupt the groove or tempo. Rotate through different tricks each session."}
29	General	11	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:04.613	2026-03-07 18:43:04.613	\N	0	21	2026-03-07 18:43:04.941	0	\N	14	RECURRING	\N	\N	0	DAILY	14 days of fills	14	\N	840	{"goal": "Use the R-L-R-R-L-L rudiment in a drum fill.", "references": [{"url": "https://example.com/paradiddle-diddle-notation", "type": "other"}], "constraints": ["Focus on even stick heights"], "instructions": "Practice the paradiddle-diddle moving across the toms. It’s a great way to move quickly without crossing your arms. Focus on even stick heights and making it sound fluid."}
30	General	11	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:05.216	2026-03-07 18:43:05.216	\N	0	21	2026-03-07 18:43:05.445	0	\N	7	RECURRING	\N	\N	0	DAILY	7 days of funk	7	\N	1890	{"goal": "Master the 'heavy' funk pocket (Half-Time).", "references": [{"url": "https://en.wikipedia.org/wiki/Questlove", "type": "musician", "label": "Questlove (Wikipedia)"}], "constraints": ["Slightly behind the beat (laid back)"], "instructions": "Play a funk groove but drop the snare backbeat to the '3.' Focus on making it feel deep and groovy. This creates a massive amount of 'air' in the beat."}
31	General	12	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:05.718	2026-03-07 18:43:05.718	\N	0	21	2026-03-07 18:43:05.997	0	\N	21	RECURRING	\N	\N	0	DAILY	21 days of double kick	21	\N	210	{"goal": "Build sprinting speed with your feet.", "references": [{"url": "https://example.com/muscle-fatigue-management", "type": "concept"}], "constraints": ["Must maintain for 60 seconds without stopping"], "instructions": "Set a timer for 1 minute and play steady 16th notes on the double kick. Focus on keeping both feet sounding identical. If you break rhythm, stop and restart."}
32	General	12	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:06.272	2026-03-07 18:43:06.272	\N	0	21	2026-03-07 18:43:06.502	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	840	{"goal": "Practice locking in with a bassist.", "references": [{"url": "https://open.spotify.com/track/flea-bass-line", "type": "song"}], "constraints": ["No extra kick notes allowed"], "instructions": "Find a 'bass only' track. Make sure every single time the bassist hits a note, your kick drum is hitting exactly with them. Do not play any extra kick notes."}
33	General	12	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:06.778	2026-03-07 18:43:06.778	\N	0	21	2026-03-07 18:43:07.008	0	\N	7	RECURRING	\N	\N	0	DAILY	7 days of precision	7	\N	1890	{"goal": "Play with the perfect timing of a machine.", "references": [{"url": "https://example.com/industrial-precision", "type": "concept"}], "constraints": ["Must be perfectly on the grid"], "instructions": "Use a dry, clicky kit. Focus on being so 'on the grid' that your hits perfectly overlap with the metronome. This is the opposite of micro-rhythm—it is pure metronomic precision."}
34	General	13	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:07.291	2026-03-07 18:43:07.291	\N	0	21	2026-03-07 18:43:07.568	0	\N	14	RECURRING	\N	\N	0	DAILY	14 days of control	14	\N	210	{"goal": "Maintain energy and speed at a tiny volume (Whisper Metal).", "references": [{"url": "https://example.com/pianissimo-control", "type": "concept"}], "constraints": ["Sticks must not rise above 2 inches"], "instructions": "Play an aggressive heavy metal groove (blasts, double kick) as quietly as possible. Maintain the speed, but keep the volume at a 'whisper.' This forces efficiency of motion."}
35	General	13	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:07.843	2026-03-07 18:43:07.843	\N	0	21	2026-03-07 18:43:08.073	0	\N	8	RECURRING	\N	\N	0	CUSTOM_DAYS	2 sessions every 3 days then repeat this 4 times.	2	\N	840	{"goal": "Build the habit of non-stop creative play.", "references": [{"url": "https://example.com/flow-state-guided-meditation", "type": "audio"}], "constraints": ["No stopping, no metronome"], "instructions": "Play for 21 minutes without stopping. Don't judge what you play; just keep the flow moving. If you run out of ideas, play a simple beat until a new idea comes."}
36	General	13	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:08.348	2026-03-07 18:43:08.348	\N	0	21	2026-03-07 18:43:08.578	0	\N	7	RECURRING	\N	\N	0	DAILY	7 days of ghost notes	7	\N	1890	{"goal": "Add busy-ness to a beat using quiet taps (Syncopation).", "references": [{"url": "https://youtube.com/ghost-note-masterclass", "type": "video"}], "constraints": ["Main backbeat must stay consistent"], "instructions": "Play a 16th note linear pattern where the snare ghost notes only occur on the 'e' and 'a' of the beat. This creates a complex, rolling texture."}
37	General	14	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:08.851	2026-03-07 18:43:08.851	\N	0	21	2026-03-07 18:43:09.129	0	\N	21	RECURRING	\N	\N	0	DAILY	21 days of sprints	21	\N	210	{"goal": "Practice quick foot sprints for metal (Double Kick).", "references": [{"url": "https://example.com/fast-twitch-activation", "type": "concept"}], "constraints": ["Maximum speed during bursts"], "instructions": "Play 5-second bursts of maximum speed 16th notes on the kick, then 5 seconds of rest. Repeat for the session. This builds 'fast twitch' muscle response."}
38	General	14	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:09.404	2026-03-07 18:43:09.404	\N	0	21	2026-03-07 18:43:09.633	0	\N	1	ONE_OFF	\N	\N	0	\N	ONE_OFF: 1 session(s).	\N	\N	840	{"goal": "Match the 'length' of the notes with a bassist.", "references": [{"url": "https://example.com/musical-sustain", "type": "concept"}], "constraints": ["Must use at least 2 different types of cymbal sustain"], "instructions": "Listen to a bass track. Short bass notes = short kick drum hits. Long bass notes = open cymbal hits. You are mimicking the 'sustain' of a melodic instrument."}
39	General	14	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:09.908	2026-03-07 18:43:09.908	\N	0	21	2026-03-07 18:43:10.138	0	\N	7	RECURRING	\N	\N	0	DAILY	7 days of unison	7	\N	1890	{"goal": "Make your hands and feet sound like one engine.", "references": [{"url": "https://example.com/vertical-alignment", "type": "concept"}], "constraints": ["Record and listen for unison accuracy"], "instructions": "Focus on the 'unison' of your hits. Your kick and snare should hit at the exact same time so they sound like one powerful instrument. Eliminate all 'flams' between limbs."}
40	General	15	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:10.413	2026-03-07 18:43:10.413	\N	0	21	2026-03-07 18:43:10.69	0	\N	14	RECURRING	\N	\N	0	DAILY	14 days of stealth speed	14	\N	210	{"goal": "Build speed using fingers by limiting stick height.", "references": [{"url": "https://en.wikipedia.org/wiki/Derek_Roddy", "type": "musician", "label": "Derek Roddy (Wikipedia)"}], "constraints": ["No arm movement allowed"], "instructions": "Play a fast metal groove but don't let your sticks go more than an inch off the drum. This relies entirely on finger control and wrist snap rather than arm movement."}
41	General	15	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:10.966	2026-03-07 18:43:10.966	\N	0	21	2026-03-07 18:43:11.196	0	\N	12	RECURRING	\N	\N	0	WEEKLY	3 sessions per week for 4 weeks	3	\N	840	{"goal": "Master high-tempo breakbeats and smooth ghost notes.", "references": [{"url": "https://open.spotify.com/track/amen-break-original", "type": "song", "label": "The Amen Break"}, {"url": "https://example.com/dnb-mechanics", "type": "concept", "label": "D&B Breakbeat Mechanics"}], "constraints": ["Tempo must stay above 165bpm"], "instructions": "Progress from the foundational 'Amen Break' to atmospheric, flowing grooves with snare hits that 'dance' around the main beat. Aim for high speed (175bpm+) endurance."}
42	General	15	ACTIVE	f	f	f	0	0	0	0	0	0	2026-03-07 18:43:11.471	2026-03-07 18:43:11.471	\N	0	21	2026-03-07 18:43:11.702	0	\N	7	RECURRING	\N	\N	0	DAILY	7 days	7	\N	1890	{"goal": "Mastering Micro-Timing and Rhythmic Nuance.", "references": [{"url": "https://www.confidentdrummer.com/what-are-micro-rhythms-and-micro-timing-and-why-they-matter", "type": "concept", "label": "Article: What Are Micro-Rhythms and Micro-Timing?"}, {"url": "https://www.youtube.com/@LofiGirl", "type": "video", "label": "Lofi Girl", "details": "Modern Micro-Timing Examples"}, {"url": "https://en.wikipedia.org/wiki/J_Dilla", "type": "musician", "label": "J Dilla"}], "constraints": ["Use a high-pitch cowbell click for Phase 1", "Record sessions and compare the 'offset' of each hit"], "instructions": "Go beyond the rigid grid of western notation by exploring micro-rhythms—intentional deviations and subtleties that notation cannot accurately represent. \\n\\n- **Phase 1 (Sessions 1-3)**: Develop 'The Grid vs. The Feel'. Practice playing 'behind' and 'ahead' of a high-pitched cowbell click. Focus on the consistent space between the click and your strike. \\n- **Phase 2 (Sessions 4-6)**: Study the 'Unquantized Swing'. Play along to classic tracks by J Dilla or D'Angelo (e.g., 'Untitled'). Focus on the 'late' snare and 'drunken' kick placement that creates a human pocket. \\n- **Phase 3 (Session 7)**: Modern Lofi Application. Drum along to a lofi hip-hop stream. Incorporate everything learned to create a laid-back, personal 'feel' that flows with the unquantized samples."}
\.


--
-- Data for Name: perennial_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."perennial_tokens" ("token_id", "token", "user_id", "platform_id", "platform_name", "is_active", "created_at") FROM stdin;
1	master_demo_token	21	686071308	TWITCH	t	2026-03-07 18:42:40.965
2	test_token_2	2	linked_youtube_2	YOUTUBE	t	2026-03-07 18:42:41.371
3	test_token_3	3	solo_twitch_3	TWITCH	t	2026-03-07 18:42:41.732
4	test_token_4	4	linked_youtube_4	YOUTUBE	t	2026-03-07 18:42:42.091
5	test_token_5	5	linked_twitch_5	TWITCH	t	2026-03-07 18:42:42.408
6	test_token_6	6	linked_twitch_6	TWITCH	t	2026-03-07 18:42:42.728
7	test_token_7	7	linked_kick_7	KICK	t	2026-03-07 18:42:43.044
8	test_token_8	8	linked_twitch_8	TWITCH	t	2026-03-07 18:42:43.36
9	test_token_9	9	solo_youtube_9	YOUTUBE	t	2026-03-07 18:42:43.676
10	test_token_10	10	solo_kick_10	KICK	t	2026-03-07 18:42:43.99
11	test_token_11	11	linked_twitch_11	TWITCH	t	2026-03-07 18:42:44.305
12	test_token_12	12	solo_youtube_12	YOUTUBE	t	2026-03-07 18:42:44.619
13	test_token_13	13	linked_youtube_13	YOUTUBE	t	2026-03-07 18:42:44.935
14	test_token_14	14	linked_twitch_14	TWITCH	t	2026-03-07 18:42:45.252
15	test_token_15	15	solo_youtube_15	YOUTUBE	t	2026-03-07 18:42:45.568
16	test_token_16	16	solo_twitch_16	TWITCH	t	2026-03-07 18:42:45.883
17	test_token_17	17	solo_youtube_17	YOUTUBE	t	2026-03-07 18:42:46.199
18	test_token_18	18	solo_youtube_18	YOUTUBE	t	2026-03-07 18:42:46.513
19	test_token_19	19	linked_twitch_19	TWITCH	t	2026-03-07 18:42:46.828
20	test_token_20	20	linked_youtube_20	YOUTUBE	t	2026-03-07 18:42:47.324
\.


--
-- Data for Name: pushes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."pushes" ("push_id", "challenge_id", "user_id", "cost", "timestamp", "quantity") FROM stdin;
1	2	19	51758	2026-02-16 15:00:39.862	1
2	2	17	141919	2026-03-04 04:13:16.303	1
3	1	16	239728	2026-02-26 23:34:25.399	1
4	5	17	347341	2026-02-11 09:50:12.058	1
5	14	7	117702	2026-02-12 00:23:59.132	1
6	3	7	87249	2026-03-06 22:23:17.901	1
7	1	18	296081	2026-02-12 07:05:18.212	1
8	12	20	57013	2026-02-16 05:35:06.274	1
9	5	19	130296	2026-03-07 01:20:32.076	1
10	5	15	121583	2026-02-27 05:33:49.886	1
11	8	16	188420	2026-02-12 13:48:14.453	1
12	3	6	85470	2026-02-22 00:16:38.435	1
13	8	17	110552	2026-02-14 08:24:57.998	3
14	1	18	548058	2026-02-09 20:51:36.665	4
15	3	17	471797	2026-03-01 21:57:41.951	1
16	2	12	54792	2026-02-11 08:11:14.867	1
17	18	9	129468	2026-03-01 08:35:47.151	1
18	6	16	105600	2026-03-04 15:43:32.215	1
19	2	18	332482	2026-03-07 08:56:19.761	4
20	3	16	413346	2026-02-21 22:31:15.859	2
21	9	12	115844	2026-02-18 10:03:08.836	1
22	6	14	123748	2026-02-21 02:23:09.53	1
23	17	12	96528	2026-03-02 17:56:54.543	4
24	15	16	334671	2026-02-24 23:31:52.891	1
25	1	7	57954	2026-02-10 09:46:19.904	1
26	5	18	304351	2026-02-15 15:21:58.384	1
27	3	18	242223	2026-03-05 19:18:20.66	2
28	12	17	128777	2026-02-23 00:27:35.887	3
29	3	19	105422	2026-02-25 13:44:04.508	1
30	2	20	75232	2026-02-28 19:14:09.85	4
31	3	19	60381	2026-02-11 10:28:54.619	3
32	14	3	123556	2026-03-03 04:59:56.262	1
33	5	11	81109	2026-02-15 20:56:34.734	1
34	5	17	232666	2026-02-13 23:54:11.418	1
35	1	16	411161	2026-03-06 21:23:11.551	1
36	3	16	373594	2026-03-03 03:54:41.893	1
37	5	7	90080	2026-02-25 21:38:33.387	1
38	2	17	311086	2026-03-04 22:45:09.712	1
39	5	12	102036	2026-02-26 19:47:14.419	1
40	15	20	56786	2026-02-19 17:15:38.271	1
41	19	18	386994	2026-02-08 06:22:06.146	1
42	2	4	102652	2026-03-05 07:46:25.491	1
43	5	17	381903	2026-03-04 18:07:33.132	1
44	2	18	369094	2026-03-06 00:31:36.869	1
45	3	18	527907	2026-02-22 22:30:58.558	1
46	8	16	308196	2026-02-19 09:10:29.472	4
47	3	18	144560	2026-02-06 00:33:57.941	1
48	5	17	198688	2026-02-07 09:33:55.499	1
49	17	19	121974	2026-02-07 12:32:17.473	1
50	5	16	192508	2026-03-02 03:14:01.476	1
51	1	12	115703	2026-02-06 13:08:14.642	2
52	4	20	61964	2026-02-06 17:41:18.985	1
53	3	18	359206	2026-03-04 20:27:30.042	1
54	1	18	447479	2026-02-10 02:09:13.668	1
55	4	12	102808	2026-02-14 17:41:14.542	5
56	2	18	541439	2026-02-16 08:10:01.953	1
57	17	16	203767	2026-03-04 11:13:07.418	1
58	16	18	70166	2026-02-06 02:33:10.299	1
59	2	19	98481	2026-02-14 15:30:02.615	1
60	1	17	433592	2026-02-16 20:47:55.959	1
61	11	19	92970	2026-02-09 22:12:12.084	1
62	7	12	116642	2026-02-09 05:52:42.907	1
63	3	17	523417	2026-02-15 21:02:33.735	1
64	5	9	61404	2026-03-06 21:46:36.149	4
65	3	18	502603	2026-03-01 21:12:14.09	1
66	6	18	369357	2026-02-25 02:46:01.567	1
67	5	17	435098	2026-03-04 07:59:51.995	1
68	16	17	71086	2026-02-14 18:26:48.802	1
69	10	4	126810	2026-03-03 11:07:48.382	1
70	5	17	393760	2026-02-28 09:03:30.246	1
71	5	17	433848	2026-02-16 20:36:05.557	1
72	5	7	103356	2026-02-22 09:40:39.781	1
73	5	12	105702	2026-02-25 10:18:20.598	1
74	3	20	80130	2026-02-06 01:33:02.502	3
75	3	20	110299	2026-03-01 03:03:55.944	5
76	2	18	335926	2026-02-12 14:20:12.285	1
77	10	4	138289	2026-02-19 01:35:07.29	5
78	8	20	148158	2026-02-27 15:11:38.969	2
79	15	18	530933	2026-02-15 13:56:11.203	1
80	4	17	511787	2026-02-11 11:37:01.003	1
81	4	17	311149	2026-02-05 21:15:18.508	1
82	14	4	87356	2026-02-14 03:03:25.044	1
83	2	18	436671	2026-02-23 13:19:12.95	1
84	2	16	141688	2026-02-05 21:37:28.754	1
85	2	16	321492	2026-03-05 21:28:46.67	1
86	2	19	85182	2026-02-19 12:14:44.446	3
87	1	18	334652	2026-03-06 10:58:17.003	1
88	8	17	207696	2026-02-11 17:14:36.216	1
89	12	17	73619	2026-02-23 19:16:09.358	1
90	11	16	82202	2026-02-10 23:26:34.552	1
91	5	18	353733	2026-02-20 06:15:05.878	1
92	2	17	435201	2026-03-07 04:51:37.371	5
93	14	16	313936	2026-02-18 17:56:28.575	1
94	10	18	425449	2026-02-08 13:59:50.262	1
95	3	17	320267	2026-03-01 22:24:59.25	2
96	2	17	227062	2026-02-28 12:54:47.293	1
97	17	16	80412	2026-02-11 19:07:45.719	1
98	1	10	144089	2026-03-03 02:03:22.357	2
99	19	16	254770	2026-03-03 08:34:10.456	1
100	18	17	291610	2026-03-02 10:23:09.967	1
101	1	5	135625	2026-02-11 08:45:50.374	1
102	17	20	98254	2026-02-05 19:25:40.666	1
103	3	18	64679	2026-02-15 01:25:15.542	1
104	16	7	146062	2026-02-14 14:44:15.461	1
105	5	2	134273	2026-02-13 04:30:19.558	1
106	6	18	211067	2026-03-06 16:58:36.935	1
107	4	7	123199	2026-02-27 13:06:05.871	1
108	5	6	137830	2026-02-12 15:02:26.55	1
109	2	6	56643	2026-03-05 13:53:55.751	1
110	2	16	523332	2026-02-17 22:09:22.418	1
111	19	18	203072	2026-02-08 19:01:11.309	1
112	13	6	143094	2026-02-18 13:37:35.429	1
113	10	17	392824	2026-03-02 00:23:59.082	1
114	1	7	148492	2026-02-18 18:08:53.146	5
115	10	16	62605	2026-02-25 08:53:38.61	1
116	4	20	84256	2026-02-15 23:35:15.125	1
117	1	16	465144	2026-02-20 20:05:54.247	1
118	15	16	62454	2026-02-16 21:45:14.04	3
119	3	5	59372	2026-02-23 15:28:50.124	1
120	4	15	81421	2026-02-11 17:01:30.973	1
121	2	16	393835	2026-03-06 18:11:15.131	1
122	2	17	382371	2026-02-19 04:51:02.403	1
123	2	18	264389	2026-02-23 13:34:28.436	4
124	5	20	67602	2026-02-25 19:15:11.553	1
125	5	17	71813	2026-02-27 20:35:49.296	1
126	6	4	95202	2026-02-11 19:10:31.812	1
127	1	17	244279	2026-03-02 22:10:28.255	1
128	4	17	112280	2026-02-09 16:23:06.284	1
129	2	17	368385	2026-02-20 20:55:29.571	1
130	10	18	420943	2026-02-21 09:10:32.041	3
131	2	7	132905	2026-02-15 00:23:29.702	1
132	17	16	165984	2026-03-02 04:39:05.12	1
133	1	4	125033	2026-02-05 18:44:48.535	1
134	1	18	228428	2026-02-25 13:16:57.237	1
135	4	4	119967	2026-03-03 01:51:29.797	1
136	16	18	447501	2026-02-28 06:01:30.556	1
137	5	17	254778	2026-02-16 21:21:14.275	1
138	4	18	102229	2026-02-28 00:42:05.094	1
139	5	17	368248	2026-02-18 00:50:55	1
140	4	18	150851	2026-03-04 10:28:52.95	1
141	1	18	545187	2026-02-28 04:43:24.71	1
142	1	18	521621	2026-02-15 18:20:05.159	1
143	1	18	324400	2026-02-08 10:52:37.762	1
144	2	18	468310	2026-02-08 03:46:40.915	1
145	1	16	464250	2026-02-20 20:35:12.932	1
146	2	18	188916	2026-03-07 15:42:43.853	4
147	3	10	140377	2026-03-05 06:16:19.433	1
148	5	16	51829	2026-03-03 05:49:23.049	4
149	3	12	118602	2026-02-28 20:36:35.074	1
150	4	18	276003	2026-03-06 10:30:04.19	5
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

SELECT pg_catalog.setval('"public"."challenges_challenge_id_seq"', 42, true);


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

-- \unrestrict cK5cYML5bGR8DUgpeb3xogysUQNtDLU3CepsBIK0y7AO6RvlZxaCIv8Ay7cJeuJ

RESET ALL;
