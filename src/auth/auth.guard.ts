import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' && !token)
      throw new UnauthorizedException(
        'Invalid authorization header format. Bearer token not found.',
      );

    try {
      const secret = process.env.JWT_TOKEN_SECRET_KEY;

      const payload = this.jwtService.verify(token, {
        secret,
      });

      request.userPayload = payload;
    } catch (error: any) {
      throw new UnauthorizedException(`Invalid token. ${error}`);
    }

    return true;
  }
}
