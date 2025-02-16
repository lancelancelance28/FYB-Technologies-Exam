import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    return { id: user.id, email: user.email };
  }

  async login(email: string, password: string, response: Response) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new BadRequestException('Wrong password');

    const jwt = await this.jwtService.signAsync({ id: user.id });

    response.cookie('jwt', jwt, { httpOnly: true, sameSite: 'strict' });

    return { message: 'Login successful' };
  }
}
