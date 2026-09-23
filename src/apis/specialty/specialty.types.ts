
export interface CreateSpecialtyInput {
  name: string;
}
export interface ISpecialty extends CreateSpecialtyInput {
  id?: number;
  is_active?: boolean;
  created_at?: Date;
}


