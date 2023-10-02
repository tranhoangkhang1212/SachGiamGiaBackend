import { Injectable } from '@nestjs/common';
import { SHA256 } from 'crypto-js';

@Injectable()
export class HashService {
  hashPassword(password: string): string {
    const key = process.env.ADMIN_AUTH_SECRET_KEY;
    return SHA256(password + key).toString();
  }

  verifyPassword(password: string, passwordHash: string): boolean {
    const key = process.env.ADMIN_AUTH_SECRET_KEY;
    const hash = SHA256(password + key).toString();
    return hash === passwordHash;
  }
}
