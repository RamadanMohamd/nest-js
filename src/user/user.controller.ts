import { Controller, Get, UseGuards, Req, Patch} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator'
import { JwtGurd } from  '../auth/gurd/jwt.gurd'
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
