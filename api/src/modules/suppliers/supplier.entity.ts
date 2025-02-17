import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

import { SourcingLocation } from 'modules/sourcing-locations/sourcing-location.entity';

import { BaseServiceResource } from 'types/resource.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TimestampedBaseEntity } from 'baseEntities/timestamped-base-entity';

export enum SUPPLIER_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export const supplierResource: BaseServiceResource = {
  className: 'Supplier',
  name: {
    singular: 'supplier',
    plural: 'suppliers',
  },
  entitiesAllowedAsIncludes: [],
  columnsAllowedAsFilter: ['name', 'description', 'status'],
};

@Entity()
@Tree('materialized-path')
export class Supplier extends TimestampedBaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @TreeChildren()
  children: Supplier[];

  @TreeParent()
  parent: Supplier;

  @Column({ nullable: true })
  @ApiPropertyOptional()
  parentId?: string;

  @ApiProperty()
  @Column({ nullable: false })
  name!: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  description?: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: SUPPLIER_STATUS,
    default: SUPPLIER_STATUS.ACTIVE,
  })
  status!: SUPPLIER_STATUS;

  @ApiPropertyOptional()
  @Column({ type: 'jsonb', nullable: true })
  metadata?: JSON;

  @OneToMany(
    () => SourcingLocation,
    (srcLoc: SourcingLocation) => srcLoc.material,
  )
  sourcingLocations: SourcingLocation[];
}
