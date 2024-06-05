import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('CityController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/common/city (GET)', () => {
    return request(app.getHttpServer())
      .get('/common/city')
      .expect(200)
      .expect((res) => {
        expect(res.body.isSuccess).toBe(true);
        expect(res.body.statusCode).toBe(200);
        expect(res.body.content.cities).toBeInstanceOf(Array);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
