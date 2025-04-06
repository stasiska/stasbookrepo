import { Body, Controller, Post, Req } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { Request } from 'express';
import { ConfirmationDto } from './dto/confirmation.dto';
import { GrpcMethod, GrpcService, MessagePattern } from '@nestjs/microservices';

@GrpcService()
export class EmailConfirmationController {
  constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

  
  public async newVerificatoin(
    data: {
        dto: ConfirmationDto
    }
) {
  return this.emailConfirmationService.newVerification(data.dto)
}
}
