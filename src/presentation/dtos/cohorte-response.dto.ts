export class CohorteResponseDto {
  id: string;
  presencialidad_total: number;
  cantidad_clases_total: number;
  profesores: string[];
  alumnos: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<CohorteResponseDto>) {
    Object.assign(this, partial);
  }
}
