import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cohorte } from './cohorte.entity';

@Entity('eventos')
export class Evento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  fk_cohorte_id: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'json' })
  alumnos_presentes: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Cohorte, cohorte => cohorte.eventos)
  @JoinColumn({ name: 'fk_cohorte_id' })
  cohorte: Cohorte;

  constructor(
    fk_cohorte_id: string,
    fecha: Date,
    alumnos_presentes: string[] = [],
  ) {
    this.fk_cohorte_id = fk_cohorte_id;
    this.fecha = fecha;
    this.alumnos_presentes = alumnos_presentes;
  }

  addAlumnoPresente(alumnoId: string): void {
    if (!this.alumnos_presentes.includes(alumnoId)) {
      this.alumnos_presentes.push(alumnoId);
    }
  }

  removeAlumnoPresente(alumnoId: string): void {
    this.alumnos_presentes = this.alumnos_presentes.filter(id => id !== alumnoId);
  }

  updateFecha(fecha: Date): void {
    this.fecha = fecha;
  }

  getCantidadAlumnosPresentes(): number {
    return this.alumnos_presentes.length;
  }
}
