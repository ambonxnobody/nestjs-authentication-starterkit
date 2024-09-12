import { PartialType } from '@nestjs/swagger';
import { LoginDto } from './login.dto';

export class RegisterDto extends PartialType(LoginDto) {}
