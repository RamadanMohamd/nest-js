import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll( async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl(
      'http://localhost:3333',
    );

  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'ramii@gmail.com',
      password: '12345',
    };

    describe('Signup', () => {
      it('should throw error if no email provided',  () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      }, 7000 );

      it('should throw error if no body provided',  () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      }, 7000);

      it('should throw error if no password provided',  () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      }, 7000);

      it('should signup',  () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      }, 7000);
    });

    describe('Signin',  () => {
      it('should throw error if no email provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      }, 7000);

      it('should throw error if no body provided',  () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);
      }, 7000);

      it('should throw error if no password provided',  () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      },7000);

      it('should signin',  () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token')
      },7000);
    });
  });


  describe('User', () => {

    describe('Get me', () => {
      it('should get current user',  () => {
        return pactum
        .spec()
        .get('/users/me')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(200)
        .inspect() 
      },7000)
    });

    describe('Edit User', () => {
      it('should edit user',  () => {
        const dto: EditUserDto = {
          firstName: 'Ramii', 
          email: 'Ramii@mohey.com'
        }
        return pactum
        .spec()
        .patch('/users')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.firstName)
        .expectBodyContains(dto.email)
      },7000)
    });

  });

  describe('Bookmarks', () => {
    it('Create bookmark', () => {});
    it('Get bookmark', () => {});
    it('Get bookmark by id ', () => {});
    it('Edit bookmark', () => {});
    it('Delete bookmark', () => {});
  });
});
