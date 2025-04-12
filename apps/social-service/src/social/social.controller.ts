import { Controller } from '@nestjs/common';
import { SocialService } from './social.service';

@Controller()
export class SocialController {
  constructor(private readonly socialService: SocialService) {}
}
