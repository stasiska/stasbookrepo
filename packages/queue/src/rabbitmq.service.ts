import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  constructor(@Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy) {}

  async emit(pattern: string, data: any) {
    return this.client.emit(pattern, data);
  }

  async send<T>(pattern: string, data: any) {
    return this.client.send<T>(pattern, data);
  }
}