import { Controller, Get, UseGuards, Req, Patch} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGurd } from 'src/auth/gurd';
@UseGuards(JwtGurd)
@Controller('users')
export class UserController {
  
  @Get('me')
  getMe(@GetUser() user: User ) {
    return user;
  }

  @Patch()
  editUser() {

  }
}
