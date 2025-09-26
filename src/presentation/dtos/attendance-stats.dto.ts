export class AttendanceStatsDto {
  totalAlumnos: number;
  alumnosPresentes: number;
  porcentajeAsistencia: number;
  alumnosFaltantes: string[];

  constructor(
    totalAlumnos: number,
    alumnosPresentes: number,
    porcentajeAsistencia: number,
    alumnosFaltantes: string[],
  ) {
    this.totalAlumnos = totalAlumnos;
    this.alumnosPresentes = alumnosPresentes;
    this.porcentajeAsistencia = porcentajeAsistencia;
    this.alumnosFaltantes = alumnosFaltantes;
  }
}
