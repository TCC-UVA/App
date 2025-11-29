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
    const data = {
      username: params.email,
      password: params.password,
      grant_type: "password",
    };
    const response = await api.post<LoginResponseDto>("/token", data, {
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
    return response.data;
  }

  async register(params: RegisterRequestDto): Promise<RegisterResponseDto> {
    // try {
    const response = await api.post<RegisterResponseDto>("/user", {
      Name: params.name,
      Email: params.email,
      Password: params.password,
      BirthDate: params.birthDate,
    });

    return response.data;
    // } catch (error) {
    //   console.log("catch", error.response);

    //   if (axios.isAxiosError(error)) {
    //     console.log("here");

    //     const statusCode = error.response?.status;
    //     if (statusCode === 409) {
    //       throw new AppError("Usuário já cadastrado", 409);
    //     }
    //     if (statusCode === 400) {
    //       throw new AppError("Dados inválidos. Verifique os campos", 400);
    //     }
    //     if (statusCode === 500) {
    //       throw new AppError(
    //         "Erro no servidor. Tente novamente mais tarde",
    //         500
    //       );
    //     }
    //   }
    // }
  }
}
