import { Injectable } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";

@Injectable()
export class LoggerService {
    constructor(private readonly logger: PinoLogger) {}

    log(message: string, context?: string) {
        this.logger.info(message, { context });
    }

    error(message: string, trace: string, context?: string) {
        this.logger.error(message, { trace, context })
    }

    debug(message: string, trace: string, context?: string) {
        this.logger.debug(message, {trace, context})
    }

    info(message: string, trace: string, context?: string) {
        this.logger.info(message, {trace, context})
    }

    fatal(message: string, trace: string, context?: string){
        this.logger.fatal(message, {trace, context})
    }
}