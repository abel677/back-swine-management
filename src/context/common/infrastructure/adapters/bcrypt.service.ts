import bcrypt from 'bcrypt';
import { HashService } from '../../domain/ports/hash-service.port';

export class BcryptHashService implements HashService {
  private readonly saltRounds = 10;

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
