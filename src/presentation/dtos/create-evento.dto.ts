import { IsString, IsDateString, IsArray, IsOptional, IsUUID } from 'class-validator';

export class CreateEventoDto {
  @IsString()
  cohorteId: string;

  @IsDateString()
  fecha: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  alumnosPresentes?: string[];
}
