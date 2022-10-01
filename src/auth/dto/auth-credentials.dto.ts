import { IsEmail, Matches, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsEmail()
  username: string;

  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
}
