export enum UserRole {
  USER = "user",
  DOCTOR = "doctor",
  ADMIN = "admin",
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData extends SignInData {
  username: string;
}

export interface user extends SignUpData {
  role: UserRole;
  id: string;
  img: string;
  isVerified: boolean;
  isBlocked: boolean;
  created_at: Date;
}
