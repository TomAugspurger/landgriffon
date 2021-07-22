import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TASK_STATUS } from 'modules/indicator-records/indicator-record.entity';

export class CreateIndicatorRecordDto {
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  value?: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  year!: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  sourcingRecordId?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  indicatorId?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  indicatorCoefficientId?: string;

  @IsString()
  @IsOptional()
  @IsEnum(Object.values(TASK_STATUS))
  @ApiPropertyOptional()
  status?: string;

  @IsString()
  @MinLength(4)
  @MaxLength(50)
  statusMsg: string;
}
