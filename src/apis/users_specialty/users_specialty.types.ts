

export interface CreateUsersSpecialtyInput {
  specialty_id: string;
  profile_id: string;
}

export interface IUsersSpecialty {
  id?: number;
  title: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}