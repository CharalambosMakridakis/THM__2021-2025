import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    Put,
    Req,
    Session,
    StreamableFile,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import {UserService} from './user.service';
import {Request} from "express";
import {FileInterceptor} from "@nestjs/platform-express";
import * as UserDTOs from "../dto/UserDTO";
import {ApiBearerAuth, ApiHeader, ApiResponse, ApiTags} from "@nestjs/swagger";
import {diskStorage} from 'multer';
import {createReadStream} from "fs";
import {join} from "path";
import { SessionData } from 'src/auth.middleware';

@ApiTags('Api')
@Controller('api')
@ApiBearerAuth()
@ApiHeader({
    name: 'X-Authentication',
    description: 'Format: Bearer your_token. The Authentication token that is being returned when logging in. Only requires a valid User.',
    required: true,
    example: "Bearer your_token"
})
export class UserController {
    constructor(private readonly userService: UserService) {}

    checkUserAccess(session: SessionData) {
        if (!session.userId) {
            throw new HttpException('The jwt is invalid', 401);
        }
    }

    @Put('update_username')
    @ApiResponse({status: 200, description: 'Username has been updated successfully', type: UserDTOs.StandardResponse})
    @ApiResponse({status: 409, description: 'The desired Username is already taken'})
    @ApiResponse({status: 401, description: 'Unauthorized, The Users jwt token has not been set or is invalid'})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    async updateUsername(@Session() session: SessionData, @Body() updateUsernameDTO: UserDTOs.UpdateUsernameDTO, @Req() req: Request): Promise<UserDTOs.StandardResponse> {
        const userId = session.userId;
        this.checkUserAccess(session);

        try {
            await this.userService.updateUsername(userId, updateUsernameDTO.newUsername);
            return { success: true, message: 'Username updated successfully!' };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw InternalServerErrorException
        }
    }

    @Put('update_password')
    @ApiResponse({status: 200, description: 'Password has been updated successfully', type: UserDTOs.StandardResponse})
    @ApiResponse({status: 401, description: 'Unauthorized, The Users jwt token has not been set or is invalid'})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    async updatePassword(@Session() session: SessionData, @Body() updatePasswordDTO: UserDTOs.UpdatePasswordDTO, @Req() req: Request): Promise<UserDTOs.StandardResponse> {
        
        this.checkUserAccess(session);
        
        const userId = session.userId

        try {
            await this.userService.updatePassword(userId, updatePasswordDTO.newPassword);
            return { success: true, message: 'Password updated successfully!' };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw InternalServerErrorException
        }
    }

    
    @UseInterceptors(FileInterceptor('image', {
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.startsWith('image/')) {
                return callback(new BadRequestException('Nur Bilddateien sind erlaubt'), false);
            }

            const maxSize: number = 5 * 1024 * 1024; // 5 MB
            if (file.size > maxSize) {
                return callback(new BadRequestException('Die Datei darf maximal 5 MB groß sein'), false);
            }

            callback(null, true);
        },
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                // @ts-ignore
                const filename = `${req.session.userId}.png`;
                
                cb(null, filename);
            }
        })
    }))
    @ApiResponse({ status: HttpStatus.OK, description: 'Profile picture has been updated successfully', type: UserDTOs.StandardResponse})
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized, The Users jwt token has not been set or is invalid'})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: 'Bad Request'})
    @Put('update_profile_picture')
    async updateProfilePicture(@Session() session: SessionData, @UploadedFile() updateProfilePictureDTO: any, @Req() req: Request): Promise<UserDTOs.StandardResponse> {
        
        this.checkUserAccess(session);
        const userId = session.userId;

        try {
            const imagePath: string = `${ updateProfilePictureDTO.filename }`;
            
            await this.userService.updateProfilePicture(userId, imagePath);

            return { success: true, message: 'Profile picture updated' };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            console.log(error);
            
            throw InternalServerErrorException
        }
    }

    @Get('get_profile')
    @ApiResponse({
        status: 200,
        description: 'all relevant user data has been returned',
        type: UserDTOs.GetProfileResponse,
        isArray: true
    })
    @ApiResponse({status: 401, description: 'Unauthorized, The Users jwt token has not been set or is invalid'})
    async getProfile(@Session() session: SessionData, @Req() req: Request): Promise<UserDTOs.GetProfileResponse> {
        this.checkUserAccess(session);
        const userId = session.userId;
        
        try {
            return new UserDTOs.GetProfileResponse(await this.userService.getUserById(userId));
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw InternalServerErrorException
        }
    }

    @Get('get_profile_picture')
    @ApiResponse({status: 200, description: 'Profile Picture has been returned successfully'})
    @ApiResponse({status: 401, description: 'Unauthorized, The Users jwt token has not been set or is invalid'})
    async getProfilePicture(@Session() session: SessionData, @Req() req: Request): Promise<any> {
        
        this.checkUserAccess(session);
        const userId = session.userId;

        try {
            let filename: string = await this.userService.getProfilePicture(userId);
            if (filename === null) {
                filename = 'default.png'
            }
            const file = createReadStream(join('./uploads/', filename));
            return new StreamableFile(file);

        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw InternalServerErrorException
        }
    }
}
