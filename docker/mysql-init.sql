-- Creates the databases the app's Prisma schemas + raw pools expect, so a
-- fresh `docker compose up` yields a working local stack. Runs once on first
-- MySQL init (empty data volume).
CREATE DATABASE IF NOT EXISTS nexs_mydb        CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS nexs_dispatch    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS nexs_lens_lab    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS nexs_metal_frame CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS bosch_cv_db      CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
