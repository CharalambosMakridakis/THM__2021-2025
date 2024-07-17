import {
    Body,
    ConflictException,
    Controller,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Post
} from "@nestjs/common";
import {ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";
import * as UserDTOs from "../dto/UserDTO";
import {UserService} from "./user.service";

@ApiTags('Auth')
@Controller('auth')
export class authController {
    constructor(
        private readonly userService: UserService) {
    }

    @Post('register')
    @ApiBody({ type: UserDTOs.RegisterDTO })
    @ApiResponse({status: HttpStatus.CREATED, description: 'User has been registered successfully', type: UserDTOs.StandardResponse})
    @ApiResponse({status: HttpStatus.CONFLICT, description: 'Username is already taken'})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    async register(@Body() registerDTO: UserDTOs.RegisterDTO): Promise<UserDTOs.StandardResponse> {
        try {
            await this.userService.register(registerDTO);
            return {success: true, message: 'Registration successful!'};
        } catch (error) {
            if (error instanceof ConflictException) throw error
            else throw new InternalServerErrorException()

        }
    }

    @Post('login')
    @ApiBody({ type: UserDTOs.LoginDTO })
    @ApiResponse({status: HttpStatus.CREATED, description: 'User has been logged in successfully', type: UserDTOs.LoginResponse})
    @ApiResponse({status: HttpStatus.CONFLICT, description: 'Username and Password do not match'})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: 'Username could not be found'})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    async login(@Body() loginDTO: UserDTOs.LoginDTO): Promise<UserDTOs.LoginResponse> {
        try {
            const result: {token:string} = await this.userService.login(loginDTO)
                return { token: result.token }
        } catch (error) {
            if (error instanceof ConflictException || error instanceof NotFoundException) throw error;
            else throw new InternalServerErrorException()
        }
    }

}