import { Component, Input, OnInit } from '@angular/core';
import {
  UserMessage,
  InstantChatService
} from '../../services/instant-chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(
    private instantChatService: InstantChatService
  ) {
    this.instantChatService.newUserJoined()
      .subscribe(data => this.messageArray.push(data));

    this.instantChatService.userLeftRoom()
      .subscribe(data => this.messageArray.push(data));

    this.instantChatService.newMessageReceived()
      .subscribe(data => this.messageArray.push(data));
  };

  ngOnInit(): void {
  }

  user: string = '';
  room: string = 'chat';
  messageText: string = '';
  messageArray: UserMessage[] = [];

  join() {
    this.instantChatService.joinRoom({user: this.user, room: this.room});
  };

  leave() {
    this.instantChatService.leaveRoom({user: this.user, room: this.room});
  };

  sendMessage() {
    this.messageArray.push({ user: this.user, message: this.messageText})
    this.instantChatService.sendMessage({user: this.user, room: this.room, message: this.messageText});
    this.messageText = '';
  };

};
