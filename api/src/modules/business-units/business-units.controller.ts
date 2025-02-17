import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BusinessUnitsService } from 'modules/business-units/business-units.service';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  JSONAPIQueryParams,
  JSONAPISingleEntityQueryParams,
} from 'decorators/json-api-parameters.decorator';
import {
  FetchSpecification,
  ProcessFetchSpecification,
} from 'nestjs-base-service';
import {
  BusinessUnit,
  businessUnitResource,
} from 'modules/business-units/business-unit.entity';
import { CreateBusinessUnitDto } from 'modules/business-units/dto/create.business-unit.dto';
import { UpdateBusinessUnitDto } from 'modules/business-units/dto/update.business-unit.dto';

@Controller(`/api/v1/business-units`)
@ApiTags(businessUnitResource.className)
export class BusinessUnitsController {
  constructor(public readonly businessUnitsService: BusinessUnitsService) {}

  @ApiOperation({
    description: 'Find all business units',
  })
  @ApiOkResponse({
    type: BusinessUnit,
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @JSONAPIQueryParams({
    availableFilters: businessUnitResource.columnsAllowedAsFilter.map(
      (columnName: string) => ({
        name: columnName,
      }),
    ),
  })
  @Get()
  async findAll(
    @ProcessFetchSpecification({
      allowedFilters: businessUnitResource.columnsAllowedAsFilter,
    })
    fetchSpecification: FetchSpecification,
  ): Promise<BusinessUnit> {
    const results = await this.businessUnitsService.findAllPaginated(
      fetchSpecification,
    );
    return this.businessUnitsService.serialize(results.data, results.metadata);
  }

  @ApiOperation({ description: 'Find business unit by id' })
  @ApiOkResponse({ type: BusinessUnit })
  @JSONAPISingleEntityQueryParams()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BusinessUnit> {
    return await this.businessUnitsService.serialize(
      await this.businessUnitsService.getById(id),
    );
  }

  @ApiOperation({ description: 'Create a business unit' })
  @ApiOkResponse({ type: BusinessUnit })
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() dto: CreateBusinessUnitDto): Promise<BusinessUnit> {
    return await this.businessUnitsService.serialize(
      await this.businessUnitsService.create(dto),
    );
  }

  @ApiOperation({ description: 'Updates a business unit' })
  @ApiOkResponse({ type: BusinessUnit })
  @Patch(':id')
  async update(
    @Body(new ValidationPipe()) dto: UpdateBusinessUnitDto,
    @Param('id') id: string,
  ): Promise<BusinessUnit> {
    return await this.businessUnitsService.serialize(
      await this.businessUnitsService.update(id, dto),
    );
  }

  @ApiOperation({ description: 'Deletes a business unit' })
  @ApiOkResponse()
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this.businessUnitsService.remove(id);
  }
}
