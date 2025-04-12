import { SocialServiceClientService } from "@lib/grpc/dist/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SocialSerive {
    constructor(private readonly socialServiceClientService: SocialServiceClientService,
    ) {}
}