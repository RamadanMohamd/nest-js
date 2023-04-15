import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      delete user.hash;

      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException(
          'Credentials taken',
        );
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // find the user by email
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
    // if not exist through exception
    if (!user)
      throw new ForbiddenException(
        'Credntials incorrect',
      );
    //compare password
    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );

    if (!pwMatches)
      throw new ForbiddenException(
        'Credntials incorrect',
      );

    delete user.hash;

    //send back the user
    return user;
  }
}
