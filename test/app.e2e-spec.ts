import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { TrucksModule } from './../src/trucks/trucks.module';

describe('TrucksController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TrucksModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  it('/trucks (GET)', () => {
    return request(app.getHttpServer())
      .get('/trucks')
      .expect(200)
      .expect('Trucks');
  });
});
