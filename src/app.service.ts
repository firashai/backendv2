import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'WeSourceYou API - Mediation platform connecting journalists and media companies worldwide';
  }
}
