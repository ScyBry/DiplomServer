import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'emailOrUsername' });
  }

  async validate(emailOrUsername: string, password: string) {
    const user = await this.authService.validateUser(emailOrUsername, password);

    if (!user) throw new UnauthorizedException('Неверные данные');

    return user;
  }
}
