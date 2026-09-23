export interface IProfile {
  id?: number;
  title: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateProfileInput {
  title: string;
  description?: string;
}

export interface UpdateProfileInput {
  title?: string;
  description?: string;
  is_active?: boolean;
}
