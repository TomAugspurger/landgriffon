import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSourcingLocationGroupDto } from 'modules/sourcing-location-groups/dto/create.sourcing-location-group.dto';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateSourcingLocationGroupDto extends PartialType(
  CreateSourcingLocationGroupDto,
) {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(40)
  @ApiProperty()
  title?: string;
}
