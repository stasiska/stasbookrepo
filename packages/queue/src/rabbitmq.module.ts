// packages/rabbitmq/rabbitmq.module.ts
import { Module, Global, DynamicModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from './rabbitmq.service';

@Global()
@Module({})
export class RabbitMQModule {
  static register(queueName: string): DynamicModule {
    return {
      module: RabbitMQModule,
      imports: [
        ClientsModule.register([
          {
            name: 'RABBITMQ_SERVICE',
            transport: Transport.RMQ,
            options: {
              urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
              queue: queueName,
              queueOptions: {
                durable: true,
              },
            },
          },
        ]),
      ],
      providers: [RabbitMQService],
      exports: [RabbitMQService],
    };
  }
}
