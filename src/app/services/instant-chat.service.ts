import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

export interface UserMessage {
  user: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class InstantChatService {

  constructor() { }

  private socket = io('http://localhost:3000');

  joinRoom(data: any) {
    console.log('joinRoom', data);
    this.socket.emit('join', data);
  };

  newUserJoined() {
    let observable = new Observable<UserMessage>(observer => {
      this.socket.on('new user joined', (data) => {
        observer.next(data);
      });
      return () => {this.socket.disconnect();}
    });
    return observable;
  };

  leaveRoom(data: any){
    this.socket.emit('leave', data);
  }

  userLeftRoom(){
    let observable = new Observable<UserMessage>(observer => {
      this.socket.on('left room', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    });
    return observable;
  };

  sendMessage(data: any) {
    this.socket.emit('message', data);
  };

  newMessageReceived(){
    let observable = new Observable<UserMessage>(observer => {
      this.socket.on('new message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    });
    return observable;
  };

};
