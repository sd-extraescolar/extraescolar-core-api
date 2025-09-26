import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { GetCohorteUseCase, GetAlumnoByCohorteUseCase } from '../use-cases';
import { Cohorte, Alumno } from '@domain/entities';
import { CohorteRepositoryPort, COHORTE_REPOSITORY_PORT } from '../../domain/ports';
import { GoogleClassroomService } from '../../infrastructure/services/google-classroom.service';

@Injectable()
export class CohorteService {
  private readonly logger = new Logger(CohorteService.name);

  constructor(
    private readonly getCohorteUseCase: GetCohorteUseCase,
    private readonly getAlumnoByCohorteUseCase: GetAlumnoByCohorteUseCase,
    @Inject(COHORTE_REPOSITORY_PORT)
    private readonly cohorteRepository: CohorteRepositoryPort,
    private readonly googleClassroomService: GoogleClassroomService,
  ) {}

  async getCohorteById(cohorteId: string, accessToken: string, refreshToken?: string): Promise<Cohorte | null> {
    let cohorte = await this.getCohorteUseCase.execute(cohorteId);
    
    if (!cohorte) {
      this.logger.log(`Cohorte ${cohorteId} not found in database. Attempting to sync from Google Classroom.`);
      cohorte = await this.syncCohorteFromClassroom(cohorteId, accessToken, refreshToken);
    }
    
    return cohorte;
  }

  async getAlumnoByCohorte(alumnoId: string, cohorteId: string): Promise<Alumno | null> {
    return await this.getAlumnoByCohorteUseCase.execute(alumnoId, cohorteId);
  }

  async getAllCohortes(): Promise<Cohorte[]> {
    return await this.cohorteRepository.findAll();
  }

  async getAllCohortesFromClassroom(accessToken: string, refreshToken?: string): Promise<any[]> {
    try {
      const courses = await this.googleClassroomService.searchCourses(accessToken, refreshToken);
      return courses;
    } catch (error) {
      this.logger.error('Error fetching courses from Google Classroom:', error.message);
      return [];
    }
  }

  async getCohorteStudentsFromClassroom(courseId: string, accessToken: string, refreshToken?: string): Promise<any[]> {
    try {
      const students = await this.googleClassroomService.getCourseStudents(courseId, accessToken, refreshToken);
      return students;
    } catch (error) {
      this.logger.error(`Error fetching students for course ${courseId} from Google Classroom:`, error.message);
      return [];
    }
  }

  async syncCohorteFromClassroom(courseId: string, accessToken: string, refreshToken?: string): Promise<Cohorte | null> {
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

  async verifyAndSyncCohorte(cohorteId: string, accessToken: string, refreshToken?: string): Promise<Cohorte> {
    let cohorte = await this.cohorteRepository.findById(cohorteId);
    
    if (!cohorte) {
      cohorte = await this.syncCohorteFromClassroom(cohorteId, accessToken, refreshToken);
      if (!cohorte) {
        throw new NotFoundException(`Cohorte ${cohorteId} not found in database or Google Classroom`);
      }
    }
    
    return cohorte;
  }
}
