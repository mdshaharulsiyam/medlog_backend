export interface IUsersSpecialty {
  id?: number;
  title: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUsersSpecialtyInput {
  title: string;
  description?: string;
}

export interface UpdateUsersSpecialtyInput {
  title?: string;
  description?: string;
  is_active?: boolean;
}
