import { Module } from "@nestjs/common";
import { SocketGateway } from "./socketGateway";
import { AuthService } from "src/services/authService";
import { User } from "src/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: './database.sqlite',
            entities: [User],
            synchronize: true,
          }),
        TypeOrmModule.forFeature([User]),
    ],
    providers: [AuthService, SocketGateway]
})
export class GatewayModule {}
