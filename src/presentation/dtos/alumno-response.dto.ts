export class AlumnoResponseDto {
  id: string;
  fk_cohorte_id: string;
  porcentaje_presencialidad: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<AlumnoResponseDto>) {
    Object.assign(this, partial);
  }
}
