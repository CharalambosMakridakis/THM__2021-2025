import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {authController} from "./auth.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([User])
    ],
    controllers: [UserController, authController],
    providers: [UserService]
})

export class UserModule {
}