import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export interface ClassroomCourse {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  creationTime: string;
  updateTime: string;
  enrollmentCode: string;
  courseState: string;
  alternateLink: string;
  teacherGroupEmail: string;
  courseGroupEmail: string;
}

export interface ClassroomStudent {
  userId: string;
  profile: {
    id: string;
    name: {
      givenName: string;
      familyName: string;
      fullName: string;
    };
    emailAddress: string;
    photoUrl?: string;
  };
  courseId: string;
}

export interface ClassroomTeacher {
  userId: string;
  profile: {
    id: string;
    name: {
      givenName: string;
      familyName: string;
      fullName: string;
    };
    emailAddress: string;
    photoUrl?: string;
  };
  courseId: string;
}

@Injectable()
export class GoogleClassroomService {
  private readonly logger = new Logger(GoogleClassroomService.name);
  private classroom: any;
  private auth: OAuth2Client;

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    this.auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );

    this.classroom = google.classroom({ version: 'v1', auth: this.auth });
  }

  private setUserCredentials(accessToken: string, refreshToken?: string): void {
    this.auth.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  private async ensureValidToken(): Promise<void> {
    try {
      if (!this.auth.credentials.access_token) {
        throw new Error('No access token available');
      }

      // Verificar si el token está próximo a expirar (opcional)
      // Los tokens de Google expiran en 1 hora
      await this.auth.getAccessToken();
    } catch (error) {
      this.logger.warn('Access token expired or invalid, attempting to refresh...');
      
      if (this.auth.credentials.refresh_token) {
        try {
          const { credentials } = await this.auth.refreshAccessToken();
          this.auth.setCredentials(credentials);
          
          // Actualizar variables de entorno (en producción, guardar en BD)
          if (credentials.access_token) {
            process.env.GOOGLE_ACCESS_TOKEN = credentials.access_token;
          }
          
          this.logger.log('Access token refreshed successfully');
        } catch (refreshError) {
          this.logger.error('Failed to refresh access token:', refreshError);
          throw new Error('Authentication failed. Please re-authenticate.');
        }
      } else {
        this.logger.warn('No refresh token available. Using current access token.');
        // No lanzar error, solo usar el token actual
      }
    }
  }

  async getCourse(courseId: string, accessToken: string, refreshToken?: string): Promise<ClassroomCourse | null> {
    try {
      this.setUserCredentials(accessToken, refreshToken);
      await this.ensureValidToken();
      
      const response = await this.classroom.courses.get({
        id: courseId,
      });

      if (!response.data) {
        return null;
      }

      return {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description,
        ownerId: response.data.ownerId,
        creationTime: response.data.creationTime,
        updateTime: response.data.updateTime,
        enrollmentCode: response.data.enrollmentCode,
        courseState: response.data.courseState,
        alternateLink: response.data.alternateLink,
        teacherGroupEmail: response.data.teacherGroupEmail,
        courseGroupEmail: response.data.courseGroupEmail,
      };
    } catch (error) {
      this.logger.error(`Error fetching course ${courseId}:`, error.message);
      return null;
    }
  }

  async getCourseStudents(courseId: string, accessToken: string, refreshToken?: string): Promise<ClassroomStudent[]> {
    try {
      this.setUserCredentials(accessToken, refreshToken);
      await this.ensureValidToken();
      
      const response = await this.classroom.courses.students.list({
        courseId: courseId,
      });

      if (!response.data.students) {
        return [];
      }

      return response.data.students.map((student: any) => ({
        userId: student.userId,
        profile: {
          id: student.profile.id,
          name: {
            givenName: student.profile.name.givenName,
            familyName: student.profile.name.familyName,
            fullName: student.profile.name.fullName,
          },
          emailAddress: student.profile.emailAddress,
          photoUrl: student.profile.photoUrl,
        },
        courseId: courseId,
      }));
    } catch (error) {
      this.logger.error(`Error fetching students for course ${courseId}:`, error.message);
      return [];
    }
  }

  async getCourseTeachers(courseId: string, accessToken: string, refreshToken?: string): Promise<ClassroomTeacher[]> {
    try {
      this.setUserCredentials(accessToken, refreshToken);
      await this.ensureValidToken();
      
      const response = await this.classroom.courses.teachers.list({
        courseId: courseId,
      });

      if (!response.data.teachers) {
        return [];
      }

      return response.data.teachers.map((teacher: any) => ({
        userId: teacher.userId,
        profile: {
          id: teacher.profile.id,
          name: {
            givenName: teacher.profile.name.givenName,
            familyName: teacher.profile.name.familyName,
            fullName: teacher.profile.name.fullName,
          },
          emailAddress: teacher.profile.emailAddress,
          photoUrl: teacher.profile.photoUrl,
        },
        courseId: courseId,
      }));
    } catch (error) {
      this.logger.error(`Error fetching teachers for course ${courseId}:`, error.message);
      return [];
    }
  }

  async searchCourses(accessToken: string, refreshToken?: string, query?: string): Promise<ClassroomCourse[]> {
    try {
      this.setUserCredentials(accessToken, refreshToken);
      await this.ensureValidToken();
      
      const params: any = {
        courseStates: ['ACTIVE'],
      };

      if (query) {
        params.query = query;
      }

      const response = await this.classroom.courses.list(params);

      if (!response.data.courses) {
        return [];
      }

      return response.data.courses.map((course: any) => ({
        id: course.id,
        name: course.name,
        description: course.description,
        ownerId: course.ownerId,
        creationTime: course.creationTime,
        updateTime: course.updateTime,
        enrollmentCode: course.enrollmentCode,
        courseState: course.courseState,
        alternateLink: course.alternateLink,
        teacherGroupEmail: course.teacherGroupEmail,
        courseGroupEmail: course.courseGroupEmail,
      }));
    } catch (error) {
      this.logger.error('Error searching courses:', error.message);
      return [];
    }
  }

  async getStudentById(courseId: string, studentId: string, accessToken: string, refreshToken?: string): Promise<ClassroomStudent | null> {
    try {
      this.setUserCredentials(accessToken, refreshToken);
      await this.ensureValidToken();
      
      const response = await this.classroom.courses.students.get({
        courseId: courseId,
        userId: studentId,
      });

      if (!response.data) {
        return null;
      }

      return {
        userId: response.data.userId,
        profile: {
          id: response.data.profile.id,
          name: {
            givenName: response.data.profile.name.givenName,
            familyName: response.data.profile.name.familyName,
            fullName: response.data.profile.name.fullName,
          },
          emailAddress: response.data.profile.emailAddress,
          photoUrl: response.data.profile.photoUrl,
        },
        courseId: courseId,
      };
    } catch (error) {
      this.logger.error(`Error fetching student ${studentId} from course ${courseId}:`, error.message);
      return null;
    }
  }

  async verifyStudentInCourse(courseId: string, studentId: string, accessToken: string, refreshToken?: string): Promise<boolean> {
    try {
      const student = await this.getStudentById(courseId, studentId, accessToken, refreshToken);
      return student !== null;
    } catch (error) {
      this.logger.error(`Error verifying student ${studentId} in course ${courseId}:`, error.message);
      return false;
    }
  }
}
