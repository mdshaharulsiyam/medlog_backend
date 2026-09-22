export enum UserRole {
  USER = "user",
  DOCTOR = "doctor",
  ADMIN = "admin",
}

export interface SignInData {
  email: string;
  password: string;
}
export interface ChangePasswordData extends SignInData {
  oldPassword: string;
  confirmPassword: string;
} 
export interface SignUpData extends SignInData {
  username: string;
}

export interface userType extends SignUpData {
  role: UserRole;
  id: string;
  img: string;
  isVerified: boolean;
  isBlocked: boolean;
  created_at: Date;
}
