import { IsArray, IsString } from 'class-validator';

export class AttendanceUpdateDto {
  @IsArray()
  @IsString({ each: true })
  alumnoIds: string[];
}
