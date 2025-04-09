import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { LoggerService } from './logger.service';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              options: { colorize: true },
            },
            ...(process.env.LOG_TO_FILE === 'true'
              ? [{
                  target: 'pino/file',
                  options: { destination: './logs/app.log' },
                }]
              : []),
          ],
        },
      },
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}