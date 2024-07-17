import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "dgram";
import { Server } from 'socket.io';
import { ChatRoom, ConnectedUser, StatusCode, UserStatus } from "src/entities/TypeCollection";
import { User } from "src/entities/user.entity";
import { AuthService } from "src/services/authService";
import * as EmailValidator from 'email-validator';


@WebSocketGateway({ path: '/api', cors: true })
export class SocketGateway implements OnModuleInit {

    @WebSocketServer()
    server: Server;

    /**
     * [constructor for SocketGateway]
     * This function uses dependency-injection, to inject the authService.
     * 
     * @param {AuthService} authService - service that handles authentication-tasks
     */
    constructor(
        private readonly authService: AuthService,
    ) {}

    /**
     * [handles 'connection'-events]
     * This function subscribes to the 'connection'-event to log new incoming connections 
     * to console.
     * 
     */
    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log("[new Connection] -> " + socket.id);
        })
    }

    /**
     * [handles 'auth'-events]
     * This function subscribes to the 'auth'-event, logs new authentication-requests, authenticates a user,
     * generates a secret-token for it and emits it.
     * 
     * @param {any} body - the event-body containing data in JSON-format
     * @param {any} socket - the socket which emitted the event
     * @returns emits new secret-token via 'auth_token'-event
     */
    @SubscribeMessage('auth')
    async onAuth(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
        if(!body.company_email || !body.password) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        if(!EmailValidator.validate(body.company_email)) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        const authedUser: User = await this.authService.validateUser(body.company_email, body.password);
        if(!authedUser) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        
        console.log("[new Authentication] -> " + body.company_email);

        const secret: string = await this.authService.authenticateUser(authedUser, socket);
        this.sendEmit(socket, StatusCode.SUCCESS_AUTH, {token: secret});

        this.sendUserStatusUpdate();
    }

    /**
     * [handles 'register'-events]
     * This function subscribes to the 'register'-event, registers a new user and 
     * returns the success-state.
     * 
     * @param {any} body - the event-body containing data in JSON-format
     * @param {any} socket - the socket which emitted the event
     * @returns emits {success: true} via the 'new_register'-event 
     */
    @SubscribeMessage('register')
    async registerUser(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
        if(!body.name || !body.surname || !body.company_email || !body.company_number || !body.department || !body.password) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        if(!EmailValidator.validate(body.company_email)) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        if(!await this.authService.registerUser(body.name, body.surname, body.company_email, body.company_number, body.department, body.password)) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }

        console.log("[new Registration] -> " + body.company_email);

        this.sendEmit(socket, StatusCode.SUCCESS_REGISTER, null);
    }

    /**
     * [handles 'room'-events]
     * This function subscribes to the 'room'-event, registers a new room and 
     * returns the success-state.
     * 
     * @param {any} body - the event-body containing data in JSON-format
     * @param {any} socket - the socket which emitted the event
     * @returns emits {success: true} via the 'new_room'-event 
     */
    @SubscribeMessage('room')
    async registerRoom(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
        if(!body.token || !body.name || !this.authService.validateToken(body.token)) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        if(body.name.length > 20) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        if(!await this.authService.createChatRoom(body.token, body.name)) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }

        console.log("[new Room] -> " + body.name);
        this.sendEmit(socket, StatusCode.SUCCESS_ROOM, null);
        this.sendRoomsUpdate();
    }

    /**
     * [disconnects a useres socket and deletes its 'session']
     * 
     * @param {any} body - the event-body containing data in JSON-format
     * @param {Socket} socket - the socket which emitted the event
     * @returns emits {success: true} and also emits status-update
     */
    @SubscribeMessage('disconnect_user')
    async onDisconnectRequest(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
        if(!body.token || !this.authService.validateToken(body.token)) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }

        console.log("[new Disconnect]" + (await this.authService.userFromToken(body.token)).company_email);
        
        this.authService.disconnectUserByToken(body.token);
        this.sendEmit(socket, StatusCode.SUCCESS_DISCONNECT_USER, null);
 
        this.sendUserStatusUpdate();
    }


    /**
     * [handles 'update_profile'-events]
     * This function subscribes to the 'update_profile'-event and updates the user from the given data,
     * if the sender is authenticated.
     * 
     * @param {any} body - the event-body containing data in JSON-format
     * @param {any} socket - the socket which emitted the event
     * @returns the updated userdata
     */
    @SubscribeMessage('update_profile')
    async updateUserProfile(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
        if(!body.token || !this.authService.validateToken(body.token)) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        if(!body.company_email || !body.company_number || !body.department) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        
        const old_company_email: string = (await this.authService.userFromToken(body.token)).company_email;
        const user: User = await this.authService.updateUser(body.company_email, body.company_number, body.department, old_company_email);
        if(!user) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        
        console.log("[New Update Profile] -> " + old_company_email + " to " + body.company_email);
        this.sendEmit(socket, StatusCode.SUCCESS_UPDATE_PROFILE, null);

        this.sendUserStatusUpdate();
    }

    /**
     * [handles 'update_profile'-events]
     * This function subscribes to the 'update_profile'-event and updates the user from the given data,
     * if the sender is authenticated.
     * 
     * @param {any} body - the event-body containing data in JSON-format
     * @param {any} socket - the socket which emitted the event
     * @returns the updated userdata
     */
        @SubscribeMessage('update_password')
        async updateUserPassword(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
            if(!body.token || !this.authService.validateToken(body.token)) {
                this.sendEmit(socket, StatusCode.FAILURE, null);
                return;
            }
            if(!body.password) {
                this.sendEmit(socket, StatusCode.FAILURE, null);
                return;
            }
    
            const company_email: string = (await this.authService.userFromToken(body.token)).company_email;
            const user: User = await this.authService.updateUserPassword(body.password, company_email);

            if(!user) {
                this.sendEmit(socket, StatusCode.FAILURE, null);
                return;
            }
            
            console.log("[New Update Password] -> " + company_email);
            this.sendEmit(socket, StatusCode.SUCCESS_UPDATE_PROFILE, null);
            this.authService.disconnectUserByToken(body.token);
            this.sendUserStatusUpdate();
        }


    /**
     * [handles 'update_status'-events]
     * This function subscribes to the 'update_status'-event updates the user status, if the sender is authenticated.
     * 
     * @param {any} body - the event-body containing data in JSON-format
     * @param {any} socket - the socket which emitted the event
     * @returns the updated status to all users, if authenticated
     */
    @SubscribeMessage('update_status')
    async updateUserStatus(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
        if(!body.token || !this.authService.validateToken(body.token)) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        if(!body.status) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }

        const allowedStatus: string[] = ['verfügbar', 'pause', 'meeting', 'abwesend'];
        if(!allowedStatus.includes(body.status)) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        
        const company_email: string = (await this.authService.userFromToken(body.token)).company_email;
        if(this.authService.updateUserStatus(body.status, company_email)) {
            console.log('[New Status Update] -> ' + (await this.authService.userFromToken(body.token)).company_email + ": " + body.status);
            this.sendEmit(socket, StatusCode.SUCCESS_UPDATE_STATUS, null);
            this.sendUserStatusUpdate();
        }
    }    

    /**
     * [handles 'room_update_request'-events]
     * This function subscribes to the 'room_update_request'-event and emits all exisiting rooms to the sender,
     * if the sender is authenticated.
     * 
     * @param {any} body - the event-body containing data in JSON-format
     * @param {any} socket - the socket which emitted the event
     * @returns all existing rooms
     */
    @SubscribeMessage('room_update_request')
    async onRoomUpdateRequest(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
        if(!body.token || !this.authService.validateToken(body.token)) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }

        const roomsData = this.authService.getRoomsArray();
        this.sendEmit(socket, StatusCode.SUCCESS_ROOM_UPDATE_REQUEST, roomsData);
    }

    /**
     * [tries to add the provided user to the room associated to the provided Id]
     * 
     * @param {any} body - the event-body containing data in JSON-format
     * @param {Socket} socket - the socket which emitted the event
     * @returns emits {success: true}, if the room was found
     */
    @SubscribeMessage('join_room')
    async onJoinRoom(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
        if(!body.token || !this.authService.validateToken(body.token)) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        if(!body.roomId) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        const user: ConnectedUser = await this.authService.userFromToken(body.token);
        if(!this.authService.addUserToRoom(user, body.roomId)) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        console.log("[new Join Room] -> " + (await this.authService.userFromToken(body.token)).company_email + ": " + body.roomId);
        
        this.sendEmit(socket, StatusCode.SUCCESS_JOIN_ROOM, null);
    }

    /**
     * [sends the provided message to the room]
     * 
     * @param {any} body - the event-body containing data in JSON-format
     * @param {Socket} socket - the socket which emitted the event
     * @returns emits the message to the associated room
     */
    @SubscribeMessage('message_to_room')
    async onMessageToRoom(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
        if(!body.token || !this.authService.validateToken(body.token)) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        if(!body.roomId) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        if(!body.message) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        if(body.message.length > 40) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        
        const user: ConnectedUser = await this.authService.userFromToken(body.token);
        const room: ChatRoom = this.authService.getRoomFromId(body.roomId);

        if(!room) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        if(room.member.filter(member => member.id === user.id).length < 1) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        
        console.log("[new Message to Room] -> " + (await this.authService.userFromToken(body.token)).company_email + ": '" + body.message + "' into room " + this.authService.getRoomFromId(body.roomId).name);

        room.member.forEach((member) => {
            if(member.socket == socket) {
                this.sendEmit(member.socket, StatusCode.SUCCESS_MESSAGE_TO_ROOM, { from: user.name + " " + user.surname, message: body.message, self: true });
            } else {
                this.sendEmit(member.socket, StatusCode.SUCCESS_MESSAGE_TO_ROOM, { from: user.name + " " + user.surname, message: body.message, self: false });
            }
        })
    }

    /**
     * [the user associated to the provided token leaves the room]
     * 
     * @param {any} body - the event-body containing data in JSON-format
     * @param {Socket} socket - the socket which emitted the event
     * @returns removes the user associated to the token from the room's member list
     */
    @SubscribeMessage('leave_room')
    async onLeaveRoom(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
        if(!body.token || !this.authService.validateToken(body.token)) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        if(!body.roomId) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        
        const user: ConnectedUser = await this.authService.userFromToken(body.token);
        const room: ChatRoom = this.authService.getRoomFromId(body.roomId);

        if(!room) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        if(room.member.filter((roomUser) => roomUser.id === user.id).length < 1) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        
        console.log("[new Leave Room] -> " + (await this.authService.userFromToken(body.token)).company_email + ": " + this.authService.getRoomFromId(body.roomId).name);

        room.member = room.member.filter((roomUser) => roomUser.id !== user.id);
        this.sendEmit(socket, StatusCode.SUCCESS_LEAVE_ROOM, null);
    }

    /**
     * [send all userinformation to the sender, if the token is valid]
     * 
     * @param {any} body - the event-body containing data in JSON-format
     * @param {Socket} socket - the socket which emitted the event
     * @returns emits all user information to the requestion socket, if the token is valid
     */
    @SubscribeMessage('userinfo')
    async onUserInformation(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
        if(!body.token || !this.authService.validateToken(body.token)) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }

        const user: ConnectedUser = await this.authService.userFromToken(body.token);
        const userData: object = {
            name: user.name,
            surname: user.surname,
            company_email: user.company_email,
            company_number: user.company_number,
            department: user.department
        }

        this.sendEmit(socket, StatusCode.SUCCESS_USERINFO, userData);
    }

    /**
     * [forces a User-Status-Update]
     * 
     * @param {any} body - data in JSON format 
     * @param {Socket} socket - socket, that the request was made on 
     * @returns emits User-Status-Update
     */
    @SubscribeMessage('status_info')
    async onStatusInfo(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
        if(!body.token || !this.authService.validateToken(body.token)) {
            this.sendEmit(socket, StatusCode.FAILURE, null);
            return;
        }
        console.log("[new Status Info]");

        this.sendUserStatusUpdate();
    }

    /** 
     *[updates the client on user-status]
     *
     * @param userStatusArray - the user status-data provided from the auth-Service
     * @returns emits 'status_update'-event with user-status-data
     */
    sendUserStatusUpdate() {
        const userStatusData: UserStatus[]  = this.authService.getUserStatusArray();  
        const authenticatedUserSockets = this.authService.getAuthenticatedSockets();

        authenticatedUserSockets.forEach((socket) => {
            this.sendEmit(socket, StatusCode.SUCCESS_SEND_USER_STATUS_UPDATE, userStatusData);
        });
    }

    /** 
     * [updates the client on open Rooms]
     *
     * @param userStatusArray - the user status-data provided from the auth-Service
     * @returns emits 'status_update'-event with user-status-data
     */
    sendRoomsUpdate() {
        const roomsData = this.authService.getRoomsArray();  
        const authenticatedUserSockets = this.authService.getAuthenticatedSockets();

        authenticatedUserSockets.forEach((socket) => {
            this.sendEmit(socket, StatusCode.SUCCESS_SEND_ROOMS_UPDATE, roomsData);
        });
    }

    sendEmit(socket: Socket, code: number, data: object) {
        if(data) {
            socket.emit("RESPONSE", {code: code, data: data});
            return;
        }
        socket.emit("RESPONSE", {code: code});
    }
}
