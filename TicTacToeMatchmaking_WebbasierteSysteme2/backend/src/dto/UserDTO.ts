import {IsString, IsNotEmpty, MinLength, MaxLength, IsAlphanumeric, IsStrongPassword} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import {StreamableFile} from "@nestjs/common";
import {User} from "../user/user.entity";

export class RegisterDTO {
    @ApiProperty({ description: 'The username of the user', example: 'user'  })
    @IsNotEmpty()
    @IsString()
    @MinLength(4, { message: 'Username must be between 4 and 12 characters long' })
    @MaxLength(12, { message: 'Username must be between 4 and 12 characters long' })
    @IsAlphanumeric()
    username: string;

    @ApiProperty({ description: 'The password of the user', example: 'password'  })
    @MinLength(8, { message: 'The password must be at least 8 characters long' })
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class LoginDTO {
    @ApiProperty({ description: 'The username of the user', example: 'user' })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ description: 'The password of the user', example: 'password' })
    @IsNotEmpty()
    @IsString()
    password: string;
}

export class UpdateUsernameDTO {
    @ApiProperty({ description: 'The new Username of the user', example: 'newUsername' })
    @IsNotEmpty()
    @IsString()
    @MinLength(4, { message: 'Username must be between 4 and 12 characters long' })
    @MaxLength(12, { message: 'Username must be between 4 and 12 characters long' })
    @IsAlphanumeric()
    newUsername: string;
}

export class UpdatePasswordDTO {
    @ApiProperty({ description: 'The new Password of the user', example: 'newPassword' })
    @MinLength(8, { message: 'The password must be at least 8 characters long' })
    @IsString()
    @IsNotEmpty()
    newPassword: string;
}

export class UpdateProfilePictureDTO {
    @ApiProperty({ description: 'The new Profile Picture of the user', example: '??' })
    @IsNotEmpty()
    image: Express.Multer.File
}


export class GetProfileResponse {

    @ApiProperty({ description: 'The unique id to identify a user', example: '1' })
    id: number;

    @ApiProperty({ description: 'The unique username of a user', example: 'user' })
    username: string;

    @ApiProperty({ description: 'The Boolean that identifies a user as an admin or a normal user', example: 'false' })
    isAdmin: boolean;

    @ApiProperty({ description: 'The current elo of a user', example: '1000' })
    elo: number;

    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.isAdmin = user.isAdmin;
        this.elo = user.elo;

    }

}

export class GetProfilePictureResponse {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Binary image data',
        example: {
            'image/png': {
                file: 'BinaryImageData...',
            }
        }
    })
    file: StreamableFile;

    constructor(file: StreamableFile) {
        this.file = file;
    }

}

export class LoginResponse {
    @ApiProperty({ description: 'The token needed fo access. Contains the userId and checks if the user is an admin or not', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUzLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzA5NDY5NzkwLCJleHAiOjE3MDk0NzMzOTB9.av_fkKukVrbtfdN-f7nHQb4Yxt5gJ03ZBDm0k6KYp8k'})
    token: string

    constructor(token:string) {
        this.token = token;
    }
}
export class StandardResponse {

    @ApiProperty({ description: 'Boolean that shows if the request was successful or not', example: 'true' })
    success: boolean;
    @ApiProperty({ description: 'More Information regarding the request', example: 'The Information has been returned successfully' })
    message: string;

    constructor(success: boolean, message: string) {
        this.success = success;
        this.message = message;
    }

}