import { IsEmail, IsNotEmpty, isString, IsString, MinLength, Validate } from "class-validator";
import { IsPasswordsMatchingConstraint } from "../../libs/common/is-password-mathching-constraint.decorator";
export class RegisterDto {
    @IsString({message: 'Имя долно быть строкой.'})
    @IsNotEmpty({message: 'Имя обязательно для заполнения.'})
    name: string

    @IsString({message: 'Имя долно быть строкой.'})
    @IsEmail({}, {message: `Некорректный формат email.`})
    email: string
    

    @IsString({message: 'Пароль должен бвть строкой.'})
    @IsNotEmpty({message: 'Пароль обязателен для заполнения.' })
    @MinLength(6, {
        message: 'Пароль должен содержать минимум 6 символов.'
    })
    password: string

    @IsString({message: 'Пароль должен бвть строкой.'})
    @IsNotEmpty({message: 'Пароль обязателен для заполнения.' })
    @MinLength(6, {
        message: 'Пароль должен содержать минимум 6 символов.'
    })
    @Validate(IsPasswordsMatchingConstraint, {
        message: 'Пароли не совпадают.'
    })
    passwordRepeat: string
}