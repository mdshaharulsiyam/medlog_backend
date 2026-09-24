--  authentication and otp verification table
CREATE TYPE user_role AS ENUM ('user', 'doctor', 'pharmacist', 'admin');
ALTER TYPE user_role ADD VALUE 'pharmacist';
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    img TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_blocked BOOLEAN DEFAULT FALSE,
    role user_role DEFAULT 'user'  NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN IsBlocked BOOLEAN DEFAULT FALSE;

ALTER TABLE users RENAME COLUMN IsBlocked TO is_blocked;
ALTER TABLE users RENAME COLUMN isVerified TO is_verified;
ALTER TABLE users
DROP CONSTRAINT users_username_key;

CREATE TABLE IF NOT EXISTS otp(
    email VARCHAR(50) UNIQUE NOT NULL,
    otp INTEGER CHECK (otp BETWEEN 100000 AND 999999),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

SELECT * FROM otp WHERE email = $1 AND otp = $2 AND created_at >= NOW() - INTERVAL '5 minutes';

SELECT * FROM users WHERE email = $1 AND password =$2;

-- profile table


DO
$$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender') THEN
        CREATE TYPE gender AS ENUM ('male', 'female', 'other');
    END IF;
END
$$;


CREATE TABLE IF NOT EXISTS profile(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    phone VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender gender DEFAULT 'other',
    years_of_experience DATE DEFAULT CURRENT_DATE,
    date_of_birth DATE DEFAULT CURRENT_DATE,
);

ALTER TABLE profile ALTER COLUMN phone TYPE VARCHAR(20) USING phone::VARCHAR(20);
ALTER TABLE profile
ALTER COLUMN gender TYPE gender
USING gender::gender;
-- specialty table
CREATE TABLE IF NOT EXISTS specialties(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
)

CREATE TABLE IF NOT EXISTS users_specialty(
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES profile (id) ON DELETE CASCADE,
    specialty_id INTEGER REFERENCES specialty(id) ON DELETE CASCADE,
    UNIQUE(profile_id, specialty_id)
)