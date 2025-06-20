import { User } from '../entities/user.entity';

export interface UserRepository {
  all(): Promise<User[]>;
  allByIds(ids: { id: string }[]): Promise<User[]>;
  delete(id: string): Promise<void>;
  deleteAll(ids: { id: string }[]): Promise<void>;
  save(user: User): Promise<void>;
  getByVerificationToken(verificationToken: string): Promise<User | null>;
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  getByName(name: string): Promise<User | null>;
  getByEmailOrName(emailOrName: string): Promise<User | null>;
}
