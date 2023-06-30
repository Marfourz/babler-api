import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  welcome(): string {
    return "Bienvenu sur l'api de blabber";
  }
}
