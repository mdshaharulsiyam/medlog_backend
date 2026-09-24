export interface IProfile {
  id?: number;
  user_id: number;
  phone: number;
  first_name: string;
  last_name: string;
  gender?: string;
  years_of_experience?: Date;
  date_of_birth?: Date;
  created_at?: Date;
}
