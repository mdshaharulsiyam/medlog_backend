enum UserRole {
  USER = "user",
  DOCTOR = "doctor",
  ADMIN = "admin",
}

interface SignInData {
  email: string;
  password: string;
}

interface SignUpData extends SignInData {
  username: string;
}

interface user extends SignUpData {
  role: UserRole;
  id: string;
  img: string;
  isVerified: boolean;
  created_at: Date;
}