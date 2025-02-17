import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'app.module';
import { Indicator } from 'modules/indicators/indicator.entity';
import { IndicatorsModule } from 'modules/indicators/indicators.module';
import { IndicatorRepository } from 'modules/indicators/indicator.repository';

/**
 * Tests for the IndicatorsModule.
 */

describe('IndicatorsModule (e2e)', () => {
  let app: INestApplication;
  let indicatorRepository: IndicatorRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, IndicatorsModule],
    }).compile();

    indicatorRepository = moduleFixture.get<IndicatorRepository>(
      IndicatorRepository,
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
    await indicatorRepository.delete({});
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  describe('Indicators - Create', () => {
    test('Create an indicator should be successful (happy case)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/indicators')
        .send({
          name: 'test indicator',
        })
        .expect(HttpStatus.CREATED);

      const createdIndicator = await indicatorRepository.findOne(
        response.body.data.id,
      );

      if (!createdIndicator) {
        throw new Error('Error loading created Indicator');
      }

      expect(createdIndicator.name).toEqual('test indicator');
    });
  });

  test('Create an indicator without the required fields should fail with a 400 error', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/indicators')
      .send()
      .expect(HttpStatus.BAD_REQUEST);

    expect(response).toHaveErrorMessage(
      HttpStatus.BAD_REQUEST,
      'Bad Request Exception',
      [
        'name should not be empty',
        'name must be shorter than or equal to 40 characters',
        'name must be longer than or equal to 2 characters',
        'name must be a string',
      ],
    );
  });

  describe('Indicators - Update', () => {
    test('Update a indicator should be successful (happy case)', async () => {
      const indicator: Indicator = new Indicator();
      indicator.name = 'test indicator';
      await indicator.save();

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/indicators/${indicator.id}`)
        .send({
          name: 'updated test indicator',
        })
        .expect(HttpStatus.OK);

      expect(response.body.data.attributes.name).toEqual(
        'updated test indicator',
      );
    });
  });

  describe('Indicators - Delete', () => {
    test('Delete a indicator should be successful (happy case)', async () => {
      const indicator: Indicator = new Indicator();
      indicator.name = 'test indicator';
      await indicator.save();

      await request(app.getHttpServer())
        .delete(`/api/v1/indicators/${indicator.id}`)
        .send()
        .expect(HttpStatus.OK);

      expect(await indicatorRepository.findOne(indicator.id)).toBeUndefined();
    });
  });

  describe('Indicators - Get all', () => {
    test('Get all indicators should be successful (happy case)', async () => {
      const indicator: Indicator = new Indicator();
      indicator.name = 'test indicator';
      await indicator.save();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/indicators`)
        .send()
        .expect(HttpStatus.OK);

      expect(response.body.data[0].id).toEqual(indicator.id);
    });
  });

  describe('Indicators - Get by id', () => {
    test('Get a indicator by id should be successful (happy case)', async () => {
      const indicator: Indicator = new Indicator();
      indicator.name = 'test indicator';
      await indicator.save();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/indicators/${indicator.id}`)
        .send()
        .expect(HttpStatus.OK);

      expect(response.body.data.id).toEqual(indicator.id);
    });
  });
});
