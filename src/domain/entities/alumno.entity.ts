import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cohorte } from './cohorte.entity';

@Entity('alumnos')
export class Alumno {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  fk_cohorte_id: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  porcentaje_presencialidad: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Cohorte, cohorte => cohorte.alumnos_entities)
  @JoinColumn({ name: 'fk_cohorte_id' })
  cohorte: Cohorte;

  constructor(
    fk_cohorte_id: string,
    porcentaje_presencialidad: number = 0,
  ) {
    this.fk_cohorte_id = fk_cohorte_id;
    this.porcentaje_presencialidad = porcentaje_presencialidad;
  }

  updatePorcentajePresencialidad(porcentaje: number): void {
    if (porcentaje < 0 || porcentaje > 100) {
      throw new Error('El porcentaje debe estar entre 0 y 100');
    }
    this.porcentaje_presencialidad = porcentaje;
  }

  calcularPorcentajePresencialidad(totalClases: number, clasesPresente: number): void {
    if (totalClases <= 0) {
      throw new Error('El total de clases debe ser mayor a 0');
    }
    const porcentaje = (clasesPresente / totalClases) * 100;
    this.updatePorcentajePresencialidad(porcentaje);
  }
}
