import { PrismaClient } from '@prisma/client';

export class Database {
  private static prisma: PrismaClient;

  static async connect(): Promise<void> {
    if (!Database.prisma) {
      Database.prisma = new PrismaClient({
        log: ['error', 'warn'],
      });
    }

    await Database.prisma.$connect();
  }

  static getClient(): PrismaClient {
    if (!Database.prisma) {
      throw new Error(
        'Prisma client not initialized. Call Database.connect() first.',
      );
    }

    return Database.prisma;
  }

  static async disconnect(): Promise<void> {
    if (Database.prisma) {
      await Database.prisma.$disconnect();
    }
  }
}
