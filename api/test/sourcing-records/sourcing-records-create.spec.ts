import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'app.module';
import { SourcingRecordsModule } from 'modules/sourcing-records/sourcing-records.module';
import { SourcingRecordRepository } from 'modules/sourcing-records/sourcing-record.repository';
import { createSourcingLocation } from '../entity-mocks';
import { SourcingLocation } from '../../src/modules/sourcing-locations/sourcing-location.entity';

describe('Sourcing records - Create', () => {
  let app: INestApplication;
  let sourcingRecordRepository: SourcingRecordRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, SourcingRecordsModule],
    }).compile();

    sourcingRecordRepository = moduleFixture.get<SourcingRecordRepository>(
      SourcingRecordRepository,
    );

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await sourcingRecordRepository.delete({});
  });
  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  test('Create a sourcing record should be successful (happy case)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/sourcing-records')
      .send({
        tonnage: 1234,
        year: 2020,
      })
      .expect(HttpStatus.CREATED);

    const createdSourcingRecord = await sourcingRecordRepository.findOne(
      response.body.data.id,
    );

    if (!createdSourcingRecord) {
      throw new Error('Error loading created Sourcing Record');
    }

    expect(createdSourcingRecord.tonnage).toEqual('1234');
  });
});
