-- =========================================
-- USER ROLE ENUM
-- =========================================

CREATE TYPE user_role AS ENUM (
    'user',
    'doctor',
    'pharmacist',
    'admin'
);


-- =========================================
-- USERS TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS users (

    id SERIAL PRIMARY KEY,

    username VARCHAR(50) NOT NULL,

    email VARCHAR(50) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    img TEXT,

    is_verified BOOLEAN DEFAULT FALSE,

    is_blocked BOOLEAN DEFAULT FALSE,

    role user_role NOT NULL DEFAULT 'user',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- OTP TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS otp (

    email VARCHAR(50) PRIMARY KEY,

    otp INTEGER NOT NULL
        CHECK (otp BETWEEN 100000 AND 999999),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- GENDER ENUM
-- =========================================

CREATE TYPE gender AS ENUM (
    'male',
    'female',
    'other'
);


-- =========================================
-- PROFILE TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS profile (

    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL UNIQUE
        REFERENCES users(id)
        ON DELETE CASCADE,

    phone VARCHAR(20) UNIQUE NOT NULL,

    first_name VARCHAR(50) NOT NULL,

    last_name VARCHAR(50) NOT NULL,

    gender gender DEFAULT 'other',

    experience_started_at DATE,

    date_of_birth DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- SPECIALTIES TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS specialties (

    id SERIAL PRIMARY KEY,

    name VARCHAR(50) UNIQUE NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- USER SPECIALTY TABLE
-- MANY-TO-MANY
-- =========================================

CREATE TABLE IF NOT EXISTS users_specialty (

    id SERIAL PRIMARY KEY,

    profile_id INTEGER NOT NULL
        REFERENCES profile(id)
        ON DELETE CASCADE,

    specialty_id INTEGER NOT NULL
        REFERENCES specialties(id)
        ON DELETE CASCADE,

    UNIQUE(profile_id, specialty_id)
);