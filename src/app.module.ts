import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    JwtModule.register({
      global: true,
      signOptions: {
        expiresIn: process.env.JWT_TOKEN_EXPIRES_IN,
      },
      secret: process.env.JWT_TOKEN_SECRET_KEY,
    }),
  ],
})
export class AppModule {}
