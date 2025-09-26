import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { EventoRepositoryPort, EVENTO_REPOSITORY_PORT } from '../../domain/ports';
import { CohorteRepositoryPort, COHORTE_REPOSITORY_PORT } from '../../domain/ports';
import { AlumnoRepositoryPort, ALUMNO_REPOSITORY_PORT } from '../../domain/ports';
import { Evento } from '../../domain/entities/evento.entity';
import { Cohorte } from '../../domain/entities/cohorte.entity';
import { Alumno } from '../../domain/entities/alumno.entity';
import { GoogleClassroomService } from '../../infrastructure/services/google-classroom.service';

export interface CreateEventoDto {
  cohorteId: string;
  fecha: Date;
  alumnosPresentes?: string[];
}

export interface UpdateEventoDto {
  fecha?: Date;
  alumnosPresentes?: string[];
}

export interface AttendanceStats {
  totalAlumnos: number;
  alumnosPresentes: number;
  porcentajeAsistencia: number;
  alumnosFaltantes: string[];
}

@Injectable()
export class EventoService {
  private readonly logger = new Logger(EventoService.name);

  constructor(
    @Inject(EVENTO_REPOSITORY_PORT)
    private readonly eventoRepository: EventoRepositoryPort,
    @Inject(COHORTE_REPOSITORY_PORT)
    private readonly cohorteRepository: CohorteRepositoryPort,
    @Inject(ALUMNO_REPOSITORY_PORT)
    private readonly alumnoRepository: AlumnoRepositoryPort,
    private readonly googleClassroomService: GoogleClassroomService,
  ) {}

  async createEvento(createEventoDto: CreateEventoDto, accessToken: string, refreshToken?: string): Promise<Evento> {
    const { cohorteId, fecha, alumnosPresentes = [] } = createEventoDto;

    const cohorte = await this.verifyAndSyncCohorte(cohorteId, accessToken, refreshToken);

    const existingEvento = await this.eventoRepository.findByCohorteIdAndDate(cohorte.id, fecha);
    if (existingEvento) {
      throw new BadRequestException(`Evento already exists for cohorte ${cohorteId} on date ${fecha.toISOString()}`);
    }

    await this.validateAlumnosInCohorte(cohorte.id, alumnosPresentes, accessToken, refreshToken);

    const evento = new Evento(cohorte.id, fecha, alumnosPresentes);
    return await this.eventoRepository.save(evento);
  }

  async updateEvento(id: string, updateEventoDto: UpdateEventoDto, accessToken: string, refreshToken?: string): Promise<Evento> {
    const evento = await this.eventoRepository.findById(id);
    if (!evento) {
      throw new NotFoundException(`Evento with ID ${id} not found`);
    }

    if (updateEventoDto.fecha) {
      evento.updateFecha(updateEventoDto.fecha);
    }

    if (updateEventoDto.alumnosPresentes) {
      await this.validateAlumnosInCohorte(evento.fk_cohorte_id, updateEventoDto.alumnosPresentes, accessToken, refreshToken);
      evento.alumnos_presentes = updateEventoDto.alumnosPresentes;
    }

    return await this.eventoRepository.update(evento);
  }

  async getEventoById(id: string): Promise<Evento> {
    const evento = await this.eventoRepository.findById(id);
    if (!evento) {
      throw new NotFoundException(`Evento with ID ${id} not found`);
    }
    return evento;
  }

  async getEventosByCohorteId(cohorteId: string): Promise<Evento[]> {
    const cohorte = await this.cohorteRepository.findById(cohorteId);
    if (!cohorte) {
      throw new NotFoundException(`Cohorte with ID ${cohorteId} not found`);
    }

    return await this.eventoRepository.findByCohorteId(cohorteId);
  }

  async deleteEvento(id: string): Promise<void> {
    const evento = await this.eventoRepository.findById(id);
    if (!evento) {
      throw new NotFoundException(`Evento with ID ${id} not found`);
    }

    await this.eventoRepository.delete(id);
  }

  async addAlumnoPresente(eventoId: string, alumnoId: string, accessToken: string, refreshToken?: string): Promise<Evento> {
    const evento = await this.eventoRepository.findById(eventoId);
    if (!evento) {
      throw new NotFoundException(`Evento with ID ${eventoId} not found`);
    }

    await this.validateAlumnoInCohorte(evento.fk_cohorte_id, alumnoId, accessToken, refreshToken);
    evento.addAlumnoPresente(alumnoId);

    return await this.eventoRepository.update(evento);
  }

  async removeAlumnoPresente(eventoId: string, alumnoId: string): Promise<Evento> {
    const evento = await this.eventoRepository.findById(eventoId);
    if (!evento) {
      throw new NotFoundException(`Evento with ID ${eventoId} not found`);
    }

    evento.removeAlumnoPresente(alumnoId);
    return await this.eventoRepository.update(evento);
  }

  async getAttendanceStats(eventoId: string): Promise<AttendanceStats> {
    const evento = await this.eventoRepository.findById(eventoId);
    if (!evento) {
      throw new NotFoundException(`Evento with ID ${eventoId} not found`);
    }

    const cohorte = await this.cohorteRepository.findById(evento.fk_cohorte_id);
    if (!cohorte) {
      throw new NotFoundException(`Cohorte with ID ${evento.fk_cohorte_id} not found`);
    }

    const totalAlumnos = cohorte.alumnos.length;
    const alumnosPresentes = evento.alumnos_presentes.length;
    const porcentajeAsistencia = totalAlumnos > 0 ? (alumnosPresentes / totalAlumnos) * 100 : 0;
    const alumnosFaltantes = cohorte.alumnos.filter(id => !evento.alumnos_presentes.includes(id));

    return {
      totalAlumnos,
      alumnosPresentes,
      porcentajeAsistencia,
      alumnosFaltantes,
    };
  }

  private async validateAlumnosInCohorte(cohorteId: string, alumnoIds: string[], accessToken: string, refreshToken?: string): Promise<void> {
    const cohorte = await this.verifyAndSyncCohorte(cohorteId, accessToken, refreshToken);

    for (const alumnoId of alumnoIds) {
      await this.validateAlumnoInCohorte(cohorteId, alumnoId, accessToken, refreshToken);
    }
  }

  private async validateAlumnoInCohorte(cohorteId: string, alumnoId: string, accessToken: string, refreshToken?: string): Promise<void> {
    const cohorte = await this.verifyAndSyncCohorte(cohorteId, accessToken, refreshToken);

    if (!cohorte.alumnos.includes(alumnoId)) {
      this.logger.warn(`Alumno ${alumnoId} not found in cohorte ${cohorteId}. Attempting to sync with Google Classroom.`);
      
      const classroomStudent = await this.googleClassroomService.getStudentById(cohorteId, alumnoId, accessToken, refreshToken);
      if (!classroomStudent) {
        throw new BadRequestException(`Alumno ${alumnoId} not found in Google Classroom course ${cohorteId}`);
      }

      cohorte.addAlumno(alumnoId);
      await this.cohorteRepository.update(cohorteId, { alumnos: cohorte.alumnos });
      
      this.logger.log(`Successfully synced alumno ${alumnoId} to cohorte ${cohorteId} from Google Classroom`);
    }
  }

  private async verifyAndSyncCohorte(cohorteId: string, accessToken: string, refreshToken?: string): Promise<Cohorte> {
    let cohorte = await this.cohorteRepository.findById(cohorteId);
    
    if (!cohorte) {
      cohorte = await this.syncCohorteFromClassroom(cohorteId, accessToken, refreshToken);
      if (!cohorte) {
        throw new NotFoundException(`Cohorte ${cohorteId} not found in database or Google Classroom`);
      }
    }
    
    return cohorte;
  }

  private async syncCohorteFromClassroom(courseId: string, accessToken: string, refreshToken?: string): Promise<Cohorte | null> {
    try {
      const classroomCourse = await this.googleClassroomService.getCourse(courseId, accessToken, refreshToken);
      if (!classroomCourse) {
        this.logger.warn(`Course ${courseId} not found in Google Classroom`);
        return null;
      }

      const classroomStudents = await this.googleClassroomService.getCourseStudents(courseId, accessToken, refreshToken);
      const classroomTeachers = await this.googleClassroomService.getCourseTeachers(courseId, accessToken, refreshToken);

      const studentIds = classroomStudents.map(student => student.userId);
      const teacherIds = classroomTeachers.map(teacher => teacher.userId);

      const cohorte = new Cohorte(
        courseId, // id (Google Classroom ID)
        0, // presencialidad_total - se calculará después
        0, // cantidad_clases_total - se calculará después
        teacherIds,
        studentIds,
      );

      const savedCohorte = await this.cohorteRepository.save(cohorte);
      
      this.logger.log(`Successfully synced cohorte ${courseId} from Google Classroom with ${studentIds.length} students and ${teacherIds.length} teachers`);
      
      return savedCohorte;
    } catch (error) {
      this.logger.error(`Error syncing cohorte ${courseId} from Google Classroom:`, error.message);
      return null;
    }
  }

  async addAlumnosPresentes(eventoId: string, alumnoIds: string[], accessToken: string, refreshToken?: string): Promise<Evento> {
    const evento = await this.eventoRepository.findById(eventoId);
    if (!evento) {
      throw new NotFoundException(`Evento ${eventoId} not found`);
    }

    const cohorte = await this.verifyAndSyncCohorte(evento.fk_cohorte_id, accessToken, refreshToken);
    
    for (const alumnoId of alumnoIds) {
      if (!cohorte.alumnos.includes(alumnoId)) {
        throw new BadRequestException(`Alumno ${alumnoId} not found in cohorte ${cohorte.id}`);
      }
      
      if (!evento.alumnos_presentes.includes(alumnoId)) {
        evento.alumnos_presentes.push(alumnoId);
      }
    }

    return await this.eventoRepository.save(evento);
  }

  async removeAlumnosPresentes(eventoId: string, alumnoIds: string[]): Promise<Evento> {
    const evento = await this.eventoRepository.findById(eventoId);
    if (!evento) {
      throw new NotFoundException(`Evento ${eventoId} not found`);
    }

    for (const alumnoId of alumnoIds) {
      const index = evento.alumnos_presentes.indexOf(alumnoId);
      if (index > -1) {
        evento.alumnos_presentes.splice(index, 1);
      }
    }

    return await this.eventoRepository.save(evento);
  }
}
