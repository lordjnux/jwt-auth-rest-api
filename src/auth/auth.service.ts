import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { CredentialsDto } from './dto/create-auth.dto';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('AuthService');

  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.verbose('Database connected!');
    } catch (error) {
      this.logger.fatal(error);
      throw new InternalServerErrorException(
        `AuthService error trying to connect to Database. ${error}`,
      );
    }
  }

  async create(credentialsRequest: CredentialsDto) {
    const userExist = await this.authUsers.findFirst({
      where: {
        username: credentialsRequest.username,
      },
    });

    if (userExist)
      throw new ConflictException('Already exist an user with this email.');

    const passwordEncripted = await bcrypt.hash(
      credentialsRequest.password,
      10,
    );

    if (!passwordEncripted)
      throw new InternalServerErrorException("Password can't not be hashed");

    const newUser = { ...credentialsRequest, password: passwordEncripted };
    this.logger.debug('newUser:', newUser);

    const result = await this.authUsers.create({
      data: newUser,
    });

    this.logger.debug(result);

    return result;
  }

  async isvalidCredentials(credentialsRequest: CredentialsDto) {
    const userExist = await this.authUsers.findFirst({
      where: {
        username: credentialsRequest.username,
      },
    });

    if (!userExist) throw new UnauthorizedException('Invalid credentials');

    const isValidPassword = await bcrypt.compare(
      credentialsRequest.password,
      userExist.password,
    );

    if (!isValidPassword)
      throw new UnauthorizedException('Invalid credentials');

    return userExist;
  }

  async login(credentialsRequest: CredentialsDto) {
    const user = await this.isvalidCredentials(credentialsRequest);

    const payload = {
      id: user.id,
      username: user.username,
    };

    const token = await this.jwtService.sign(payload);

    return { token };
  }
}
