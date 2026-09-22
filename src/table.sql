CREATE TYPE user_role AS ENUM ('user', 'doctor', 'admin');
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