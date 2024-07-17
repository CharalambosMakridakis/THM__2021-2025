import { Socket } from "dgram";

export const UserSocketMap: Map<number, Socket> = new Map<number, Socket>();
export const SocketUserMap: Map<Socket, number> = new Map<Socket, number>();