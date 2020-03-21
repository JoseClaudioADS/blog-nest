import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {

    @IsNotEmpty({message: "O nome é obrigatório"})
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty({message: "A senha é obrigatória"})
    password: string;
}