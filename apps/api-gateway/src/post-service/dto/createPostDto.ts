import { IsOptional, IsString } from "class-validator";

export class CreatePostDto {
    @IsOptional() 
    @IsString({message: 'Email должен быть строкой'})
    content: string
}