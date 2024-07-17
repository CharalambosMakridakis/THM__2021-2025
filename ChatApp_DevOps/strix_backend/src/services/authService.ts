import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/entities/user.entity';
import { ChatRoom, ConnectedUser, UserStatus } from 'src/entities/TypeCollection';
import { Repository } from 'typeorm';
import { Socket } from 'dgram';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        ){}
        
    connectedUsers: ConnectedUser[] = [];
    userStatusArray: UserStatus[] = [];
    chatRooms: ChatRoom[] = [];
    
    /**
     * [generates a secret-token for an user by ID]
     * This function creates a jwt, associates it to an ID, the email and the socket 
     * and returns the secret-token.  
     * 
     * @param {number} userId - the ID (matches database id) of the user 
     * @returns {Promise<string>} the generated, authenticated secret token
    */
    async authenticateUser(user: User, socket: Socket): Promise<string> {
       const secret: string = jwt.sign({ userId: user.id } , 'your-secret-key', { expiresIn: '1h' });
       
       if(this.isUserAuthenticated(user)){
           //add new socket and token to connected-user
           const existingUser = this.getConnectedUserById(user.id);
           if(existingUser){
               existingUser.socket = socket;
               existingUser.tokens.push(secret);
            }
            
        }else{
            //add new user-connection
            this.connectedUsers.push({
                id: user.id,
                company_email: user.company_email,
                name: user.name,
                surname: user.surname,
                company_number: user.company_number,
                department: user.department,
                status: "verfügbar",
                socket: socket,
                tokens: [secret]
            })
        }
        
        return secret;
    }
    

    /**
     * [Adds user to room]
     *  adds an user to given room and returns if the action was successful or not
     * 
     * @param {ConnectedUser} user - user that is connected
     * @param {string} roomId - the roomId
     * @returns {boolean} if the action was successful or not
    */
    addUserToRoom(user: ConnectedUser, roomId: string): boolean {
        const room = this.getRoomFromId(roomId);
        if(!room) return false;
        if(room.member.includes(user)) return false;
        
        room.member.push(user);
        return true;
    }

    /**
     * [returns the username associated to a given token]
     * This function looks for the provided token in the connected-useres-array
     * and returns the associated username.
     * 
     * @param {string} token - token that a socket provided for an event
     * @returns {string} username associated to the given token
    */
    async userFromToken(token: string): Promise<ConnectedUser | null> {
        for (const user of this.connectedUsers) {
            if(user.tokens.includes(token)) return user;
        }
        return null;
    }

    /**
     * [checks if the provided token is a validated token]
     * This function returns if the provided token is present in the
     * connected-useres-array.
     * 
     * @param {string} token - token that a socket provided to authenticate an user
     * @returns {Promise<boolean>} true, if token is authenticated, else false 
    */
    validateToken(token: string): boolean {
        let valid = false;
        for (const user of this.connectedUsers) {
            if(user.tokens.includes(token)) valid = true;
        }
        return valid;
    }
    
    /**
     * [creates an user-entry in database]
     * This function creates a new user-entry into the database and 
     * returns it.  
     * 
     * @param {string} name - the name of the user
     * @param {string} surname - the surname of the user
     * @param {string} company_email - the email of the user
     * @param {string} company_number - the number of the user
     * @param {string} department - the department of the user
     * @param {string} password - password of the user 
     * @returns {Promise<User | null>} the user-entry created in the database
    */
    async registerUser(name: string, surname: string, company_email: string, company_number: string, department: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ 
            where: { company_email },
         });
        if(user) return null;

        const hashedPassword = await this.hashPassword(password);

        const newUser = this.userRepository.create({
           name,
           surname,
           company_email,
           company_number,
           department,
           password: hashedPassword,
        });
        
        return await this.userRepository.save(newUser);
    }
    
    /**
     * [checks if the provided user-credentials are associated to an registered account]
     * This function searches an user-entry in the database by username and matches it 
     * against the provided password.
     * 
     * @param {string} username - username of the user
     * @param {string} password - password of the user
     * @returns {Promise<User | null>} user-entry (if present)
    */
    async validateUser(company_email: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ 
           where: { company_email },
        });
        
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        
        return null;
    }


    /**
     * [updates the status from the user]
     * This function filters through the connected users from the given email
     * and changes the status from the given status
     * 
     */
    updateUserStatus(status: string, company_email: string): boolean {
        for(const user of this.connectedUsers) {
            if(user.company_email === company_email) {
                user.status = status;
                return true;
            }
        }
        return false;
    }

    /**
     * [creates a new chat-room as an owner with the provided name]
     * 
     * @param {string} token - token associated to the owner
     * @param {string} name - name of the new room
     * @returns {boolean} if the action was successful or not
     */
    async createChatRoom(token: string, name: string): Promise<boolean> {
        const owner: ConnectedUser = await this.userFromToken(token);
        const id = this.generateRandomId(8);
        if(this.getRoomsArray().filter(roomObj => roomObj.name === name).length > 0) return false;

        const newRoom: ChatRoom = {
            id: id,
            name: name,
            owner: owner,
            member: []
        }

        this.chatRooms.push(newRoom);
        return true;
    }

    /**
     * [collects information about user-status]
     * This function gets all authenticated userIds, gets their usernames and status-data
     * and returns it. 
     * 
     * @returns { Promise<{ username: string; status: string; }[]> } user-status-data
     */
    getUserStatusArray(): UserStatus[] {
        this.userStatusArray = [];
        for (const user of this.connectedUsers) {
            this.userStatusArray.push({
                name: user.name,
                surname: user.surname,
                department: user.department,
                company_number: user.company_number,
                company_email: user.company_email,
                status: user.status
            });
        }
        return this.userStatusArray;
    }

    /**
     * [removes the user associated to the token from connected-user-array]
     * 
     * @param {string} token - the token of the user to disconnect
     */
    disconnectUserByToken(token: string): void {
        this.connectedUsers = this.connectedUsers.filter((user) => !user.tokens.includes(token));
    }

    /**
     * [checks, if the user is already authenticated]
     * 
     * @param {User} user - the provided user
     * @returns {boolean} true, if the provided user is in connected-user-array  
     */
    isUserAuthenticated(user: User): boolean {
        return this.connectedUsers.filter(conUser => conUser.id === user.id).length > 0;
    }

    /**
     * [finds the user associated to the provided id]
     * 
     * @param {number} id - id associated to a user
     * @returns {ConnectedUser} the user associated to the id
     */
    getConnectedUserById(id: number): ConnectedUser {
        return this.connectedUsers.filter(conUser => conUser.id == id).pop();
    }

    /**
     * [provides all sockets associated to a connected user for serverwide emits]
     * 
     * @returns {Socket[]} all sockets associated to a connected user
     */
    getAuthenticatedSockets(): Socket[] {
        return this.connectedUsers.map(conUser => conUser.socket);
    }

    /**
     * [generates a random id-string]
     * 
     * @param {number} length - length of the id
     * @returns {string} the id-string
     */
    generateRandomId(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters.charAt(randomIndex);
        }
      
        return result;
    }

    /**
     * [finds the room associated to the id]
     * 
     * @param {number} id - the room id
     * @returns {ChatRoom} the room 
     */
    getRoomFromId(id: string): ChatRoom {
        const room: ChatRoom = this.chatRooms.filter((room) => room.id === id).pop();
        if(!room) return null;
        return room;
    }

    /**
     * [gets all existing rooms in [name, id] format]
     *      
     * @returns {{name: string, id: string }[]} an array containing all existing rooms
     */
    getRoomsArray() {
        const roomArray: {name: string, id: string }[] = this.chatRooms.map((room) => {
            return { name: room.name,  id: room.id };
        });
        return roomArray;
    }

    /**
     * [updates the user in the database]
     * 
     * @param {string} company_email - the new company email
     * @param {string} company_number - the new company number
     * @param {string} department - the new department
     * @param {string} old_company_email - the old company email to find the user
     * @returns {string} the updated user
     */
    async updateUser(company_email: string, company_number: string, department: string, old_company_email: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { company_email: old_company_email } });
        if (!user) return null;

        user.company_email = company_email;
        user.company_number = company_number;
        user.department = department;
        this.userRepository.save(user);

        const conUser: ConnectedUser = this.connectedUsers.filter(user => user.company_email === old_company_email).pop();
        conUser.company_email = company_email;
        conUser.company_number = company_number;
        conUser.department = department;
        
        this.connectedUsers = this.connectedUsers.filter(user => user.company_email !== old_company_email);
        this.connectedUsers.push(conUser);

        return user;
    }

    /**
     * [updates the password from the user in the database]
     * 
     * @param {string} password - the new password
     * @returns {string} the updated user
     */
        async updateUserPassword(password: string, company_email: string): Promise<User | null> {
            const user = await this.userRepository.findOne({ where: { company_email: company_email } });
            if (!user) return null;

            const hashedPassword = await this.hashPassword(password);
            user.password = hashedPassword;

            this.userRepository.save(user);
            return user;
        }


    /**
     * [hashes the given password]
     * 
     * @param {string} password - password to be hashed
     * @returns {string} the hashed password
     */
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }
}
    
