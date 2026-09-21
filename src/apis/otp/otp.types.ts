export interface CreateOtp {
  email: string;
}
export interface VerifyOtp extends CreateOtp {
  otp: string;
}

export interface IOtp extends CreateOtp {
  created_at: Date;
}
 