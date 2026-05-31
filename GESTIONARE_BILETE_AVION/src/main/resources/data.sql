-- ==========================================
-- 1. ORASE (Tabel independent)
-- ==========================================
INSERT INTO orase (nume_oras, x_coords, y_coords) VALUES ('București', 44.4268, 26.1025);
INSERT INTO orase (nume_oras, x_coords, y_coords) VALUES ('Cluj-Napoca', 46.7712, 23.6236);
INSERT INTO orase (nume_oras, x_coords, y_coords) VALUES ('Timișoara', 45.7489, 21.2087);
INSERT INTO orase (nume_oras, x_coords, y_coords) VALUES ('Iași', 47.1585, 27.5681);
INSERT INTO orase (nume_oras, x_coords, y_coords) VALUES ('Constanța', 44.1792, 28.6498);
INSERT INTO orase (nume_oras, x_coords, y_coords) VALUES ('Brașov', 45.6427, 25.5887);
INSERT INTO orase (nume_oras, x_coords, y_coords) VALUES ('Sibiu', 45.7983, 24.1256);
INSERT INTO orase (nume_oras, x_coords, y_coords) VALUES ('Craiova', 44.3302, 23.7949);
INSERT INTO orase (nume_oras, x_coords, y_coords) VALUES ('Oradea', 47.0465, 21.9189);
INSERT INTO orase (nume_oras, x_coords, y_coords) VALUES ('Arad', 46.1866, 21.3123);


-- ==========================================
-- 2. AEROPORTURI (Depinde de Orase)
-- ==========================================
INSERT INTO aeroporturi (icao, iata, oras_id) VALUES ('LROP', 'OTP', 1);
INSERT INTO aeroporturi (icao, iata, oras_id) VALUES ('LRBS', 'BBU', 1);
INSERT INTO aeroporturi (icao, iata, oras_id) VALUES ('LRCL', 'CLJ', 2);
INSERT INTO aeroporturi (icao, iata, oras_id) VALUES ('LRTR', 'TSR', 3);
INSERT INTO aeroporturi (icao, iata, oras_id) VALUES ('LRIA', 'IAS', 4);
INSERT INTO aeroporturi (icao, iata, oras_id) VALUES ('LRCK', 'CND', 5);
INSERT INTO aeroporturi (icao, iata, oras_id) VALUES ('LRBV', 'GHV', 6);
INSERT INTO aeroporturi (icao, iata, oras_id) VALUES ('LRSB', 'SBZ', 7);
INSERT INTO aeroporturi (icao, iata, oras_id) VALUES ('LRCV', 'CRA', 8);
INSERT INTO aeroporturi (icao, iata, oras_id) VALUES ('LROD', 'OMR', 9);
INSERT INTO aeroporturi (icao, iata, oras_id) VALUES ('LRAR', 'ARW', 10);


-- ==========================================
-- 3. MODELE AVIOANE & COMPANII & SEZOANE
-- ==========================================
INSERT INTO modele_avioane (nume_model, locuri_first_class, locuri_business, locuri_economy, viteza_maxima_kmh, altitudine_maxima_metri, cost_operare_per100km)
VALUES ('BOEING_737', 0, 16, 150, 840, 12500, 600.0); -- ID 1
INSERT INTO modele_avioane (nume_model, locuri_first_class, locuri_business, locuri_economy, viteza_maxima_kmh, altitudine_maxima_metri, cost_operare_per100km)
VALUES ('BOEING_747', 14, 52, 300, 920, 13700, 1500.0); -- ID 2
INSERT INTO modele_avioane (nume_model, locuri_first_class, locuri_business, locuri_economy, viteza_maxima_kmh, altitudine_maxima_metri, cost_operare_per100km)
VALUES ('AIRBUS_A320', 0, 12, 138, 828, 11900, 550.0); -- ID 3
INSERT INTO modele_avioane (nume_model, locuri_first_class, locuri_business, locuri_economy, viteza_maxima_kmh, altitudine_maxima_metri, cost_operare_per100km)
VALUES ('AIRBUS_A380', 14, 76, 426, 903, 13100, 2000.0); -- ID 4
INSERT INTO modele_avioane (nume_model, locuri_first_class, locuri_business, locuri_economy, viteza_maxima_kmh, altitudine_maxima_metri, cost_operare_per100km)
VALUES ('ATR_72', 0, 0, 72, 510, 7600, 250.0); -- ID 5
INSERT INTO modele_avioane (nume_model, locuri_first_class, locuri_business, locuri_economy, viteza_maxima_kmh, altitudine_maxima_metri, cost_operare_per100km)
VALUES ('EMBRAER_190', 0, 12, 88, 890, 12500, 450.0); -- ID 6

INSERT INTO companii_aeriene (nume, cod_iata) VALUES ('TAROM', 'RO'); -- ID 1
INSERT INTO companii_aeriene (nume, cod_iata) VALUES ('Wizz Air', 'W6'); -- ID 2
INSERT INTO companii_aeriene (nume, cod_iata) VALUES ('Ryanair', 'FR'); -- ID 3

INSERT INTO sezoane (nume, data_inceput, data_sfarsit) VALUES ('Vara', '2026-06-15', '2026-09-15'); -- ID 1
INSERT INTO sezoane (nume, data_inceput, data_sfarsit) VALUES ('Iarna', '2025-12-01', '2026-02-28'); -- ID 2
INSERT INTO sezoane (nume, data_inceput, data_sfarsit) VALUES ('Paste 2026', '2026-04-10', '2026-04-20'); -- ID 3
INSERT INTO sezoane (nume, data_inceput, data_sfarsit) VALUES ('Ziua Copilului', '2026-06-01', '2026-06-01'); -- ID 4


-- ==========================================
-- 4. ZBORURI
-- ==========================================
-- REGULATE (Raman cu NULL la final)
INSERT INTO zbor (cod_cursa, companie_aeriana_id, model_avion_id, oras_plecare_id, oras_destinatie_id, pret_economy, pret_business, pret_first_class, tip_zbor, ora_zborului, sezon_id)
VALUES ('RO101', 1, 1, 1, 2, 65.00, 180.00, 0.00, 'REGULAT', '08:30:00', NULL);
INSERT INTO zbor (cod_cursa, companie_aeriana_id, model_avion_id, oras_plecare_id, oras_destinatie_id, pret_economy, pret_business, pret_first_class, tip_zbor, ora_zborului, sezon_id)
VALUES ('RO102', 1, 1, 2, 1, 65.00, 180.00, 0.00, 'REGULAT', '18:45:00', NULL);
INSERT INTO zbor (cod_cursa, companie_aeriana_id, model_avion_id, oras_plecare_id, oras_destinatie_id, pret_economy, pret_business, pret_first_class, tip_zbor, ora_zborului, sezon_id)
VALUES ('RO201', 1, 3, 1, 3, 70.00, 190.00, 0.00, 'REGULAT', '10:00:00', NULL);
INSERT INTO zbor (cod_cursa, companie_aeriana_id, model_avion_id, oras_plecare_id, oras_destinatie_id, pret_economy, pret_business, pret_first_class, tip_zbor, ora_zborului, sezon_id)
VALUES ('RO202', 1, 3, 3, 1, 70.00, 190.00, 0.00, 'REGULAT', '14:15:00', NULL);
INSERT INTO zbor (cod_cursa, companie_aeriana_id, model_avion_id, oras_plecare_id, oras_destinatie_id, pret_economy, pret_business, pret_first_class, tip_zbor, ora_zborului, sezon_id)
VALUES ('RO301', 1, 5, 1, 4, 45.00, 0.00, 0.00, 'REGULAT', '07:00:00', NULL);
INSERT INTO zbor (cod_cursa, companie_aeriana_id, model_avion_id, oras_plecare_id, oras_destinatie_id, pret_economy, pret_business, pret_first_class, tip_zbor, ora_zborului, sezon_id)
VALUES ('RO302', 1, 5, 4, 1, 45.00, 0.00, 0.00, 'REGULAT', '20:30:00', NULL);
INSERT INTO zbor (cod_cursa, companie_aeriana_id, model_avion_id, oras_plecare_id, oras_destinatie_id, pret_economy, pret_business, pret_first_class, tip_zbor, ora_zborului, sezon_id)
VALUES ('RO901', 1, 5, 2, 9, 40.00, 0.00, 0.00, 'REGULAT', '12:00:00', NULL);
INSERT INTO zbor (cod_cursa, companie_aeriana_id, model_avion_id, oras_plecare_id, oras_destinatie_id, pret_economy, pret_business, pret_first_class, tip_zbor, ora_zborului, sezon_id)
VALUES ('RO902', 1, 5, 9, 2, 40.00, 0.00, 0.00, 'REGULAT', '15:45:00', NULL);
INSERT INTO zbor (cod_cursa, companie_aeriana_id, model_avion_id, oras_plecare_id, oras_destinatie_id, pret_economy, pret_business, pret_first_class, tip_zbor, ora_zborului, sezon_id)
VALUES ('RO401', 1, 6, 1, 7, 55.00, 150.00, 0.00, 'REGULAT', '09:30:00', NULL);
INSERT INTO zbor (cod_cursa, companie_aeriana_id, model_avion_id, oras_plecare_id, oras_destinatie_id, pret_economy, pret_business, pret_first_class, tip_zbor, ora_zborului, sezon_id)
VALUES ('RO402', 1, 6, 7, 1, 55.00, 150.00, 0.00, 'REGULAT', '19:00:00', NULL);
INSERT INTO zbor (cod_cursa, companie_aeriana_id, model_avion_id, oras_plecare_id, oras_destinatie_id, pret_economy, pret_business, pret_first_class, tip_zbor, ora_zborului, sezon_id)
VALUES ('RO951', 1, 6, 3, 10, 60.00, 160.00, 0.00, 'REGULAT', '11:15:00', NULL);
INSERT INTO zbor (cod_cursa, companie_aeriana_id, model_avion_id, oras_plecare_id, oras_destinatie_id, pret_economy, pret_business, pret_first_class, tip_zbor, ora_zborului, sezon_id)
VALUES ('RO952', 1, 6, 10, 3, 60.00, 160.00, 0.00, 'REGULAT', '21:30:00', NULL);

-- SEZONIERE (Aici e modificarea! Am inlocuit textele cu ID-urile din tabelul sezoane: 1, 2, 3)
INSERT INTO zbor (cod_cursa, companie_aeriana_id, model_avion_id, oras_plecare_id, oras_destinatie_id, pret_economy, pret_business, pret_first_class, tip_zbor, ora_zborului, sezon_id)
VALUES ('WZZ501', 2, 4, 1, 2, 120.00, 450.00, 1200.00, 'SEZONIER', '10:00:00', 1);
INSERT INTO zbor (cod_cursa, companie_aeriana_id, model_avion_id, oras_plecare_id, oras_destinatie_id, pret_economy, pret_business, pret_first_class, tip_zbor, ora_zborului, sezon_id)
VALUES ('WZZ502', 2, 2, 2, 1, 115.00, 430.00, 1150.00, 'SEZONIER', '14:30:00', 1);
INSERT INTO zbor (cod_cursa, companie_aeriana_id, model_avion_id, oras_plecare_id, oras_destinatie_id, pret_economy, pret_business, pret_first_class, tip_zbor, ora_zborului, sezon_id)
VALUES ('WZZ701', 2, 3, 3, 4, 90.00, 250.00, 0.00, 'SEZONIER', '11:00:00', 3);
INSERT INTO zbor (cod_cursa, companie_aeriana_id, model_avion_id, oras_plecare_id, oras_destinatie_id, pret_economy, pret_business, pret_first_class, tip_zbor, ora_zborului, sezon_id)
VALUES ('WZZ702', 2, 3, 4, 3, 90.00, 250.00, 0.00, 'SEZONIER', '17:30:00', 3);
INSERT INTO zbor (cod_cursa, companie_aeriana_id, model_avion_id, oras_plecare_id, oras_destinatie_id, pret_economy, pret_business, pret_first_class, tip_zbor, ora_zborului, sezon_id)
VALUES ('RYR601', 3, 1, 2, 5, 80.00, 220.00, 0.00, 'SEZONIER', '08:15:00', 2);
INSERT INTO zbor (cod_cursa, companie_aeriana_id, model_avion_id, oras_plecare_id, oras_destinatie_id, pret_economy, pret_business, pret_first_class, tip_zbor, ora_zborului, sezon_id)
VALUES ('RYR602', 3, 1, 5, 2, 80.00, 220.00, 0.00, 'SEZONIER', '20:45:00', 2);
INSERT INTO zbor (cod_cursa, companie_aeriana_id, model_avion_id, oras_plecare_id, oras_destinatie_id, pret_economy, pret_business, pret_first_class, tip_zbor, ora_zborului, sezon_id)
VALUES ('RYR801', 3, 1, 4, 8, 75.00, 210.00, 0.00, 'SEZONIER', '09:45:00', 1);
INSERT INTO zbor (cod_cursa, companie_aeriana_id, model_avion_id, oras_plecare_id, oras_destinatie_id, pret_economy, pret_business, pret_first_class, tip_zbor, ora_zborului, sezon_id)
VALUES ('RYR802', 3, 1, 8, 4, 75.00, 210.00, 0.00, 'SEZONIER', '15:20:00', 1);

-- ==========================================
-- 5. ZILE OPERARE (Depinde de Zboruri)
-- ==========================================
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (1, 'MONDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (1, 'WEDNESDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (1, 'FRIDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (2, 'TUESDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (2, 'THURSDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (2, 'SATURDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (3, 'MONDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (3, 'TUESDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (3, 'WEDNESDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (3, 'THURSDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (3, 'FRIDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (3, 'SATURDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (3, 'SUNDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (4, 'SATURDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (4, 'SUNDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (5, 'MONDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (5, 'THURSDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (6, 'WEDNESDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (6, 'SUNDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (7, 'TUESDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (7, 'FRIDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (8, 'THURSDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (8, 'SATURDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (9, 'MONDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (9, 'WEDNESDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (9, 'FRIDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (10, 'TUESDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (10, 'THURSDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (10, 'SATURDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (11, 'MONDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (11, 'FRIDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (12, 'THURSDAY');
INSERT INTO zbor_zile_operare (zbor_id, ziua_saptamanii) VALUES (12, 'SUNDAY');


INSERT INTO disponibilitate_zbor (zbor_id, locuri_libere_economy, locuri_libere_business, locuri_libere_first_class) VALUES (1, 150, 30, 10);
INSERT INTO disponibilitate_zbor (zbor_id, locuri_libere_economy, locuri_libere_business, locuri_libere_first_class) VALUES (2, 150, 30, 10);
INSERT INTO disponibilitate_zbor (zbor_id, locuri_libere_economy, locuri_libere_business, locuri_libere_first_class) VALUES (3, 150, 30, 10);