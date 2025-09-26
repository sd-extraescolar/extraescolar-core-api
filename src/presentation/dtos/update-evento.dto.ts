import { IsDateString, IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateEventoDto {
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  alumnosPresentes?: string[];
}
