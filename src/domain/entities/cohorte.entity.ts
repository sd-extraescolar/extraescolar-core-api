import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Evento } from './evento.entity';
import { Alumno } from './alumno.entity';

@Entity('cohortes')
export class Cohorte {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Column({ type: 'int' })
  presencialidad_total: number;

  @Column({ type: 'int' })
  cantidad_clases_total: number;

  @Column({ type: 'json' })
  profesores: string[];

  @Column({ type: 'json' })
  alumnos: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Evento, evento => evento.cohorte)
  eventos: Evento[];

  @OneToMany(() => Alumno, alumno => alumno.cohorte)
  alumnos_entities: Alumno[];

  constructor(
    id: string,
    presencialidad_total: number,
    cantidad_clases_total: number,
    profesores: string[] = [],
    alumnos: string[] = [],
  ) {
    this.id = id;
    this.presencialidad_total = presencialidad_total;
    this.cantidad_clases_total = cantidad_clases_total;
    this.profesores = profesores;
    this.alumnos = alumnos;
  }

  addProfesor(profesorId: string): void {
    if (!this.profesores.includes(profesorId)) {
      this.profesores.push(profesorId);
    }
  }

  removeProfesor(profesorId: string): void {
    this.profesores = this.profesores.filter(id => id !== profesorId);
  }

  addAlumno(alumnoId: string): void {
    if (!this.alumnos.includes(alumnoId)) {
      this.alumnos.push(alumnoId);
    }
  }

  removeAlumno(alumnoId: string): void {
    this.alumnos = this.alumnos.filter(id => id !== alumnoId);
  }

  updatePresencialidad(presencialidad_total: number): void {
    this.presencialidad_total = presencialidad_total;
  }

  updateCantidadClases(cantidad_clases_total: number): void {
    this.cantidad_clases_total = cantidad_clases_total;
  }
}
