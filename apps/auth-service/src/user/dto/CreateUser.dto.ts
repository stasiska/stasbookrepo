export class CreateUserDto {
    email: string
    displayName: string
    password: string
    picture?: string
    method: 'CREDENTIALS' | 'GOOGLE'
    isVerified?: boolean
}