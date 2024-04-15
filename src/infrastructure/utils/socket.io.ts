import { Socket, Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export interface CustomSocket extends Socket {
  userId?: string;
}

export interface CustomServer
  extends Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
  userId?: string;
}
