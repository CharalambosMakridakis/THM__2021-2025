import { Socket } from "dgram";

/**
 * Interface for users, that are currently have a
 * 'session'
 */
export interface ConnectedUser {
    id: number | null,
    company_email: string | null,
    name: string | null,
    surname: string | null,
    department: string | null,
    company_number:  string | null,
    status: string,
    socket: Socket,
    tokens: string[]
}

/**
 * Interface for user-status
 */
export interface UserStatus { 
    name: string,
    surname: string,
    department: string,
    company_number: string,
    company_email: string,
    status: string 
}

/**
 * Interface for chat-rooms
 */
export interface ChatRoom {
    id: string,
    name: string,
    owner: ConnectedUser,
    member: ConnectedUser[],
}

/**
 * Enums for sendFailed()
 */
export enum StatusCode {
    SUCCESS_AUTH = 200,
    SUCCESS_REGISTER = 201,
    SUCCESS_ROOM = 202,
    SUCCESS_DISCONNECT_USER = 203,
    SUCCESS_UPDATE_PROFILE = 204,
    SUCCESS_UPDATE_STATUS = 205,
    SUCCESS_ROOM_UPDATE_REQUEST = 206,
    SUCCESS_JOIN_ROOM = 207,
    SUCCESS_MESSAGE_TO_ROOM = 208,
    SUCCESS_LEAVE_ROOM = 209,
    SUCCESS_SEND_USER_STATUS_UPDATE = 210,
    SUCCESS_SEND_ROOMS_UPDATE = 211,
    SUCCESS_USERINFO = 212,
    FAILURE = 400
  }