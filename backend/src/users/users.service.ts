import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getMe(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
