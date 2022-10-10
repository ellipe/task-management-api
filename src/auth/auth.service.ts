import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async #createUser(credentials: AuthCredentialsDto) {
    try {
      const { username, password } = credentials;
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.userRepository.create({
        username,
        password: hashedPassword,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('Username already exists');
    }
  }

  async signup(credentials: AuthCredentialsDto) {
    await this.#createUser(credentials);
  }

  async signin(credentials: AuthCredentialsDto) {
    const { username, password } = credentials;
    const user = await this.userRepository.findOneBy({ username });
    if (!user) throw new NotFoundException('username invalid');

    if (await bcrypt.compare(password, user.password)) {
      const payload: JwtPayload = {
        username,
      };
      const accessToken = await this.jwtService.signAsync(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('credentials invalid');
    }
  }
}
