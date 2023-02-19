import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

import {
  ChatMessageData,
  JoinLeaveData,
  UserMessage,
} from '../interfaces/chat.interface';

@Injectable({
  providedIn: 'root',
})
export class InstantChatService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  joinRoom(data: JoinLeaveData): void {
    console.log('joinRoom', data);
    this.socket.emit('join', data);
  }

  newUserJoined(): Observable<UserMessage> {
    return new Observable<UserMessage>((observer) => {
      this.socket.on('new user joined', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  leaveRoom(data: JoinLeaveData): void {
    this.socket.emit('leave', data);
  }

  userLeftRoom(): Observable<UserMessage> {
    return new Observable<UserMessage>((observer) => {
      this.socket.on('left room', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  sendMessage(data: ChatMessageData): void {
    this.socket.emit('message', data);
  }

  newMessageReceived(): Observable<UserMessage> {
    return new Observable<UserMessage>((observer) => {
      this.socket.on('new message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
}
