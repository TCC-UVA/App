import { api } from "../api";
import { LoginRequestDto } from "./dto/login-request.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { RegisterRequestDto } from "./dto/register-request.dto";
import { RegisterResponseDto } from "./dto/register-response.dto";

export interface AuthService {
  login(params: LoginRequestDto): Promise<LoginResponseDto>;
  register(params: RegisterRequestDto): Promise<RegisterResponseDto>;
}

export class AuthServiceHttp implements AuthService {
  async login(params: LoginRequestDto): Promise<LoginResponseDto> {
    const response = await api.post<LoginResponseDto>("/login_user", {
      Email: params.email,
      Password: params.password,
    });
    return response.data;
  }

  async register(params: RegisterRequestDto): Promise<RegisterResponseDto> {
    const response = await api.post<RegisterResponseDto>("/create_user", {
      Name: params.name,
      Email: params.email,
      Password: params.password,
      BirthDate: params.birthDate,
    });
    return response.data;
  }
}
