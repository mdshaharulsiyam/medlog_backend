SELECT * FROM users WHERE email = email

INSERT INTO users (username,email,password,role)
VALUES ('')

INSERT INTO otp (email,otp)
VALUES ('', '')
ON CONFLICT (email)
DO UPDATE SET otp = EXCLUDED.otp, created_at = NOW()