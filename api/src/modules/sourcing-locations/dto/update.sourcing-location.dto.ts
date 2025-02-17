import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSourcingLocationDto } from 'modules/sourcing-locations/dto/create.sourcing-location.dto';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateSourcingLocationDto extends PartialType(
  CreateSourcingLocationDto,
) {}
