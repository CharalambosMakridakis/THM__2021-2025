import {
    ForbiddenException,
    Injectable,
    NestMiddleware,
    UnauthorizedException
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            req.headers.authorization = req.headers['x-authentication'] as string //swagger doesn't allow authentication header
        }
        try {
        const token: string = req.headers.authorization?.split(' ')[1];
        if (token || token !== "null") {
            const decodedToken = jwt.verify(token, 'Xhjsidfuhihxhqwu8ei12o312') as {
                userId: number,
                isAdmin: boolean,
                exp: number
            };
            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (decodedToken.exp && (decodedToken.exp < currentTimestamp)) {
                throw new ForbiddenException('Token has expired');
            }

            // @ts-ignore
            req.session.userId = decodedToken.userId;
            // @ts-ignore
            req.session.isAdmin = decodedToken.isAdmin;
        }
            } catch (error) {
                if (error instanceof jwt.JsonWebTokenError && error.message === 'jwt malformed') {
                    throw new UnauthorizedException("JWT Token has been malformed");
                } else {
                    throw new UnauthorizedException("The Users jwt token has not been set or is invalid");
                }
            }
            next();
        }


}

export interface SessionData {
    userId: number,
    isAdmin: boolean
}