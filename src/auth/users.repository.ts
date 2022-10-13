import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.enity';
import * as bcrypt from 'bcrypt';

export class UserRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    // hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash();

    const user = this.create({ username, password });
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
